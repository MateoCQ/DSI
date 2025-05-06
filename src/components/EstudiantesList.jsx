import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EstudiantesList = () => {
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    const storedEstudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    setEstudiantes(storedEstudiantes);
  }, []);

  return (
    <div className="estudiantes-list">
      <h2>Estudiantes Registrados</h2>
      <Link to="/estudiantes/nuevo" className="btn-add">Registrar Nuevo Estudiante</Link>
      
      {estudiantes.length === 0 ? (
        <p>No hay estudiantes registrados</p>
      ) : (
        <ul>
          {estudiantes.map(estudiante => (
            <li key={estudiante.id}>
              <Link to={`/estudiantes/${estudiante.id}`}>
                <strong>{estudiante.nombre} {estudiante.apellido}</strong> - {estudiante.carrera}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EstudiantesList;