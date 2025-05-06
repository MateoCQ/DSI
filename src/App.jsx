import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import EmpresasList from './components/EmpresasList';
import EmpresaForm from './components/EmpresaForm';
import EmpresaDetail from './components/EmpresaDetail';
import EstudiantesList from './components/EstudiantesList';
import EstudianteForm from './components/EstudianteForm';
import EstudianteDetail from './components/EstudianteDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<WithBackButton><EmpresasList /></WithBackButton>} />
          <Route path="/empresas/nueva" element={<WithBackButton><EmpresaForm /></WithBackButton>} />
          <Route path="/empresas/:id" element={<WithBackButton><EmpresaDetail /></WithBackButton>} />
          <Route path="/estudiantes" element={<WithBackButton><EstudiantesList /></WithBackButton>} />
          <Route path="/estudiantes/nuevo" element={<WithBackButton><EstudianteForm /></WithBackButton>} />
          <Route path="/estudiantes/:id" element={<WithBackButton><EstudianteDetail /></WithBackButton>} />
        </Routes>
      </div>
    </Router>
  );
}

// Componente para envolver páginas con botón de retroceso
function WithBackButton({ children }) {
  const navigate = useNavigate();
  
  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn-back">
        &larr; Atrás
      </button>
      {children}
    </div>
  );
}

export default App;