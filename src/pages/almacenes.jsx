"use client"

import { useState } from "react"
import SideBar from "../Layouts/Sidebar"
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  MapPin,
  Box,
  BarChart,
  Filter,
  ChevronLeft,
  ChevronRight,
  Home,
  HelpCircle,
} from "lucide-react"
import "../styles/Almacenes.css"

const Almacenes = () => {
  const [almacenes, setAlmacenes] = useState([
    {
      id: 1,
      nombre: "Almacén Central",
      ubicacion: "Calle Principal #123",
      capacidad: "5000 m²",
      ocupacion: 75,
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Almacén Norte",
      ubicacion: "Av. Industrial #456",
      capacidad: "3200 m²",
      ocupacion: 45,
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Almacén Sur",
      ubicacion: "Carretera Sur Km 8",
      capacidad: "4100 m²",
      ocupacion: 90,
      estado: "Activo",
    },
    {
      id: 4,
      nombre: "Almacén Este",
      ubicacion: "Zona Este #789",
      capacidad: "2800 m²",
      ocupacion: 60,
      estado: "Inactivo",
    },
    {
      id: 5,
      nombre: "Almacén Oeste",
      ubicacion: "Blvd. Occidental #567",
      capacidad: "3600 m²",
      ocupacion: 82,
      estado: "Activo",
    },
    {
      id: 6,
      nombre: "Almacén Metropolitano",
      ubicacion: "Av. Central #890",
      capacidad: "6200 m²",
      ocupacion: 35,
      estado: "Activo",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Filtrado
  const filteredAlmacenes = almacenes.filter(
    (almacen) =>
      almacen.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      almacen.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAlmacenes = filteredAlmacenes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAlmacenes.length / itemsPerPage)

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <SideBar>
      <div className="almacenes-container">
        <div className="almacenes-header">
          <h1 className="almacenes-title">
            <Home size={24} className="mr-2" />
            Almacenes
          </h1>
          <div className="header-buttons">
            <button className="btn-filtros">
              <Filter size={18} />
              Filtros
            </button>
            <button className="btn-agregar">
              <PlusCircle size={18} />
              Agregar
            </button>
            <button className="btn-help">
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

       

        <div className="almacenes-grid">
          {currentAlmacenes.map((almacen) => (
            <div key={almacen.id} className="almacen-card">
              <div className="almacen-card-content">
                <div className="almacen-header">
                  <h2 className="almacen-nombre">{almacen.nombre}</h2>
                  <span className={`estado-badge ${almacen.estado === "Activo" ? "estado-activo" : "estado-inactivo"}`}>
                    {almacen.estado}
                  </span>
                </div>

                <div className="almacen-info">
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{almacen.ubicacion}</span>
                  </div>

                  <div className="info-item">
                    <Box size={16} />
                    <span>Capacidad: {almacen.capacidad}</span>
                  </div>

                  <div className="ocupacion-container">
                    <div className="ocupacion-header">
                      <div className="info-item">
                        <BarChart size={16} />
                        <span>Ocupación:</span>
                      </div>
                      <span>{almacen.ocupacion}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${
                          almacen.ocupacion > 80
                            ? "progress-high"
                            : almacen.ocupacion > 60
                              ? "progress-medium"
                              : "progress-low"
                        }`}
                        style={{ width: `${almacen.ocupacion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="almacen-actions">
                <button className="action-button edit-button">
                  <Edit size={18} />
                </button>
                <button className="action-button delete-button">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAlmacenes.length === 0 && (
          <div className="no-results">
            <p>No se encontraron almacenes que coincidan con tu búsqueda.</p>
          </div>
        )}

        {filteredAlmacenes.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? "pagination-active" : ""}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </SideBar>
  )
}

export default Almacenes

