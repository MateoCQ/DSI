import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmpresaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('empresas')) || [];
    const encontrada = data.find(e => e.id === id);
    setEmpresa(encontrada);
    setFormData(encontrada);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    const actualizadas = empresas.map(e => e.id === id ? formData : e);
    localStorage.setItem('empresas', JSON.stringify(actualizadas));
    setEmpresa(formData);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa?')) {
      const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
      const filtradas = empresas.filter(e => e.id !== id);
      localStorage.setItem('empresas', JSON.stringify(filtradas));
      navigate('/empresas');
    }
  };

  if (!empresa) return <p>Empresa no encontrada</p>;

  return (
    <div className="empresa-detail">
      <h2>Detalle de la Empresa</h2>

      {editMode ? (
        <form className="edit-form">
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
            <label>Sector</label>
            <input 
              name="sector" 
              value={formData.sector || ''} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input 
              name="direccion" 
              value={formData.direccion || ''} 
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
            <label>Información de Contacto</label>
            <textarea 
              name="contacto" 
              value={formData.contacto || ''} 
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleSave}>Guardar Cambios</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="view-mode">
          <div className="empresa-info">
            <p><strong>Nombre:</strong> {empresa.nombre}</p>
            <p><strong>Sector:</strong> {empresa.sector}</p>
            <p><strong>Dirección:</strong> {empresa.direccion}</p>
            <p><strong>Teléfono:</strong> {empresa.telefono}</p>
            <p><strong>Email:</strong> {empresa.email}</p>
            {empresa.contacto && (
              <>
                <p><strong>Información de Contacto:</strong></p>
                <p className="contacto-info">{empresa.contacto}</p>
              </>
            )}
          </div>

          <div className="actions">
            <button onClick={() => setEditMode(true)}>Editar</button>
            <button className="delete-btn" onClick={handleDelete}>Eliminar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaDetail;