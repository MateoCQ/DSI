import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import EmpresasList from './components/EmpresasList';
import EmpresaForm from './components/EmpresaForm';
import EmpresaDetail from './components/EmpresaDetail';
import EstudiantesList from './components/EstudiantesList';
import EstudianteForm from './components/EstudianteForm';
import EstudianteDetail from './components/EstudianteDetail';
import PuestosList from './components/PuestosList';
import PuestoForm from './components/PuestoForm';
import PuestoDetail from './components/PuestoDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Rutas de Empresas */}
          <Route path="/empresas" element={<WithBackButton><EmpresasList /></WithBackButton>} />
          <Route path="/empresas/nueva" element={<WithBackButton><EmpresaForm /></WithBackButton>} />
          <Route path="/empresas/:id" element={<WithBackButton><EmpresaDetail /></WithBackButton>} />
          
          {/* Rutas de Estudiantes */}
          <Route path="/estudiantes" element={<WithBackButton><EstudiantesList /></WithBackButton>} />
          <Route path="/estudiantes/nuevo" element={<WithBackButton><EstudianteForm /></WithBackButton>} />
          <Route path="/estudiantes/:id" element={<WithBackButton><EstudianteDetail /></WithBackButton>} />
          
          {/* Nuevas Rutas de Puestos */}
          <Route path="/puestos" element={<WithBackButton><PuestosList /></WithBackButton>} />
          <Route path="/puestos/nuevo" element={<WithBackButton><PuestoForm /></WithBackButton>} />
          <Route path="/puestos/:id" element={<WithBackButton><PuestoDetail /></WithBackButton>} />
        </Routes>
      </div>
    </Router>
  );
}

// Componente WithBackButton mejorado
function WithBackButton({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    const currentPath = location.pathname;
    
    // Extraer la ruta base (primera parte de la URL)
    const baseRoute = currentPath.split('/')[1];
    
    // Si estamos en una ruta de creación/edición/detalle
    if (currentPath.split('/').length > 2) {
      // Volver a la lista correspondiente (ej: /estudiantes/nuevo → /estudiantes)
      navigate(`/${baseRoute}`);
    } else if (baseRoute && baseRoute !== '') {
      // Si estamos en una lista (ej: /estudiantes) → ir al home
      navigate('/');
    } else {
      // Si estamos en home → no hacer nada o minimizar la app
      window.history.back(); // O cualquier otra acción
    }
  };

  return (
    <div>
      <button onClick={handleGoBack} className="btn-back">
        &larr; Atrás
      </button>
      {children}
    </div>
  );
}

export default App;