import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css"

const Home = () => {
  return (
    <div className="home-container">
      <div className="navigation-cards">
        <Link to="/empresas" className="nav-card">
          <h2>Empresas</h2>
        </Link>
        
        <Link to="/estudiantes" className="nav-card">
          <h2>Estudiantes</h2>
        </Link>
      </div>
    </div>
  );
};

export default Home;