import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PuestoDetail = () => {
  const { id } = useParams();
  const [puesto, setPuesto] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del puesto
    const puestos = JSON.parse(localStorage.getItem('puestos')) || [];
    const puestoEncontrado = puestos.find(p => p.id === parseInt(id));
    
    if (puestoEncontrado) {
      setPuesto(puestoEncontrado);
      
      // Cargar datos de la empresa asociada
      const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
      const empresaAsociada = empresas.find(e => e.id === puestoEncontrado.empresaId);
      setEmpresa(empresaAsociada);
    }
    
    setLoading(false);
  }, [id]);

  const getEstadoBadge = (estado) => {
    const clases = {
      disponible: 'badge-success',
      ocupado: 'badge-warning',
      cerrado: 'badge-danger'
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
      <div className="header">
        <h2>{puesto.nombre}</h2>
        <div className="status">{getEstadoBadge(puesto.estado)}</div>
      </div>

      <div className="section">
        <h3>Información del Puesto</h3>
        <p>{puesto.descripcion}</p>
      </div>

      <div className="section">
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

      <div className="section">
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
    </div>
  );
};

export default PuestoDetail;