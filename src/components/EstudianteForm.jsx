import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EstudianteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    edad: '',
    carrera: '',
    email: '',
    telefono: '',
    competencias: []
  });
  const [competenciaInput, setCompetenciaInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));
    } else if (name === 'legajo') {
      const soloNumeros = value.replace(/[^0-9]/g, '').slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCompetencia = () => {
    if (competenciaInput.trim()) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    const nuevosEstudiantes = [...estudiantes, { ...formData, id: Date.now() }];
    localStorage.setItem('estudiantes', JSON.stringify(nuevosEstudiantes));
    navigate('/estudiantes');
  };

  return (
    <div className="estudiante-form">
      <h2>Registrar Nuevo Estudiante</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="legajo" 
          placeholder="Legajo (5 dígitos)" 
          value={formData.legajo} 
          onChange={handleChange} 
          pattern="[0-9]{5}"
          title="El legajo debe contener exactamente 5 dígitos"
          required 
        />
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
        <input type="number" name="edad" placeholder="Edad" value={formData.edad} onChange={handleChange} required />
        <input type="text" name="carrera" placeholder="Carrera" value={formData.carrera} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input 
          type="tel" 
          name="telefono" 
          placeholder="Teléfono" 
          value={formData.telefono} 
          onChange={handleChange} 
          pattern="[0-9]*"
          required 
        />
        
        <div className="competencias-section">
          <div className="competencias-input">
            <input 
              type="text" 
              placeholder="Añadir competencia" 
              value={competenciaInput}
              onChange={(e) => setCompetenciaInput(e.target.value)}
            />
            <button type="button" onClick={handleAddCompetencia}>+</button>
          </div>
          <ul className="competencias-list">
            {formData.competencias.map((competencia, index) => (
              <li key={index}>
                {competencia}
                <button type="button" onClick={() => handleRemoveCompetencia(index)}>×</button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Guardar Estudiante</button>
      </form>
    </div>
  );
};

export default EstudianteForm;