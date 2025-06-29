import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmpresasList = () => {
  const [empresas, setEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    sector: '',
    nombre: ''
  });

  useEffect(() => {
    const storedEmpresas = JSON.parse(localStorage.getItem('empresas')) || [];
    setEmpresas(storedEmpresas);
    setFilteredEmpresas(storedEmpresas);
  }, []);

  useEffect(() => {
    let result = empresas;
    
    if (filters.sector) {
      result = result.filter(e => 
        e.sector.toLowerCase().includes(filters.sector.toLowerCase())
      );
    }
    
    if (filters.nombre) {
      result = result.filter(e => 
        e.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }
    
    setFilteredEmpresas(result);
    setCurrentPage(1);
  }, [filters, empresas]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpresas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="empresas-list">
      <div className="empresas-header">
        <h2>Empresas Registradas</h2>
        <Link to="/empresas/nueva" className="btn-add">Registrar Nueva Empresa</Link>
      </div>
      
      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="nombre">Filtrar por nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={filters.nombre}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="sector">Filtrar por sector:</label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={filters.sector}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      {currentItems.length === 0 ? (
        <p>No hay empresas que coincidan con los filtros</p>
      ) : (
        <>
          <ul className="empresas-container">
            {currentItems.map(empresa => (
              <li key={empresa.id} className="empresa-item">
                <Link to={`/empresas/${empresa.id}`} className="empresa-link">
                  <div className="empresa-info">
                    <strong>{empresa.nombre}</strong>
                    <div className="empresa-sector">{empresa.sector}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Paginación */}
          {filteredEmpresas.length > itemsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-btn"
              >
                &laquo; Anterior
              </button>
              
              <span className="page-info">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Siguiente &raquo;
              </button>
            </div>
          )}

          <div className="empresas-count">
            Mostrando {currentItems.length} de {filteredEmpresas.length} empresas
          </div>
        </>
      )}
    </div>
  );
};

export default EmpresasList;