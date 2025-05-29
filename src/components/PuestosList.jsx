import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const PuestosList = () => {
  const [puestos, setPuestos] = useState([]);
  const [empresas, setEmpresas] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const puestosGuardados = JSON.parse(localStorage.getItem('puestos')) || [];
    const empresasGuardadas = JSON.parse(localStorage.getItem('empresas')) || [];
    
    const empresasMap = empresasGuardadas.reduce((acc, empresa) => {
      acc[empresa.id] = empresa;
      return acc;
    }, {});
    
    setPuestos(puestosGuardados);
    setEmpresas(empresasMap);
  }, []);

  const getNombreEmpresa = (empresaId) => {
    const empresa = empresas[empresaId];
    return empresa ? empresa.nombre : `Empresa no encontrada (ID: ${empresaId})`;
  };

  const getEstadoBadge = (estado) => {
    const clases = {
      disponible: 'disponible',
      ocupado: 'ocupado',
      cerrado: 'cerrado'
    };
    return <span className={`estado-badge ${clases[estado] || ''}`}>{estado || 'disponible'}</span>;
  };

  const handleRowClick = (puestoId) => {
    navigate(`/puestos/${puestoId}`);
  };

  return (
    <div className="puestos-list-container">
      <div className="puestos-header">
        <h2>Listado de Puestos</h2>
        <Link to="/puestos/nuevo" className="add-puesto-btn">
          Agregar Puesto
        </Link>
      </div>
      
      <div className="puestos-table-container">
        <table className="puestos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {puestos.length > 0 ? (
              puestos.map(puesto => (
                <tr 
                  key={puesto.id} 
                  onClick={() => handleRowClick(puesto.id)}
                  className="puesto-row"
                >
                  <td>
                    <div className="puesto-nombre">{puesto.nombre}</div>
                  </td>
                  <td className="empresa-cell">{getNombreEmpresa(puesto.empresaId)}</td>
                  <td className="estado-cell">{getEstadoBadge(puesto.estado)}</td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="4">
                  <div className="empty-message">
                    No hay puestos registrados. <Link to="/puestos/nuevo">Crear primer puesto</Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PuestosList;