"use client"

import { useState } from "react"
import SideBar from "../Layouts/Sidebar"
import { Search, FileText, Filter, Calendar, ChevronDown, Box, Save, Edit, Trash2, Eye } from 'lucide-react'
import "../styles/Salida.css"

const Salida = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  
  const [registros, setRegistros] = useState([
    {
      id: 1,
      codigo: "SAL001",
      producto: "Televisores LED 50\"",
      imagen: "/images/tv.jpg",
      estatus: "En tránsito",
      salida: "2025-03-19",
      llegada: "2025-03-17",
    },
    {
      id: 2,
      codigo: "SAL002",
      producto: "Refrigeradores",
      imagen: "/images/refrigerador.jpg",
      estatus: "Completado",
      salida: "2025-03-19",
      llegada: "2025-03-17",
    },
    {
      id: 3,
      codigo: "SAL003",
      producto: "Laptops",
      imagen: "/images/laptop.jpg",
      estatus: "Pendiente",
      salida: "2025-03-19",
      llegada: "2025-03-17",
    },
  ])

  const filteredRegistros = registros.filter(
    (registro) => {
      const matchesSearch = 
        registro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.salida.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.llegada.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "Todos" || registro.estatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  )

  const statusOptions = ["Todos", "Pendiente", "En tránsito", "Completado", "Cancelado"];

  return (
    <SideBar>
      <div className="salida-container">
        <div className="salida-header">
          <h1>Salidas de Productos</h1>
          <div className="search-filters">
           
            <div className="filter-dropdown">
              <Filter size={18} className="filter-icon" />
              <div className="select-wrapper">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>
            <button className="btn-nuevo">
              <Box size={18} />
              Nueva Salida
            </button>
          </div>
        </div>

        <div className="salida-table-container">
          {filteredRegistros.length === 0 ? (
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
                <div className="header-cell">Estatus</div>
                <div className="header-cell">Salida</div>
                <div className="header-cell">Llegada</div>
                <div className="header-cell actions-cell">Acciones</div>
              </div>
              
              <div className="salida-table-body">
                {filteredRegistros.map((registro) => (
                  <div key={registro.id} className="salida-table-row">
                    <div className="cell image-cell">
                      <img src={registro.imagen} alt={registro.producto} onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder.jpg";
                      }} />
                    </div>
                    <div className="cell">{registro.codigo}</div>
                    <div className="cell">{registro.producto}</div>
                    <div className="cell">
                      <span className={`status-badge status-${registro.estatus.toLowerCase().replace(' ', '-')}`}>
                        {registro.estatus}
                      </span>
                    </div>
                    <div className="cell">{registro.salida}</div>
                    <div className="cell">{registro.llegada}</div>
                    <div className="cell actions-cell">
                      <button className="action-button view-button">
                        <Eye size={16} />
                      </button>
                      <button className="action-button edit-button">
                        <Edit size={16} />
                      </button>
                      <button className="action-button delete-button">
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