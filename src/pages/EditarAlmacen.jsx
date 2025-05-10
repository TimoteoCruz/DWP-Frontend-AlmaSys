import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Home, Save, X } from 'lucide-react';
import SideBar from "../Layouts/Sidebar";
import AlmacenesService from "../services/AlmacenesService";
import "../styles/editarAlmacen.css";


const EditarAlmacen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [almacen, setAlmacen] = useState({
    nombreAlmacen: '',
    estado: '',
    municipio: '',
    ciudad: '',
    espacios: '',
    calle: '',
    codigoPostal: '',
    codigo: '',
    activo: true
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlmacen = async () => {
      try {
        const data = await AlmacenesService.getAlmacenById(id);
        setAlmacen(data);
        setIsLoading(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del almacén',
          confirmButtonText: 'Aceptar'
        });
        navigate('/almacenes');
      }
    };

    fetchAlmacen();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlmacen(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = [
      'nombreAlmacen', 'estado', 'municipio', 
      'ciudad', 'espacios', 'calle', 
      'codigoPostal', 'codigo'
    ];

    const missingFields = requiredFields.filter(field => !almacen[field]);
    
    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: `Por favor complete los siguientes campos: ${missingFields.join(', ')}`,
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    try {
      await AlmacenesService.updateAlmacen(id, almacen);
      
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'Almacén actualizado exitosamente',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/almacenes');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el almacén',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: '¿Deseas cancelar?',
      text: 'Los cambios no guardados se perderán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Continuar editando'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/almacenes');
      }
    });
  };

  if (isLoading) {
    return (
      <SideBar>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando información del almacén...</p>
        </div>
      </SideBar>
    );
  }

  return (
    <SideBar>
      <div className="editar-almacen-container">
        <div className="editar-almacen-header">
          <h1 className="editar-almacen-title">
            <Home size={24} className="mr-2" /> Editar Almacén
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="editar-almacen-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del Almacén</label>
              <input
                type="text"
                name="nombreAlmacen"
                value={almacen.nombreAlmacen}
                onChange={handleChange}
                placeholder="Ingrese nombre del almacén"
                required
              />
            </div>

            <div className="form-group">
              <label>Estado</label>
              <input
                type="text"
                name="estado"
                value={almacen.estado}
                onChange={handleChange}
                placeholder="Ingrese estado"
                required
              />
            </div>

            <div className="form-group">
              <label>Municipio</label>
              <input
                type="text"
                name="municipio"
                value={almacen.municipio}
                onChange={handleChange}
                placeholder="Ingrese municipio"
                required
              />
            </div>

            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={almacen.ciudad}
                onChange={handleChange}
                placeholder="Ingrese ciudad"
                required
              />
            </div>

            <div className="form-group">
              <label>Espacios</label>
              <input
                type="number"
                name="espacios"
                value={almacen.espacios}
                onChange={handleChange}
                placeholder="Cantidad de espacios"
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Calle</label>
              <input
                type="text"
                name="calle"
                value={almacen.calle}
                onChange={handleChange}
                placeholder="Ingrese calle"
                required
              />
            </div>

            <div className="form-group">
              <label>Código Postal</label>
              <input
                type="text"
                name="codigoPostal"
                value={almacen.codigoPostal}
                onChange={handleChange}
                placeholder="Ingrese código postal"
                required
              />
            </div>

            <div className="form-group">
              <label>Código de Almacén</label>
              <input
                type="text"
                name="codigo"
                value={almacen.codigo}
                onChange={handleChange}
                placeholder="Ingrese código"
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label>Estado del Almacén</label>
              <select
                name="activo"
                value={almacen.activo}
                onChange={handleChange}
              >
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancelar" 
              onClick={handleCancel}
            >
              <X size={18} /> Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-guardar"
            >
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  );
};

export default EditarAlmacen;