import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EstudianteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [competenciaInput, setCompetenciaInput] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('estudiantes')) || [];
    const encontrado = data.find(e => e.id === id);
    setEstudiante(encontrado);
    setFormData(encontrado);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'telefono' || name === 'dni' || name === 'legajo') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));
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

  const handleSave = () => {
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

  if (!estudiante) return <p>Estudiante no encontrado</p>;

  return (
    <div className="estudiante-detail">
      <h2>Detalle del Estudiante</h2>

      {editMode ? (
        <form className="edit-form">
          <div className="form-group">
            <label>Legajo</label>
            <input 
              name="legajo" 
              value={formData.legajo || ''} 
              onChange={handleChange} 
              pattern="[0-9]{5}"
              required
            />
          </div>

          <div className="form-group">
            <label>DNI</label>
            <input 
              name="dni" 
              value={formData.dni || ''} 
              onChange={handleChange} 
              pattern="[0-9]{8}"
              required
            />
          </div>

          <div className="form-group">
            <label>Nombre</label>
            <input 
              name="nombre" 
              value={formData.nombre || ''} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input 
              name="apellido" 
              value={formData.apellido || ''} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha de Nacimiento</label>
            <input 
              type="date" 
              name="fechaNacimiento" 
              value={formData.fechaNacimiento || ''} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Carrera</label>
            <input 
              name="carrera" 
              value={formData.carrera || ''} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email || ''} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input 
              name="telefono" 
              value={formData.telefono || ''} 
              onChange={handleChange} 
              pattern="[0-9]*"
              required
            />
          </div>

          <div className="competencias-section">
            <label>Competencias</label>
            <div className="competencias-input">
              <input 
                type="text" 
                placeholder="Añadir competencia" 
                value={competenciaInput}
                onChange={(e) => setCompetenciaInput(e.target.value)}
                disabled={formData.competencias?.length >= 10}
              />
              <button 
                type="button" 
                onClick={handleAddCompetencia}
                disabled={!competenciaInput.trim() || formData.competencias?.length >= 10}
              >
                +
              </button>
            </div>
            
            <ul className="competencias-list">
              {formData.competencias?.map((competencia, index) => (
                <li key={index}>
                  {competencia}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveCompetencia(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleSave}>Guardar Cambios</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="view-mode">
          <div className="student-info">
            <p><strong>Legajo:</strong> {estudiante.legajo}</p>
            <p><strong>DNI:</strong> {estudiante.dni}</p>
            <p><strong>Nombre:</strong> {estudiante.nombre} {estudiante.apellido}</p>
            <p><strong>Fecha de Nacimiento:</strong> {estudiante.fechaNacimiento}</p>
            <p><strong>Carrera:</strong> {estudiante.carrera}</p>
            <p><strong>Email:</strong> {estudiante.email}</p>
            <p><strong>Teléfono:</strong> {estudiante.telefono}</p>
          </div>

          {estudiante.competencias?.length > 0 && (
            <div className="competencias-section">
              <h3>Competencias</h3>
              <ul>
                {estudiante.competencias.map((competencia, index) => (
                  <li key={index}>{competencia}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="actions">
            <button onClick={() => setEditMode(true)}>Editar</button>
            <button className="delete-btn" onClick={handleDelete}>Eliminar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudianteDetail;