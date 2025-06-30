import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EstudianteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    competencias: []
  });
  const [competenciaInput, setCompetenciaInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Added error state for consistency

  useEffect(() => {
    const cargarDatos = () => {
      try {
        const data = JSON.parse(localStorage.getItem('estudiantes')) || [];
        const encontrado = data.find(e => e.id === id);

        if (!encontrado) {
          setError('Estudiante no encontrado');
          setLoading(false);
          return;
        }

        setEstudiante(encontrado);
        setFormData({
          ...encontrado,
          competencias: encontrado.competencias || []
        });
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError('Error al cargar los datos del estudiante');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.legajo?.trim()) newErrors.legajo = 'Legajo es requerido';
    else if (!/^\d{5}$/.test(formData.legajo)) newErrors.legajo = 'Legajo debe tener 5 dígitos';

    if (!formData.dni?.trim()) newErrors.dni = 'DNI es requerido';
    else if (!/^\d{8}$/.test(formData.dni)) newErrors.dni = 'DNI debe tener 8 dígitos';

    if (!formData.nombre?.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!formData.apellido?.trim()) newErrors.apellido = 'Apellido es requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Fecha de nacimiento es requerida';
    if (!formData.carrera?.trim()) newErrors.carrera = 'Carrera es requerida';

    if (!formData.email?.trim()) newErrors.email = 'Email es requerido';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email no válido';

    if (!formData.telefono?.trim()) newErrors.telefono = 'Teléfono es requerido';
    else if (!/^\d+$/.test(formData.telefono)) newErrors.telefono = 'Solo números permitidos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono' || name === 'dni' || name === 'legajo') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddCompetencia = () => {
    if (competenciaInput.trim() && formData.competencias.length < 10) {
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

    const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    const actualizados = estudiantes.map(e => e.id === id ? formData : e);
    localStorage.setItem('estudiantes', JSON.stringify(actualizados));
    setEstudiante(formData);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
      const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
      const filtrados = estudiantes.filter(e => e.id !== id);
      localStorage.setItem('estudiantes', JSON.stringify(filtrados));
      navigate('/estudiantes');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return <div className="loading">Cargando detalles del estudiante...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>; // Using Bootstrap alert
  }

  if (!estudiante) {
    return <div className="alert alert-warning">No se encontró el estudiante solicitado</div>; // Using Bootstrap alert
  }

  return (
    <div className="estudiante-detail container">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Detalle del Estudiante</h2>
        </div>

        <div className="card-body">
          {editMode ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="section-title">Información Personal</h4>
                  <div className="form-group mb-3">
                    <label>Legajo:</label>
                    <input
                      name="legajo"
                      value={formData.legajo || ''}
                      onChange={handleChange}
                      maxLength="5"
                      className={`form-control ${errors.legajo ? 'is-invalid' : ''}`}
                    />
                    {errors.legajo && <div className="invalid-feedback">{errors.legajo}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label>DNI:</label>
                    <input
                      name="dni"
                      value={formData.dni || ''}
                      onChange={handleChange}
                      maxLength="8"
                      className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
                    />
                    {errors.dni && <div className="invalid-feedback">{errors.dni}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label>Nombre:</label>
                    <input
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label>Apellido:</label>
                    <input
                      name="apellido"
                      value={formData.apellido || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                    />
                    {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label>Fecha de Nacimiento:</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                    />
                    {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <h4 className="section-title">Información de Contacto y Carrera</h4>
                  <div className="form-group mb-3">
                    <label>Carrera:</label>
                    <input
                      name="carrera"
                      value={formData.carrera || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.carrera ? 'is-invalid' : ''}`}
                    />
                    {errors.carrera && <div className="invalid-feedback">{errors.carrera}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label>Teléfono:</label>
                    <input
                      name="telefono"
                      value={formData.telefono || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>

                  <div className="competencias-section mb-3">
                    <label>Competencias:</label>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Añadir competencia"
                        value={competenciaInput}
                        onChange={(e) => setCompetenciaInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetencia())}
                        disabled={formData.competencias?.length >= 10}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={handleAddCompetencia}
                        disabled={!competenciaInput.trim() || formData.competencias?.length >= 10}
                        className="btn btn-outline-secondary"
                      >
                        +
                      </button>
                    </div>

                    {formData.competencias?.length >= 10 && (
                      <p className="text-warning mt-2">Máximo 10 competencias</p>
                    )}

                    <ul className="list-group mt-2">
                      {formData.competencias?.map((competencia, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {competencia}
                          <button
                            type="button"
                            onClick={() => handleRemoveCompetencia(index)}
                            className="btn btn-sm btn-danger"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="form-actions text-right">
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary me-2" // Use me-2 for margin-right
                  disabled={
                    !formData.legajo || !formData.dni || !formData.nombre ||
                    !formData.apellido || !formData.fechaNacimiento ||
                    !formData.carrera || !formData.email || !formData.telefono ||
                    errors.legajo || errors.dni || errors.nombre ||
                    errors.apellido || errors.fechaNacimiento ||
                    errors.carrera || errors.email || errors.telefono
                  }
                >
                  Guardar Cambios
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="section-title">Información Personal</h4>
                  <div className="info-item">
                    <span className="info-label">Legajo:</span>
                    <span>{estudiante.legajo}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">DNI:</span>
                    <span>{estudiante.dni}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Nombre Completo:</span>
                    <span>{estudiante.nombre} {estudiante.apellido}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de Nacimiento:</span>
                    <span>{formatDate(estudiante.fechaNacimiento)}</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <h4 className="section-title">Información de Contacto y Carrera</h4>
                  <div className="info-item">
                    <span className="info-label">Carrera:</span>
                    <span>{estudiante.carrera}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span>{estudiante.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Teléfono:</span>
                    <span>{estudiante.telefono}</span>
                  </div>
                </div>
              </div>

              {estudiante.competencias?.length > 0 && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="related-info-card"> {/* Using related-info-card for consistency */}
                      <h3 className="card-title">Competencias</h3>
                      <ul className="list-group list-group-flush"> {/* Using Bootstrap list-group */}
                        {estudiante.competencias.map((competencia, index) => (
                          <li key={index} className="list-group-item">{competencia}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 text-right">
                <button onClick={() => setEditMode(true)} className="btn btn-primary me-2">
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

export default EstudianteDetail;