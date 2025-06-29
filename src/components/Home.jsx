import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css" // Asegúrate de que esta ruta sea correcta

const Home = () => {
  return (
    <div className="home-container">
      {/* Agregamos la imagen del logo aquí */}
      <img src="https://www.logotypes101.com/logos/283/501E380BD95F595995F17CF495BCA882/LogoUTN_nvgsb.png" alt="Logo UTN San Francisco" className="utn-logo" />

      <div className="navigation-cards">
        <Link to="/empresas" className="nav-card">
          <h2>Empresas</h2>
        </Link>

        <Link to="/estudiantes" className="nav-card">
          <h2>Estudiantes</h2>
        </Link>

        <Link to="/puestos" className="nav-card">
          <h2>Puestos</h2>
        </Link>

        <Link to="/pasantias" className="nav-card">
          <h2>Pasantías</h2>
        </Link>
      </div>
    </div>
  );
};

export default Home;