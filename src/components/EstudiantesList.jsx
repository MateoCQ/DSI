import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EstudiantesList = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
  carrera: '',
  competencia: '',
  legajo: ''
});

  useEffect(() => {
    const storedEstudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    setEstudiantes(storedEstudiantes);
    setFilteredEstudiantes(storedEstudiantes);
  }, []);

  useEffect(() => {
  let result = estudiantes;
  
  if (filters.carrera) {
    result = result.filter(e => 
      e.carrera.toLowerCase().includes(filters.carrera.toLowerCase())
    );
  }
  
  if (filters.competencia) {
    result = result.filter(e => 
      e.competencias && e.competencias.some(c => 
        c.toLowerCase().includes(filters.competencia.toLowerCase())
      )
    );
  }
  
  if (filters.legajo) {
    result = result.filter(e => 
      e.legajo.includes(filters.legajo)
    );
  }
  
  setFilteredEstudiantes(result);
  setCurrentPage(1); // Resetear a la primera página al aplicar filtros
}, [filters, estudiantes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstudiantes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="estudiantes-list">
      <div className="list-header">
        <h2>Estudiantes Registrados</h2>
        <Link to="/estudiantes/nuevo" className="btn-add">Registrar Nuevo Estudiante</Link>
      </div>
      
      {/* Filtros */}
      <div className="filters-container">
        
        <div className="filter-group">
    <label htmlFor="legajo">Filtrar por legajo:</label>
    <input
      type="text"
      id="legajo"
      name="legajo"
      value={filters.legajo}
      onChange={handleFilterChange}
      pattern="[0-9]*"
      title="Solo números permitidos"
    />
  </div>
  
        <div className="filter-group">
          
          <label htmlFor="carrera">Filtrar por carrera:</label>
          <input
            type="text"
            id="carrera"
            name="carrera"
            value={filters.carrera}
            onChange={handleFilterChange}

          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="competencia">Filtrar por competencia:</label>
          <input
            type="text"
            id="competencia"
            name="competencia"
            value={filters.competencia}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      {currentItems.length === 0 ? (
        <p>No hay estudiantes que coincidan con los filtros</p>
      ) : (
        <>
          <ul className="student-list">
            {currentItems.map(estudiante => (
              <li key={estudiante.id} className="student-item">
                <Link to={`/estudiantes/${estudiante.id}`} className="student-link">
                  <div className="student-info">
                    <strong>{estudiante.nombre} {estudiante.apellido}</strong>
                    <div></div>
                    <span className="student-career">{estudiante.carrera}</span>
                    {estudiante.competencias && estudiante.competencias.length > 0 && (
                      <span className="student-skills">
                        ({estudiante.competencias.slice(0, 2).join(', ')}{estudiante.competencias.length > 2 ? '...' : ''})
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Paginación */}
          {filteredEstudiantes.length > itemsPerPage && (
            <div className="pagination-controls">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Anterior
              </button>
              
              <span className="page-indicator">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Siguiente
              </button>
            </div>
          )}

          <div className="items-count">
            Mostrando {currentItems.length} de {filteredEstudiantes.length} estudiantes
          </div>
        </>
      )}
    </div>
  );
};

export default EstudiantesList;