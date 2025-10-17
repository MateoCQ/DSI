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
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            pattern="[0-9]*"
            required
            className="form-control" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="sector">Sector</label>
          <input
            id="sector"
            type="text"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            required
            className="form-control" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="contacto">Información de Contacto adicional</label>
          <textarea
            id="contacto"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-actions"> 
          <button type="submit" className="btn btn-primary">
            Guardar Empresa
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/empresas')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmpresaForm;