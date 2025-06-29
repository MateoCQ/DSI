import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateId, ID_PREFIXES } from './IdGenerator';

const PuestoForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    competencias: [],
    empresaId: '',
    estado: 'disponible'
  });
  const [empresas, setEmpresas] = useState([]);
  const [competenciaInput, setCompetenciaInput] = useState('');

  useEffect(() => {
    const empresasRegistradas = JSON.parse(localStorage.getItem('empresas')) || [];
    setEmpresas(empresasRegistradas);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    const puestos = JSON.parse(localStorage.getItem('puestos')) || [];
    const nuevosPuestos = [...puestos, { 
      ...formData, 
      id: generateId(ID_PREFIXES.PUESTO)
    }];
    localStorage.setItem('puestos', JSON.stringify(nuevosPuestos));
    navigate('/puestos');
  };

  return (
    <div className="puesto-form">
      <h2>Registrar Nuevo Puesto</h2>
      <form onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="nombre">Nombre del Puesto</label>
    <input 
      id="nombre"
      type="text" 
      name="nombre" 
      value={formData.nombre} 
      onChange={handleChange} 
      required 
    />
  </div>

  <div className="form-group">
    <label htmlFor="descripcion">Descripción del Puesto</label>
    <textarea 
      id="descripcion"
      name="descripcion" 
      value={formData.descripcion} 
      onChange={handleChange} 
      required 
      className="form-textarea"
    />
  </div>

  <div className="form-group">
    <label htmlFor="empresaId">Empresa</label>
    <select 
      id="empresaId"
      name="empresaId" 
      value={formData.empresaId} 
      onChange={handleChange} 
      required
    >
      <option value="">Seleccione una empresa</option>
      {empresas.map(empresa => (
        <option key={empresa.id} value={empresa.id}>
          {empresa.nombre}
        </option>
      ))}
    </select>
  </div>

  <div className="competencias-section">
    <label>Competencias requeridas</label>
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

  <button type="submit">Guardar Puesto</button>
</form>

    </div>
  );
};

export default PuestoForm;