import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PasantiasList = () => {
  const [pasantias, setPasantias] = useState([]);
  const [filteredPasantias, setFilteredPasantias] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    estado: '',
    estudiante: '',
    puesto: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    setPasantias(JSON.parse(localStorage.getItem('pasantias')) || []);
    setPuestos(JSON.parse(localStorage.getItem('puestos')) || []);
    setEstudiantes(JSON.parse(localStorage.getItem('estudiantes')) || []);
    setFilteredPasantias(JSON.parse(localStorage.getItem('pasantias')) || []);
  }, []);

  useEffect(() => {
    let result = pasantias;
    
    if (filters.estado) {
      result = result.filter(p => 
        p.estado.toLowerCase() === filters.estado.toLowerCase()
      );
    }
    
    if (filters.estudiante) {
      result = result.filter(p => {
        const estudiante = estudiantes.find(e => e.id === p.estudianteId);
        if (!estudiante) return false;
        const nombreCompleto = `${estudiante.nombre} ${estudiante.apellido}`.toLowerCase();
        return nombreCompleto.includes(filters.estudiante.toLowerCase());
      });
    }
    
    if (filters.puesto) {
      result = result.filter(p => {
        const puesto = puestos.find(pu => pu.id === p.puestoId);
        if (!puesto) return false;
        return puesto.nombre.toLowerCase().includes(filters.puesto.toLowerCase());
      });
    }
    
    setFilteredPasantias(result);
    setCurrentPage(1);
  }, [filters, pasantias, puestos, estudiantes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getNombrePuesto = (id) => puestos.find(p => p.id === id)?.nombre || 'Puesto no encontrado';
  const getNombreEstudiante = (id) => {
    const est = estudiantes.find(e => e.id === id);
    return est ? `${est.nombre} ${est.apellido}` : 'Estudiante no encontrado';
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPasantias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPasantias.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getEstadoBadge = (estado) => {
    const clases = {
      'En curso': 'badge-primary',
      'Finalizada': 'badge-success',
      'Cancelada': 'badge-danger'
    };
    return <span className={`badge ${clases[estado] || 'badge-secondary'}`}>{estado}</span>;
  };

  return (
    <div className="pasantias-list container">
      <div className="list-header d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Pasantías</h2>
        <Link to="/pasantias/nueva" className="btn btn-primary">
          Registrar Nueva Pasantía
        </Link>
      </div>

      <div className="filters-container mb-4">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>Estado:</label>
              <select
                className="form-control"
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="En curso">En curso</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group">
              <label>Estudiante:</label>
              <input
                type="text"
                className="form-control"
                name="estudiante"
                value={filters.estudiante}
                onChange={handleFilterChange}
                placeholder="Buscar por nombre"
              />
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group">
              <label>Puesto:</label>
              <input
                type="text"
                className="form-control"
                name="puesto"
                value={filters.puesto}
                onChange={handleFilterChange}
                placeholder="Buscar por puesto"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>Puesto</th>
              <th>Estudiante</th>
              <th>Estado</th>
              <th>Fecha Inicio</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? currentItems.map(p => (
              <tr 
                key={p.id} 
                onClick={() => navigate(`/pasantias/${p.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>{getNombrePuesto(p.puestoId)}</td>
                <td>{getNombreEstudiante(p.estudianteId)}</td>
                <td>{getEstadoBadge(p.estado)}</td>
                <td>{new Date(p.fechaInicio).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center">No hay pasantías que coincidan con los filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredPasantias.length > itemsPerPage && (
        <nav aria-label="Paginación de pasantías">
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
        Mostrando {currentItems.length} de {filteredPasantias.length} pasantías
      </div>
    </div>
  );
};

export default PasantiasList;