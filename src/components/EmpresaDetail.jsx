import React from 'react';
import { useParams, Link } from 'react-router-dom';

const EmpresaDetail = () => {
  const { id } = useParams();
  const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
  const empresa = empresas.find(e => e.id === Number(id));

  if (!empresa) return <div>Empresa no encontrada</div>;

  return (
    <div className="empresa-detail">
      <h2>{empresa.nombre}</h2>
      <div className="detail-section">
        <h3>Información General</h3>
        <p><strong>Sector:</strong> {empresa.sector}</p>
        <p><strong>Dirección:</strong> {empresa.direccion}</p>
      </div>
      
      <div className="detail-section">
        <h3>Contacto</h3>
        <p><strong>Teléfono:</strong> {empresa.telefono}</p>
        <p><strong>Email:</strong> {empresa.email}</p>
        <p><strong>Información de Contacto adicional:</strong></p>
        <div className="contact-info">{empresa.contacto}</div>
      </div>
      
      <Link to="/empresas" className="btn-back">Volver a Empresas</Link>
    </div>
  );
};

export default EmpresaDetail;