import React from 'react';
import { useParams, Link } from 'react-router-dom';

const EstudianteDetail = () => {
  const { id } = useParams();
  const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
  const estudiante = estudiantes.find(e => e.id === Number(id));

  if (!estudiante) return <div>Estudiante no encontrado</div>;

  return (
    <div className="estudiante-detail">
      <h2>{estudiante.nombre} {estudiante.apellido}</h2>
      <div className="detail-section">
        <p><strong>Carrera:</strong> {estudiante.carrera}</p>
        <p><strong>Edad:</strong> {estudiante.edad}</p>
      </div>
      
      <div className="detail-section">
        <h3>Contacto</h3>
        <p><strong>Email:</strong> {estudiante.email}</p>
        <p><strong>Teléfono:</strong> {estudiante.telefono}</p>
      </div>
      
      <div className="detail-section">
        <h3>Competencias</h3>
        {estudiante.competencias && estudiante.competencias.length > 0 ? (
          <ul>
            {estudiante.competencias.map((competencia, index) => (
              <li key={index}>{competencia}</li>
            ))}
          </ul>
        ) : (
          <p>No hay competencias registradas</p>
        )}
      </div>
    </div>
  );
};

export default EstudianteDetail;