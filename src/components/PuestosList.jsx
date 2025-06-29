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

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPuestos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPuestos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getNombreEmpresa = (empresaId) => {
    const empresa = empresas[empresaId];
    return empresa ? empresa.nombre : `Empresa no encontrada (ID: ${empresaId})`;
  };

  const getEstadoBadge = (estado) => {
    const clases = {
      disponible: 'disponible',
      ocupado: 'ocupado',
      cerrado: 'cerrado'
    };
    return <span className={`estado-badge ${clases[estado] || ''}`}>{estado || 'disponible'}</span>;
  };

  const handleRowClick = (puestoId) => {
    navigate(`/puestos/${puestoId}`);
  };

  return (
    <div className="puestos-list-container">
      <div className="puestos-header">
        <h2>Listado de Puestos</h2>
        <Link to="/puestos/nuevo" className="add-puesto-btn">
          Registrar Nuevo Puesto
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            name="estado"
            value={filters.estado}
            onChange={handleFilterChange}
          >
            <option value="">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="ocupado">Ocupado</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="competencia">Competencia:</label>
          <input
            type="text"
            id="competencia"
            name="competencia"
            value={filters.competencia}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="empresa">Empresa:</label>
          <input
            type="text"
            id="empresa"
            name="empresa"
            value={filters.empresa}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      <div className="puestos-table-container">
        <table className="puestos-table">
          <thead>
            <tr>
              <th>Nombre</th>
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
                  className="puesto-row"
                >
                  <td>
                    <div className="puesto-nombre">{puesto.nombre}</div>
                  </td>
                  <td className="empresa-cell">{getNombreEmpresa(puesto.empresaId)}</td>
                  <td className="estado-cell">{getEstadoBadge(puesto.estado)}</td>
                  <td className="competencias-cell">
                    {puesto.competencias && puesto.competencias.slice(0, 2).join(', ')}
                    {puesto.competencias && puesto.competencias.length > 2 ? '...' : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="4">
                  <div className="empty-message">
                    No hay puestos que coincidan con los filtros
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {filteredPuestos.length > itemsPerPage && (
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
          Mostrando {currentItems.length} de {filteredPuestos.length} puestos
        </div>
      </div>
    </div>
  );
};

export default PuestosList;