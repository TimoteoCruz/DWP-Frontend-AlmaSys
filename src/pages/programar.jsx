"use client"

import { useState, useEffect } from "react"
import SideBar from "../Layouts/Sidebar"
import { Calendar, Clock, Save, Box, FileText, Home, ChevronDown, Edit, Trash2 } from 'lucide-react'
import "../styles/Programar.css"
import ProgramadasService from "../services/ProgramadaService"
import AlmacenesService from "../services/AlmacenesService"

const Programar = () => {
  const [formData, setFormData] = useState({
    fechaRegistro: "",
    hora: "",
    almacen: "",
    producto: "",
    descripcion: "",
    cantidad: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [programadas, setProgramadas] = useState([])
  const [almacenes, setAlmacenes] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState({
    programadas: true,
    almacenes: true,
    productos: true
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProgramadas()
    fetchAlmacenes()
    fetchProductos()
  }, [])

  const fetchProgramadas = async () => {
    try {
      setLoading(prev => ({ ...prev, programadas: true }))
      const data = await ProgramadasService.getAllProgramadas()
      setProgramadas(data)
    } catch (err) {
      console.error("Error al cargar entradas programadas:", err)
    } finally {
      setLoading(prev => ({ ...prev, programadas: false }))
    }
  }

  const fetchAlmacenes = async () => {
    try {
      setLoading(prev => ({ ...prev, almacenes: true }))
      const data = await AlmacenesService.getAllAlmacenes()
      setAlmacenes(data)
    } catch (err) {
      console.error("Error al cargar almacenes:", err)
      setError("No se pudieron cargar los almacenes")
    } finally {
      setLoading(prev => ({ ...prev, almacenes: false }))
    }
  }

  const fetchProductos = async () => {
    try {
      setLoading(prev => ({ ...prev, productos: true }));
      const data = await AlmacenesService.getAllProductos();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(prev => ({ ...prev, productos: false }));
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleProductoChange = (e) => {
    const productoId = e.target.value
    const productoSeleccionado = productos.find(p => p.id === productoId)
    
    if (productoSeleccionado) {
      setFormData(prev => ({
        ...prev,
        producto: productoId,
        descripcion: productoSeleccionado.descripcion || productoSeleccionado.nombreProducto || ""
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        producto: productoId,
        descripcion: ""
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Obtener el nombre del producto a partir del ID
      const productoSeleccionado = productos.find(p => p.id === formData.producto)
      const nombreProducto = productoSeleccionado ? productoSeleccionado.nombreProducto : formData.producto
      
      // Obtener el nombre del almacén a partir del ID
      const almacenSeleccionado = almacenes.find(a => a.id === formData.almacen)
      const nombreAlmacen = almacenSeleccionado ? almacenSeleccionado.nombreAlmacen : formData.almacen
      
      // Formatear los datos para la API
      const programadaData = {
        fechaRegistro: formData.fechaRegistro,
        almacen: formData.almacen, // Guardamos el ID
        producto: formData.producto, // Guardamos el ID
        descripcion: formData.descripcion,
        cantidad: parseInt(formData.cantidad),
        // Campos adicionales para mostrar en la interfaz
        nombreAlmacen,
        nombreProducto
      }
      
      // Enviar los datos a la API
      await ProgramadasService.createProgramada(programadaData)
      
      // Mostrar mensaje de éxito
      setSubmitted(true)
      
      // Recargar la lista de programadas
      fetchProgramadas()
      
      // Resetear el formulario después de 3 segundos
      setTimeout(() => {
        setFormData({
          fechaRegistro: "",
          hora: "",
          almacen: "",
          producto: "",
          descripcion: "",
          cantidad: "",
        })
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      console.error("Error al crear entrada programada:", err)
      setError("No se pudo crear la entrada programada")
    }
  }

  const handleEdit = async (id) => {
    try {
      // Obtener los datos de la entrada programada
      const programada = await ProgramadasService.getProgramadaById(id)
      
      // Llenar el formulario con los datos
      setFormData({
        fechaRegistro: programada.fechaRegistro,
        hora: programada.hora || "",
        almacen: programada.almacen,
        producto: programada.producto,
        descripcion: programada.descripcion,
        cantidad: programada.cantidad.toString(),
      })
      
      // Puedes implementar lógica adicional para manejar la edición
      // Por ejemplo, cambiar el botón "Agregar" por "Actualizar"
    } catch (err) {
      console.error("Error al obtener entrada programada:", err)
      setError("No se pudo obtener la entrada programada")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar esta entrada programada?")) {
      try {
        await ProgramadasService.deleteProgramada(id)
        // Recargar la lista de programadas
        fetchProgramadas()
      } catch (err) {
        console.error("Error al eliminar entrada programada:", err)
        setError("No se pudo eliminar la entrada programada")
      }
    }
  }

  const filteredProgramadas = programadas.filter(
    (programada) =>
      programada.nombreProducto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programada.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función para obtener el nombre del almacén a partir del ID
  const getAlmacenNombre = (almacenId) => {
    const almacen = almacenes.find(a => a.id === almacenId)
    return almacen ? almacen.nombreAlmacen : almacenId
  }

  // Función para obtener el nombre del producto a partir del ID
  const getProductoNombre = (productoId) => {
    const producto = productos.find(p => p.id === productoId)
    return producto ? producto.nombreProducto : productoId
  }

  return (
    <SideBar>
      <div className="programar-container">
        <div className="programar-header">
          {error && <div className="error-message">{error}</div>}
        </div>

        {submitted ? (
          <div className="success-message">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h2>¡Registro Exitoso!</h2>
              <p>La entrada programada ha sido registrada correctamente.</p>
            </div>
          </div>
        ) : (
          <div className="form-container">
            <form onSubmit={handleSubmit} className="programar-form">
              <div className="form-row three-columns">
                <div className="form-group">
                  <label htmlFor="fechaRegistro">
                    <Calendar size={16} className="icon" />
                    Fecha de Registro
                  </label>
                  <input 
                    type="date" 
                    id="fechaRegistro" 
                    name="fechaRegistro" 
                    value={formData.fechaRegistro} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hora">
                    <Clock size={16} className="icon" />
                    Hora de Registro
                  </label>
                  <input 
                    type="time" 
                    id="hora" 
                    name="hora" 
                    value={formData.hora} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="almacen">
                    <Home size={16} className="icon" />
                    Almacén
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="almacen"
                      name="almacen"
                      value={formData.almacen}
                      onChange={handleChange}
                      required
                      disabled={loading.almacenes}
                    >
                      <option value="" disabled>
                        {loading.almacenes ? "Cargando almacenes..." : "Seleccione un almacén"}
                      </option>
                      {almacenes.map((almacen) => (
                        <option key={almacen.id} value={almacen.id}>
                          {almacen.nombreAlmacen}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="select-icon" />
                  </div>
                </div>
              </div>

              <div className="form-row three-columns">
                <div className="form-group">
                  <label htmlFor="producto">
                    <Box size={16} className="icon" />
                    Producto
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="producto"
                      name="producto"
                      value={formData.producto}
                      onChange={handleProductoChange}
                      required
                      disabled={loading.productos}
                    >
                      <option value="" disabled>
                        {loading.productos ? "Cargando productos..." : "Seleccione un producto"}
                      </option>
                      {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                          {producto.nombreProducto}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="select-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">
                    <FileText size={16} className="icon" />
                    Descripción
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Ingrese la descripción"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cantidad">
                    <FileText size={16} className="icon" />
                    Cantidad
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    placeholder="Ingrese la cantidad"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-guardar">
                  <Save size={18} />
                  Agregar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="registros-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por producto o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="registros-table-container">
            {loading.programadas ? (
              <p>Cargando entradas programadas...</p>
            ) : (
              <table className="registros-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Almacén</th>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProgramadas.length > 0 ? (
                    filteredProgramadas.map((programada) => (
                      <tr key={programada.id}>
                        <td>{programada.fechaRegistro}</td>
                        <td>{getAlmacenNombre(programada.almacen)}</td>
                        <td>{getProductoNombre(programada.producto)}</td>
                        <td>{programada.descripcion}</td>
                        <td>{programada.cantidad}</td>
                        <td>{programada.estado || 'pendiente'}</td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="action-button edit-button"
                              onClick={() => handleEdit(programada.id)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="action-button delete-button"
                              onClick={() => handleDelete(programada.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="no-data">
                        No hay entradas programadas disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </SideBar>
  )
}

export default Programar