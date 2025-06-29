import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const PasantiaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pasantia, setPasantia] = useState(null);
  const [puesto, setPuesto] = useState(null);
  const [estudiante, setEstudiante] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    estado: '',
    salario: 0,
    horasSemanales: 0
  });

  useEffect(() => {
    const cargarDatos = () => {
      try {
        // Cargar todos los datos necesarios
        const pasantias = JSON.parse(localStorage.getItem('pasantias')) || [];
        const puestos = JSON.parse(localStorage.getItem('puestos')) || [];
        const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
        const empresas = JSON.parse(localStorage.getItem('empresas')) || [];

        // Buscar la pasantía actual
        const encontrada = pasantias.find(p => p.id === id);
        if (!encontrada) {
          setError('Pasantía no encontrada');
          setLoading(false);
          return;
        }

        setPasantia(encontrada);
        setFormData({
          estado: encontrada.estado,
          salario: encontrada.salario,
          horasSemanales: encontrada.horasSemanales
        });

        // Buscar información relacionada
        const puestoRelacionado = puestos.find(p => p.id === encontrada.puestoId);
        setPuesto(puestoRelacionado);

        const estudianteRelacionado = estudiantes.find(e => e.id === encontrada.estudianteId);
        setEstudiante(estudianteRelacionado);

        // Buscar empresa relacionada con el puesto
        if (puestoRelacionado) {
          const empresaRelacionada = empresas.find(e => e.id === puestoRelacionado.empresaId);
          setEmpresa(empresaRelacionada);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError('Error al cargar los datos de la pasantía');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const pasantias = JSON.parse(localStorage.getItem('pasantias')) || [];
    const pasantiaActualizada = {
      ...pasantia,
      ...formData
    };

    const actualizadas = pasantias.map(p => p.id === id ? pasantiaActualizada : p);
    localStorage.setItem('pasantias', JSON.stringify(actualizadas));
    setPasantia(pasantiaActualizada);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta pasantía?')) {
      const pasantias = JSON.parse(localStorage.getItem('pasantias')) || [];
      const filtradas = pasantias.filter(p => p.id !== id);
      localStorage.setItem('pasantias', JSON.stringify(filtradas));
      navigate('/pasantias');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getEstadoBadge = (estado) => {
    const clases = {
      'En curso': 'badge-primary',
      'Finalizada': 'badge-success',
      'Cancelada': 'badge-danger'
    };
    return <span className={`badge ${clases[estado] || 'badge-secondary'}`}>{estado}</span>;
  };

  if (loading) {
    return <div className="loading">Cargando detalles de pasantía...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!pasantia) {
    return <div className="alert alert-warning">No se encontró la pasantía solicitada</div>;
  }

  return (
    <div className="pasantia-detail container">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Detalle de Pasantía</h2>
        </div>
        
        <div className="card-body">
          {editMode ? (
            <form>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="section-title">Información General</h4>
                  <div className="form-group">
                    <label>Estado:</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="En curso">En curso</option>
                      <option value="Finalizada">Finalizada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha Inicio:</span>
                    <span>{formatDate(pasantia.fechaInicio)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha Fin:</span>
                    <span>{formatDate(pasantia.fechaFin)}</span>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h4 className="section-title">Detalles Económicos</h4>
                  <div className="form-group">
                    <label>Salario:</label>
                    <input
                      type="number"
                      name="salario"
                      value={formData.salario}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Horas Semanales:</label>
                    <input
                      type="number"
                      name="horasSemanales"
                      value={formData.horasSemanales}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions text-right">
                <button 
                  type="button" 
                  className="btn btn-primary mr-2"
                  onClick={handleSave}
                >
                  Guardar
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="section-title">Información General</h4>
                  <div className="info-item">
                    <span className="info-label">Estado:</span>
                    {getEstadoBadge(pasantia.estado)}
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha Inicio:</span>
                    <span>{formatDate(pasantia.fechaInicio)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha Fin:</span>
                    <span>{formatDate(pasantia.fechaFin)}</span>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h4 className="section-title">Detalles Económicos</h4>
                  <div className="info-item">
                    <span className="info-label">Salario:</span>
                    <span>${parseFloat(pasantia.salario).toLocaleString('es-ES')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Horas Semanales:</span>
                    <span>{pasantia.horasSemanales} horas</span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="related-info-card">
                    <h3 className="card-title">Puesto</h3>
                    {puesto ? (
                      <>
                        <div className="info-item">
                          <span className="info-label">Nombre:</span>
                          <span>{puesto.nombre}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Descripción:</span>
                          <span>{puesto.descripcion || 'No disponible'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Empresa:</span>
                          {empresa ? (
                            <Link to={`/empresas/${empresa.id}`} className="text-primary">
                              {empresa.nombre}
                            </Link>
                          ) : (
                            <span>No especificada</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="alert alert-warning">Puesto no encontrado</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="related-info-card">
                    <h3 className="card-title">Estudiante</h3>
                    {estudiante ? (
                      <>
                        <div className="info-item">
                          <span className="info-label">Nombre:</span>
                          <span>{estudiante.nombre} {estudiante.apellido}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Carrera:</span>
                          <span>{estudiante.carrera || 'No especificada'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Contacto:</span>
                          <span>{estudiante.email || estudiante.telefono || 'No disponible'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="alert alert-warning">Estudiante no encontrado</div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                {!editMode && (
            <div>
              <button 
                className="btn btn-primary mr-2"
                onClick={() => setEditMode(true)}
              >
                Editar
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasantiaDetail;