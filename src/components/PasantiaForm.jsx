import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateId, ID_PREFIXES } from './IdGenerator';

const PasantiaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    puestoId: '',
    estudianteId: '',
    fechaInicio: '',
    fechaFin: '',
    salario: '',
    horasSemanales: '',
    estado: 'En curso'
  });
  const [puestos, setPuestos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [empresas, setEmpresas] = useState([]); 
  const [puestosDisponibles, setPuestosDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const puestosData = JSON.parse(localStorage.getItem('puestos')) || [];
        const empresasData = JSON.parse(localStorage.getItem('empresas')) || [];
        const estudiantesData = JSON.parse(localStorage.getItem('estudiantes')) || [];

        const puestosConEmpresa = puestosData.map(puesto => {
          const empresaAsociada = empresasData.find(e => e.id === puesto.empresaId);
          return {
            ...puesto,
            empresaNombre: empresaAsociada ? empresaAsociada.nombre : 'Sin empresa'
          };
        });

        setPuestos(puestosConEmpresa);
        setEmpresas(empresasData);
        setPuestosDisponibles(puestosConEmpresa.filter(p => p.estado === 'disponible'));
        setEstudiantes(estudiantesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
      setError('La fecha de finalización no puede ser anterior a la fecha de inicio');
      return;
    }

    if (formData.salario <= 0) {
      setError('El salario debe ser mayor a cero');
      return;
    }

    if (formData.horasSemanales <= 0 || formData.horasSemanales > 40) {
      setError('Las horas semanales deben estar entre 1 y 40');
      return;
    }

    const puestoSeleccionado = puestos.find(p => p.id === formData.puestoId);
    if (!puestoSeleccionado || puestoSeleccionado.estado !== 'disponible') {
      setError('El puesto seleccionado ya no está disponible');
      return;
    }

    const pasantias = JSON.parse(localStorage.getItem('pasantias')) || [];
    const puestosActuales = JSON.parse(localStorage.getItem('puestos')) || [];

    const nuevaPasantia = {
      ...formData,
      id: generateId(ID_PREFIXES.PASANTIA || 'pst'),
      fechaCreacion: new Date().toISOString(),
      puestoNombre: puestoSeleccionado.nombre,
      empresaNombre: puestoSeleccionado.empresaNombre,
      estudianteNombre: estudiantes.find(e => e.id === formData.estudianteId)?.nombre + ' ' + 
                       estudiantes.find(e => e.id === formData.estudianteId)?.apellido
    };

    const puestosActualizados = puestosActuales.map(puesto => {
      if (puesto.id === formData.puestoId) {
        return { ...puesto, estado: 'ocupado' };
      }
      return puesto;
    });

    try {
      localStorage.setItem('pasantias', JSON.stringify([...pasantias, nuevaPasantia]));
      localStorage.setItem('puestos', JSON.stringify(puestosActualizados));

      const puestosActualizadosConEmpresa = puestosActualizados.map(p => {
        const empresa = empresas.find(e => e.id === p.empresaId);
        return {
          ...p,
          empresaNombre: empresa ? empresa.nombre : 'Sin empresa'
        };
      });
      
      setPuestos(puestosActualizadosConEmpresa);
      setPuestosDisponibles(puestosActualizadosConEmpresa.filter(p => p.estado === 'disponible'));
      
      navigate('/pasantias');
    } catch (err) {
      setError('Error al guardar los datos. Por favor intente nuevamente.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="pasantia-form">
      <h2>Registrar Nueva Pasantía</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Puesto Disponible</label>
          {puestosDisponibles.length === 0 ? (
            <div className="no-options alert alert-warning">
              No hay puestos disponibles actualmente. 
              <button 
                type="button" 
                className="btn btn-link"
                onClick={() => navigate('/puestos/nuevo')}
              >
                Crear nuevo puesto
              </button>
            </div>
          ) : (
            <select 
              name="puestoId" 
              value={formData.puestoId} 
              onChange={handleChange} 
              required
              className="form-control"
            >
              <option value="">Seleccione un puesto disponible</option>
              {puestosDisponibles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - {p.empresaNombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Estudiante</label>
          <select 
            name="estudianteId" 
            value={formData.estudianteId} 
            onChange={handleChange} 
            required
            className="form-control"
          >
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map(e => (
              <option key={e.id} value={e.id}>
                {e.nombre} {e.apellido} - {e.carrera || 'Sin carrera'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Fecha de Inicio</label>
            <input 
              type="date" 
              name="fechaInicio" 
              value={formData.fechaInicio} 
              onChange={handleChange} 
              required
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group col-md-6">
            <label>Fecha de Finalización</label>
            <input 
              type="date" 
              name="fechaFin" 
              value={formData.fechaFin} 
              onChange={handleChange} 
              required
              className="form-control"
              min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Salario</label>
            <div className="input-group">
              <input 
                type="number" 
                name="salario" 
                value={formData.salario} 
                onChange={handleChange} 
                required
                className="form-control"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group col-md-6">
            <label>Horas Semanales</label>
            <input 
              type="number" 
              name="horasSemanales" 
              value={formData.horasSemanales} 
              onChange={handleChange} 
              required
              className="form-control"
              min="1"
              max="40"
            />
          </div>
        </div>

        <div className="form-actions mt-4">
          <button type="submit" className="btn btn-primary mr-2">
            <i className="fas fa-save mr-2"></i>Guardar Pasantía
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/pasantias')}
          >
            <i className="fas fa-times mr-2"></i>Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasantiaForm;