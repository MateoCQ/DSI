import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateId, ID_PREFIXES } from './IdGenerator';

const EmpresaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    sector: '',
    contacto: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    const nuevasEmpresas = [...empresas, { 
      ...formData, 
      id: generateId(ID_PREFIXES.EMPRESA)
    }];
    localStorage.setItem('empresas', JSON.stringify(nuevasEmpresas));
    navigate('/empresas');
  };

  return (
    <div className="empresa-form">
      <h2>Registrar Nueva Empresa</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} required />
        <input 
          type="tel" 
          name="telefono" 
          placeholder="Teléfono" 
          value={formData.telefono} 
          onChange={handleChange} 
          pattern="[0-9]*"
          required 
        />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="sector" placeholder="Sector" value={formData.sector} onChange={handleChange} required />
        <textarea name="contacto" placeholder="Información de Contacto adicional" value={formData.contacto} onChange={handleChange} className="form-textarea"/>
        <button type="submit">Guardar Empresa</button>
      </form>
    </div>
  );
};

export default EmpresaForm;