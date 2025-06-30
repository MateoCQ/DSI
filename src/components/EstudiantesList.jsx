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
    setCurrentPage(1); // Reset to the first page when filters are applied
  }, [filters, estudiantes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstudiantes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="estudiantes-list container">
      <div className="list-header d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Estudiantes</h2>
        <Link to="/estudiantes/nuevo" className="btn btn-primary">
          Registrar Nuevo Estudiante
        </Link>
      </div>

      {/* Filters */}
      <div className="filters-container mb-4">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="legajo">Filtrar por legajo:</label>
              <input
                type="text"
                id="legajo"
                name="legajo"
                value={filters.legajo}
                onChange={handleFilterChange}
                className="form-control"
                pattern="[0-9]*"
                title="Solo números permitidos"
                placeholder="Buscar por legajo"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="carrera">Filtrar por carrera:</label>
              <input
                type="text"
                id="carrera"
                name="carrera"
                value={filters.carrera}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="Buscar por carrera"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="competencia">Filtrar por competencia:</label>
              <input
                type="text"
                id="competencia"
                name="competencia"
                value={filters.competencia}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="Buscar por competencia"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Legajo</th>
              <th>Carrera</th>
              <th>Competencias</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(estudiante => (
                <tr
                  key={estudiante.id}
                  onClick={() => window.location.href = `/estudiantes/${estudiante.id}`}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{estudiante.nombre} {estudiante.apellido}</strong></td>
                  <td>{estudiante.legajo}</td>
                  <td>{estudiante.carrera}</td>
                  <td>
                    {estudiante.competencias && estudiante.competencias.slice(0, 2).join(', ')}
                    {estudiante.competencias && estudiante.competencias.length > 2 ? '...' : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No hay estudiantes que coincidan con los filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredEstudiantes.length > itemsPerPage && (
        <nav aria-label="Paginación de estudiantes">
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
        Mostrando {currentItems.length} de {filteredEstudiantes.length} estudiantes
      </div>
    </div>
  );
};

export default EstudiantesList;