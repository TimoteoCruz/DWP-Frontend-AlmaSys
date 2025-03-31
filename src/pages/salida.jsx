"use client"

import { useState, useEffect } from "react"
import SideBar from "../Layouts/Sidebar"
import { Search, FileText, Filter, ChevronDown, Box, Edit, Trash2, Eye, Loader } from "lucide-react"
import AlmacenesService from "../services/AlmacenesService"
import "../styles/Salida.css"

const Salida = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        setLoading(true)
        const response = await AlmacenesService.getMovimientos()

        // Filter to only show "salida" type movements
        const salidas = response.movimientos.filter((movimiento) => movimiento.tipoMovimiento === "salida")

        // Map the API response to the format expected by the UI
        const formattedSalidas = salidas.map((salida) => ({
          id: salida.id,
          codigo: salida.id.substring(0, 6).toUpperCase(), // Generate a code from the ID
          producto: salida.nombreProducto,
          imagen: "/images/placeholder.jpg", // Default image
          estatus: salida.estatus.charAt(0).toUpperCase() + salida.estatus.slice(1).replace("_", " "), // Format status
          salida: salida.fechaMovimiento,
          llegada: salida.fechaMovimiento, // Using the same date if arrival date is not available
          productoId: salida.productoId,
          almacenOrigen: salida.almacenOrigen,
          almacenDestino: salida.almacenDestino,
          cantidad: salida.cantidad,
          motivo: salida.motivo,
        }))

        setRegistros(formattedSalidas)
        setError(null)
      } catch (err) {
        console.error("Error al cargar movimientos:", err)
        setError("Error al cargar los datos. Por favor, intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchMovimientos()
  }, [])

  const filteredRegistros = registros.filter((registro) => {
    const matchesSearch =
      registro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.salida.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registro.almacenOrigen && registro.almacenOrigen.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registro.almacenDestino && registro.almacenDestino.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "Todos" || registro.estatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusOptions = ["Todos", "Pendiente", "En tránsito", "Completado", "Cancelado"]

  const handleNuevaSalida = () => {
    window.location.href = "/nueva-salida"
  }

  const handleViewDetails = (id) => {
    // Navigate to details page or show modal with details
    console.log("Ver detalles de:", id)
  }

  const handleEdit = (id) => {
    // Navigate to edit page
    console.log("Editar:", id)
  }

  const handleDelete = (id) => {
    // Show confirmation dialog and delete if confirmed
    if (window.confirm("¿Está seguro que desea eliminar este registro?")) {
      console.log("Eliminar:", id)
      // Implement delete logic here
    }
  }

  return (
    <SideBar>
      <div className="salida-container">
        <div className="salida-header">
          <h1>Salidas de Productos</h1>
          <div className="search-filters">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por código, producto, almacén..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <Filter size={18} className="filter-icon" />
              <div className="select-wrapper">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>
            <button className="btn-nuevo" onClick={handleNuevaSalida}>
              <Box size={18} />
              Nueva Salida
            </button>
          </div>
        </div>

        <div className="salida-table-container">
          {loading ? (
            <div className="loading-container">
              <Loader size={48} className="animate-spin" />
              <p>Cargando datos...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button className="btn-retry" onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </div>
          ) : filteredRegistros.length === 0 ? (
            <div className="no-results">
              <FileText size={48} />
              <p>No se encontraron registros de salida</p>
            </div>
          ) : (
            <div className="salida-table">
              <div className="salida-table-header">
                <div className="header-cell image-cell">Imagen</div>
                <div className="header-cell">Código</div>
                <div className="header-cell">Producto</div>
                <div className="header-cell">Almacén Origen</div>
                <div className="header-cell">Almacén Destino</div>
                <div className="header-cell">Cantidad</div>
                <div className="header-cell">Estatus</div>
                <div className="header-cell">Fecha</div>
                <div className="header-cell actions-cell">Acciones</div>
              </div>

              <div className="salida-table-body">
                {filteredRegistros.map((registro) => (
                  <div key={registro.id} className="salida-table-row">
                    <div className="cell image-cell">
                      <img
                        src={registro.imagen || "/placeholder.svg"}
                        alt={registro.producto}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/images/placeholder.jpg"
                        }}
                      />
                    </div>
                    <div className="cell">{registro.codigo}</div>
                    <div className="cell">{registro.producto}</div>
                    <div className="cell">{registro.almacenOrigen || "N/A"}</div>
                    <div className="cell">{registro.almacenDestino || "N/A"}</div>
                    <div className="cell">{registro.cantidad || "N/A"}</div>
                    <div className="cell">
                      <span className={`status-badge status-${registro.estatus.toLowerCase().replace(" ", "-")}`}>
                        {registro.estatus}
                      </span>
                    </div>
                    <div className="cell">{registro.salida}</div>
                    <div className="cell actions-cell">
                      <button
                        className="action-button view-button"
                        onClick={() => handleViewDetails(registro.id)}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(registro.id)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(registro.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SideBar>
  )
}

export default Salida

