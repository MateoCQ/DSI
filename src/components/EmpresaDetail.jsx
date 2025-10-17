import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmpresaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    sector: '',
    direccion: '',
    telefono: '',
    email: '',
    contacto: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatosEmpresa = () => {
      try {
        const data = JSON.parse(localStorage.getItem('empresas')) || [];
        const encontrada = data.find(e => e.id === id);

        if (!encontrada) {
          setError('Empresa no encontrada');
          setLoading(false);
          return;
        }

        setEmpresa(encontrada);
        setFormData({
          ...encontrada,
          telefono: encontrada.telefono || '',
          contacto: encontrada.contacto || ''
        });
      } catch (err) {
        console.error("Error cargando datos de la empresa:", err);
        setError('Error al cargar los datos de la empresa');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosEmpresa();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.sector?.trim()) newErrors.sector = 'El sector es requerido';
    if (!formData.direccion?.trim()) newErrors.direccion = 'La dirección es requerida';

    if (!formData.telefono?.trim()) newErrors.telefono = 'El teléfono es requerido';
    else if (!/^\d+$/.test(formData.telefono)) newErrors.telefono = 'Solo números permitidos en el teléfono';

    if (!formData.email?.trim()) newErrors.email = 'El email es requerido';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'El email no es válido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    const actualizadas = empresas.map(e => e.id === id ? formData : e);
    localStorage.setItem('empresas', JSON.stringify(actualizadas));
    setEmpresa(formData);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa?')) {
      const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
      const filtradas = empresas.filter(e => e.id !== id);
      localStorage.setItem('empresas', JSON.stringify(filtradas));
      navigate('/empresas');
    }
  };

  if (loading) {
    return <div className="loading text-center mt-5">Cargando detalles de la empresa...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  if (!empresa) {
    return <div className="alert alert-warning text-center mt-5">No se encontró la empresa solicitada</div>;
  }

  return (
    <div className="empresa-detail container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Detalle de la Empresa</h2>
        </div>

        <div className="card-body">
          {editMode ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="section-title mb-3">Información Principal</h4>
                  <div className="form-group mb-3">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="sector">Sector:</label>
                    <input
                      type="text"
                      id="sector"
                      name="sector"
                      value={formData.sector || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.sector ? 'is-invalid' : ''}`}
                    />
                    {errors.sector && <div className="invalid-feedback">{errors.sector}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="direccion">Dirección:</label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                    />
                    {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <h4 className="section-title mb-3">Datos de Contacto</h4>
                  <div className="form-group mb-3">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="contacto">Información de Contacto:</label>
                    <textarea
                      id="contacto"
                      name="contacto"
                      value={formData.contacto || ''}
                      onChange={handleChange}
                      rows="4"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions text-right mt-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={Object.keys(errors).length > 0 || !formData.nombre || !formData.sector || !formData.direccion || !formData.telefono || !formData.email}
                  className="btn btn-primary mr-2"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setErrors({}); setFormData(empresa); }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="section-title mb-3">Información Principal</h4>
                  <div className="info-item mb-2">
                    <span className="info-label">Nombre:</span>
                    <span>{empresa.nombre}</span>
                  </div>
                  <div className="info-item mb-2">
                    <span className="info-label">Sector:</span>
                    <span>{empresa.sector}</span>
                  </div>
                  <div className="info-item mb-2">
                    <span className="info-label">Dirección:</span>
                    <span>{empresa.direccion}</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <h4 className="section-title mb-3">Datos de Contacto</h4>
                  <div className="info-item mb-2">
                    <span className="info-label">Teléfono:</span>
                    <span>{empresa.telefono}</span>
                  </div>
                  <div className="info-item mb-2">
                    <span className="info-label">Email:</span>
                    <span>{empresa.email}</span>
                  </div>
                  {empresa.contacto && (
                    <div className="info-item mb-2">
                      <span className="info-label">Información de Contacto:</span>
                      <p className="contacto-info text-muted">{empresa.contacto}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-right">
                <button onClick={() => setEditMode(true)} className="btn btn-primary mr-2">
                  Editar
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpresaDetail;