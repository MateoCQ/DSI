import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EstudianteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    carrera: '',
    email: '',
    telefono: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
        <input type="number" name="edad" placeholder="Edad" value={formData.edad} onChange={handleChange} required />
        <input type="text" name="carrera" placeholder="Carrera" value={formData.carrera} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
        <button type="submit">Guardar Estudiante</button>
      </form>
    </div>
  );
};

export default EstudianteForm;