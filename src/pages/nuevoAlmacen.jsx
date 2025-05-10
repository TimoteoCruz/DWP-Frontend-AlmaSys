import { useState, useEffect } from "react"
import SideBar from "../Layouts/Sidebar"
import { ArrowLeft } from 'lucide-react'
import "../styles/nuevoAlmacen.css"
import AlmacenesService from "../services/AlmacenesService"
import { useNavigate } from 'react-router-dom';


const NuevoAlmacen = ({ editId }) => {
  const isEditing = !!editId;
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    nombreAlmacen: "",
    estado: "",
    municipio: "",
    ciudad: "",
    espacios: "",
    calle: "",
    codigoPostal: "",
    codigo: ""
  })
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      const fetchAlmacen = async () => {
        try {
          setLoading(true)
          setError(null)
          
          const almacen = await AlmacenesService.getAlmacenById(editId)
          
          setFormData({
            nombreAlmacen: almacen.nombreAlmacen || "",
            estado: almacen.estado || "",
            municipio: almacen.municipio || "",
            ciudad: almacen.ciudad || "",
            espacios: almacen.espacios?.toString() || "",
            calle: almacen.calle || "",
            codigoPostal: almacen.codigoPostal || "",
            codigo: almacen.codigo || ""
          })
          
        } catch (error) {
          console.error("Error al cargar datos del almacén:", error)
          setError("No se pudo cargar la información del almacén. Por favor, intente nuevamente.")
        } finally {
          setLoading(false)
        }
      }
      
      fetchAlmacen()
    }
  }, [editId, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      
      if (isEditing) {
        await AlmacenesService.updateAlmacen(editId, formData)
        setSuccess("¡Almacén actualizado exitosamente!")
      } else {
        await AlmacenesService.createAlmacen(formData)
        setSuccess("¡Almacén creado exitosamente!")
      }
      
      setTimeout(() => {
        navigate('/almacenes');
            }, 2000)
      
    } catch (error) {
      console.error("Error:", error)
      setError(
        error.message || 
        "Ha ocurrido un error. Por favor, intente nuevamente."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/almacenes');
  }

  return (
    <SideBar>
      <div className="nuevo-almacen-container">
        <div className="nuevo-almacen-header">
          <button 
            onClick={handleCancel} 
            className="btn-volver"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>{isEditing ? 'Editar Almacén' : 'Nuevo Almacén'}</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="nuevo-almacen-form">
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="nombreAlmacen"
                  name="nombreAlmacen"
                  value={formData.nombreAlmacen}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nombre del Almacen"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Estado"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="municipio"
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Municipio"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ciudad"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  id="espacios"
                  name="espacios"
                  value={formData.espacios}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Espacios"
                  required
                  disabled={loading}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="calle"
                  name="calle"
                  value={formData.calle}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Calle"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Código postal"
                  required
                  disabled={loading}
                  pattern="[0-9]{5}"
                  title="El código postal debe tener 5 dígitos"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Código"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group empty-group">
              </div>
            </div>
          </div>
          
          <div className="form-divider"></div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn-cancelar"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-agregar"
              disabled={loading}
            >
              {loading ? 'Procesando...' : isEditing ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  )
}

export default NuevoAlmacen