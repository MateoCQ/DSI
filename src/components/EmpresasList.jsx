import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmpresasList = () => {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    const storedEmpresas = JSON.parse(localStorage.getItem('empresas')) || [];
    setEmpresas(storedEmpresas);
  }, []);

  return (
    <div className="empresas-list">
      <h2>Empresas Registradas</h2>
      <Link to="/empresas/nueva" className="btn-add">Registrar Nueva Empresa</Link>
      
      {empresas.length === 0 ? (
        <p>No hay empresas registradas</p>
      ) : (
        <ul>
          {empresas.map(empresa => (
            <li key={empresa.id}>
              <Link to={`/empresas/${empresa.id}`}>
                <strong>{empresa.nombre}</strong> - {empresa.sector}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmpresasList;