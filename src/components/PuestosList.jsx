import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PuestosList = () => {
  const [puestos, setPuestos] = useState([]);
  const [filteredPuestos, setFilteredPuestos] = useState([]);
  const [empresas, setEmpresas] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    estado: '',
    competencia: '',
    empresa: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const puestosGuardados = JSON.parse(localStorage.getItem('puestos')) || [];
    const empresasGuardadas = JSON.parse(localStorage.getItem('empresas')) || [];

    const empresasMap = empresasGuardadas.reduce((acc, empresa) => {
      acc[empresa.id] = empresa;
      return acc;
    }, {});

    setPuestos(puestosGuardados);
    setFilteredPuestos(puestosGuardados);
    setEmpresas(empresasMap);
  }, []);

  useEffect(() => {
    let result = puestos;

    if (filters.estado) {
      result = result.filter(p =>
        p.estado === filters.estado
      );
    }

    if (filters.competencia) {
      result = result.filter(p =>
        p.competencias && p.competencias.some(c =>
          c.toLowerCase().includes(filters.competencia.toLowerCase())
        )
      );
    }

    if (filters.empresa) {
      result = result.filter(p => {
        const empresa = empresas[p.empresaId];
        return empresa && empresa.nombre.toLowerCase().includes(filters.empresa.toLowerCase());
      });
    }

    setFilteredPuestos(result);
    setCurrentPage(1);
  }, [filters, puestos, empresas]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPuestos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPuestos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getNombreEmpresa = (empresaId) => {
    const empresa = empresas[empresaId];
    return empresa ? empresa.nombre : 'Empresa no encontrada';
  };

  const getEstadoBadge = (estado) => {
    const clases = {
      disponible: 'badge-success',
      ocupado: 'badge-danger',
      cerrado: 'badge-danger'
    };
    return <span className={`badge ${clases[estado] || 'badge-secondary'}`}>{estado || 'N/A'}</span>;
  };

  const handleRowClick = (puestoId) => {
    navigate(`/puestos/${puestoId}`);
  };

  return (
    <div className="puestos-list-container ">
      <div className="list-header d-flex justify-content-between mb-4">
        <h2>Listado de Puestos</h2>
        <Link to="/puestos/nuevo" className="btn btn-primary">
          Registrar Nuevo Puesto
        </Link>
      </div>

      {/* Filters */}
      <div className="filters-container mb-4">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Todos</option>
                <option value="disponible">Disponible</option>
                <option value="ocupado">Ocupado</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="competencia">Competencia:</label>
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

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="empresa">Empresa:</label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                value={filters.empresa}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="Buscar por empresa"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>Nombre del Puesto</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Competencias</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(puesto => (
                <tr
                  key={puesto.id}
                  onClick={() => handleRowClick(puesto.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{puesto.nombre}</td>
                  <td>{getNombreEmpresa(puesto.empresaId)}</td>
                  <td>{getEstadoBadge(puesto.estado)}</td>
                  <td>
                    {puesto.competencias && puesto.competencias.slice(0, 2).join(', ')}
                    {puesto.competencias && puesto.competencias.length > 2 ? '...' : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No hay puestos que coincidan con los filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredPuestos.length > itemsPerPage && (
        <nav aria-label="Paginación de puestos">
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
        Mostrando {currentItems.length} de {filteredPuestos.length} puestos
      </div>
    </div>
  );
};

export default PuestosList;