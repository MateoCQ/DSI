import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmpresasList = () => {
  const [empresas, setEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpresas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="empresas-list container">
      <div className="list-header d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Empresas</h2>
        <Link to="/empresas/nueva" className="btn btn-primary">
          Registrar Nueva Empresa
        </Link>
      </div>

      <div className="filters-container mb-4">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="nombre">Filtrar por nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={filters.nombre}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="Buscar por nombre de empresa"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="sector">Filtrar por sector:</label>
              <input
                type="text"
                id="sector"
                name="sector"
                value={filters.sector}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="Buscar por sector"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>Nombre</th>
              <th>Sector</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(empresa => (
                <tr
                  key={empresa.id}
                  onClick={() => window.location.href = `/empresas/${empresa.id}`}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{empresa.nombre}</td>
                  <td>{empresa.sector}</td>
                  <td>{empresa.direccion}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No hay empresas que coincidan con los filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredEmpresas.length > itemsPerPage && (
        <nav aria-label="Paginación de empresas">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Anterior
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <li
                key={number}
                className={`page-item ${currentPage === number ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}

      <div className="text-muted text-center mt-2">
        Mostrando {currentItems.length} de {filteredEmpresas.length} empresas
      </div>
    </div>
  );
};

export default EmpresasList;