import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateId, ID_PREFIXES } from './IdGenerator';

const EstudianteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    legajo: '',
    dni: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    carrera: '',
    email: '',
    telefono: '',
    competencias: []
  });
  const [competenciaInput, setCompetenciaInput] = useState('');
  const [legajoError, setLegajoError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar si el legajo ya existe en localStorage
  const checkLegajoUnico = (legajo) => {
    const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    return !estudiantes.some(est => est.legajo === legajo);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'telefono' || name === 'dni') { // Added dni here
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));
    } else if (name === 'legajo') {
      const soloNumeros = value.replace(/[^0-9]/g, '').slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));

      // Validar unicidad solo cuando tenga 5 dígitos
      if (soloNumeros.length === 5) {
        const esUnico = checkLegajoUnico(soloNumeros);
        setLegajoError(esUnico ? null : 'Este legajo ya está registrado');
      } else {
        setLegajoError(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación final antes de enviar
    if (formData.legajo.length !== 5) {
      setLegajoError('El legajo debe tener 5 dígitos');
      return;
    }

    if (!checkLegajoUnico(formData.legajo)) {
      setLegajoError('Este legajo ya está registrado');
      return;
    }

    setIsSubmitting(true);

    try {
      const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
      const nuevosEstudiantes = [...estudiantes, {
        ...formData,
        id: generateId(ID_PREFIXES.ESTUDIANTE)
      }];

      localStorage.setItem('estudiantes', JSON.stringify(nuevosEstudiantes));
      navigate('/estudiantes');
    } catch (error) {
      console.error('Error al guardar el estudiante:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="estudiante-form"> {/* Added parent div with class */}
      <h2>Registrar Nuevo Estudiante</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row"> {/* Grouping fields in a row */}
          <div className={`form-group col-md-6 ${legajoError ? 'has-error' : ''}`}>
            <label htmlFor="legajo">Legajo</label>
            <input
              id="legajo"
              type="text"
              name="legajo"
              value={formData.legajo}
              onChange={handleChange}
              pattern="[0-9]{5}"
              title="El legajo debe contener exactamente 5 dígitos"
              required
              className="form-control" // Added class
            />
            {legajoError && <span className="error-message">{legajoError}</span>}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="dni">DNI</label>
            <input
              id="dni"
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              pattern="[0-9]{8}"
              title="El DNI debe contener exactamente 8 dígitos"
              required
              className="form-control" // Added class
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="form-control" // Added class
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="form-control" // Added class
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
            <input
              id="fechaNacimiento"
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
              className="form-control" // Added class
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="carrera">Carrera</label>
            <input
              id="carrera"
              type="text"
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
              required
              className="form-control" // Added class
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control" // Added class
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              pattern="[0-9]*"
              required
              className="form-control" // Added class
            />
          </div>
        </div>

        <div className="competencias-section">
          <label>Competencias</label>
          <div className="competencias-input">
            <input
              type="text"
              placeholder="Añadir competencia"
              value={competenciaInput}
              onChange={(e) => setCompetenciaInput(e.target.value)}
              disabled={formData.competencias.length >= 10}
              className="form-control" // Added class
            />
            <button
              type="button"
              onClick={handleAddCompetencia}
              disabled={!competenciaInput.trim() || formData.competencias.length >= 10}
            >
              +
            </button>
          </div>

          {formData.competencias.length >= 10 && (
            <p className="info-message">Máximo 10 competencias</p>
          )}

          <ul className="competencias-list">
            {formData.competencias.map((competencia, index) => (
              <li key={index}>
                {competencia}
                <button
                  type="button"
                  onClick={() => handleRemoveCompetencia(index)}
                  aria-label={`Eliminar competencia ${competencia}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting || legajoError || formData.legajo.length !== 5}
            className="btn btn-primary" // Added class
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Estudiante'}
          </button>
          <button
            type="button"
            className="btn btn-secondary" // Added secondary button
            onClick={() => navigate('/estudiantes')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EstudianteForm;