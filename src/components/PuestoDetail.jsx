import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const PuestoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [puesto, setPuesto] = useState(null);
  const [formData, setFormData] = useState({ competencias: [] });
  const [empresa, setEmpresa] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [competenciaInput, setCompetenciaInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cargarDatosPuesto = () => {
      try {
        const puestos = JSON.parse(localStorage.getItem('puestos')) || [];
        const puestoEncontrado = puestos.find(p => p.id === id);

        if (!puestoEncontrado) {
          setError('Puesto no encontrado');
          setLoading(false);
          return;
        }

        setPuesto(puestoEncontrado);
        setFormData({
          ...puestoEncontrado,
          competencias: puestoEncontrado.competencias || []
        });

        const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
        const empresaAsociada = empresas.find(e => e.id === puestoEncontrado.empresaId);
        setEmpresa(empresaAsociada);
      } catch (err) {
        console.error("Error cargando datos del puesto:", err);
        setError('Error al cargar los datos del puesto');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosPuesto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.descripcion?.trim()) newErrors.descripcion = 'La descripción es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCompetencia = () => {
    if (competenciaInput.trim() && !formData.competencias.includes(competenciaInput.trim())) {
      setFormData(prev => ({
        ...prev,
        competencias: [...prev.competencias, competenciaInput.trim()]
      }));
      setCompetenciaInput('');
    }
  };

  const handleRemoveCompetencia = (index) => {
    setFormData(prev => ({
      ...prev,
      competencias: prev.competencias.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const puestos = JSON.parse(localStorage.getItem('puestos')) || [];
    const actualizados = puestos.map(p => p.id === id ? formData : p);
    localStorage.setItem('puestos', JSON.stringify(actualizados));
    setPuesto(formData);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este puesto?')) {
      const puestos = JSON.parse(localStorage.getItem('puestos')) || [];
      const filtrados = puestos.filter(p => p.id !== id);
      localStorage.setItem('puestos', JSON.stringify(filtrados));
      navigate('/puestos');
    }
  };

  const getEstadoBadge = (estado) => {
    const clases = {
      disponible: 'badge-success',
      ocupado: 'badge-danger',
      finalizado: 'badge-secondary'
    };
    return <span className={`badge ${clases[estado] || 'badge-secondary'}`}>{estado}</span>;
  };

  if (loading) {
    return <div className="loading text-center mt-5">Cargando detalles del puesto...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  if (!puesto) {
    return <div className="alert alert-warning text-center mt-5">No se encontró el puesto solicitado</div>;
  }

  return (
    <div className="puesto-detail container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Detalle del Puesto</h2>
        </div>

        <div className="card-body">
          {editMode ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="section-title mb-3">Información del Puesto</h4>
                  <div className="form-group mb-3">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="estado">Estado:</label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado || 'disponible'}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="ocupado">Ocupado</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <h4 className="section-title mb-3">Descripción y Competencias</h4>
                  <div className="form-group mb-3">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion || ''}
                      onChange={handleChange}
                      rows="4"
                      className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                    />
                    {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label>Competencias requeridas:</label>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Añadir competencia"
                        value={competenciaInput}
                        onChange={(e) => setCompetenciaInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetencia())}
                        className="form-control"
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          onClick={handleAddCompetencia}
                          disabled={!competenciaInput.trim()}
                          className="btn btn-outline-secondary"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>
                    <ul className="list-group list-group-flush mt-2">
                      {formData.competencias.map((competencia, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {competencia}
                          <button
                            type="button"
                            onClick={() => handleRemoveCompetencia(index)}
                            className="btn btn-sm btn-danger btneli"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                    {formData.competencias.length === 0 && (
                      <small className="form-text text-muted">Añade al menos una competencia si es necesario.</small>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-actions text-right mt-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!formData.nombre?.trim() || !formData.descripcion?.trim() || Object.keys(errors).length > 0}
                  className="btn btn-primary mr-2"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setErrors({}); setFormData(puesto); setCompetenciaInput(''); }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="section-title mb-3">Información General</h4>
                  <div className="info-item mb-2">
                    <span className="info-label">Nombre:</span>
                    <span>{puesto.nombre}</span>
                  </div>
                  <div className="info-item mb-2">
                    <span className="info-label">Estado:</span>
                    {getEstadoBadge(puesto.estado)}
                  </div>
                  <div className="info-item mb-2">
                    <span className="info-label">Descripción:</span>
                    <p className="text-muted">{puesto.descripcion}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <h4 className="section-title mb-3">Empresa Asociada</h4>
                  <div className="related-info-card">
                    {empresa ? (
                      <>
                        <div className="info-item mb-2">
                          <span className="info-label">Nombre de la Empresa:</span>
                          <Link to={`/empresas/${empresa.id}`} className="text-primary">
                            {empresa.nombre}
                          </Link>
                        </div>
                        <div className="info-item mb-2">
                          <span className="info-label">Sector:</span>
                          <span>{empresa.sector}</span>
                        </div>
                        <div className="info-item mb-2">
                          <span className="info-label">Dirección:</span>
                          <span>{empresa.direccion}</span>
                        </div>
                      </>
                    ) : (
                      <div className="alert alert-warning">Empresa no encontrada o no asociada</div>
                    )}
                  </div>

                  <h4 className="section-title mt-4 mb-3">Competencias Requeridas</h4>
                  {puesto.competencias && puesto.competencias.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {puesto.competencias.map((competencia, index) => (
                        <li key={index} className="list-group-item">{competencia}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No se han especificado competencias requeridas.</p>
                  )}
                </div>
              </div>

              <div className="mt-4 text-right">
                <button onClick={() => setEditMode(true)} className="btn btn-primary mr-2">
                  Editar
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuestoDetail;