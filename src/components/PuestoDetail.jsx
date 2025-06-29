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
  const [competenciaInput, setCompetenciaInput] = useState('');

  useEffect(() => {
    const puestos = JSON.parse(localStorage.getItem('puestos')) || [];
    const puestoEncontrado = puestos.find(p => p.id === id);
    
    if (puestoEncontrado) {
      setPuesto(puestoEncontrado);
      setFormData({
        ...puestoEncontrado,
        competencias: puestoEncontrado.competencias || []
      });
      
      const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
      const empresaAsociada = empresas.find(e => e.id === puestoEncontrado.empresaId);
      setEmpresa(empresaAsociada);
    }
    
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      ocupado: 'badge-warning'
    };
    return <span className={`badge ${clases[estado] || 'badge-secondary'}`}>{estado}</span>;
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!puesto) {
    return <div className="error">Puesto no encontrado</div>;
  }

  return (
    <div className="puesto-detail">
      <h2>Detalle del Puesto</h2>

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
            <label>Descripción</label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion || ''} 
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Competencias requeridas</label>
            <div className="competencias-section">
              <div className="competencias-input">
                <input 
                  type="text" 
                  placeholder="Añadir competencia" 
                  value={competenciaInput}
                  onChange={(e) => setCompetenciaInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCompetencia()}
                />
                <button 
                  type="button" 
                  onClick={handleAddCompetencia}
                  disabled={!competenciaInput.trim()}
                >
                  +
                </button>
              </div>
              <ul className="competencias-list">
                {formData.competencias.map((competencia, index) => (
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
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleSave}>Guardar Cambios</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="view-mode">
          <div className="info-section">
            <h3>Nombre</h3>
            <p>{puesto.nombre}</p>
          </div>

          <div className="info-section">
            <h3>Estado</h3>
            <p>{getEstadoBadge(puesto.estado)}</p>
          </div>

          <div className="info-section">
            <h3>Descripción</h3>
            <p>{puesto.descripcion}</p>
          </div>

          <div className="info-section">
            <h3>Empresa</h3>
            {empresa ? (
              <div className="empresa-info">
                <Link to={`/empresas/${empresa.id}`} className="empresa-link">
                  <h4>{empresa.nombre}</h4>
                </Link>
                <p>{empresa.sector}</p>
                <p>{empresa.direccion}</p>
              </div>
            ) : (
              <p>Empresa no encontrada</p>
            )}
          </div>

          <div className="info-section">
            <h3>Competencias Requeridas</h3>
            {puesto.competencias && puesto.competencias.length > 0 ? (
              <ul className="competencias-list">
                {puesto.competencias.map((competencia, index) => (
                  <li key={index}>{competencia}</li>
                ))}
              </ul>
            ) : (
              <p>No se han especificado competencias requeridas</p>
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

export default PuestoDetail;