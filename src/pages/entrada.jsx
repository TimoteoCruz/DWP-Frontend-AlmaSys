"use client"

import { useState } from "react"
import SideBar from "../Layouts/Sidebar"
import { Search, FileText, Filter, Calendar, ChevronDown, Box, Save, Edit, Trash2, Eye } from 'lucide-react'
import "../styles/entrada.css"

const Entrada = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  
  const [registros, setRegistros] = useState([
    {
      id: 1,
      codigo: "SAL001",
      producto: "Televisora LED 50\"",
      imagen: "/images/tv.jpg",
      estatus: "En tránsito",
      entrada: "2025-03-19",
      llegada: "2025-03-17",
    },
    {
      id: 2,
      codigo: "SAL002",
      producto: "Refrigeradores",
      imagen: "/images/refrigerador.jpg",
      estatus: "Completado",
      entrada: "2025-03-19",
      llegada: "2025-03-17",
    },
    {
      id: 3,
      codigo: "SAL003",
      producto: "Laptops",
      imagen: "/images/laptop.jpg",
      estatus: "Pendiente",
      entrada: "2025-03-19",
      llegada: "2025-03-17",
    },
  ])

  const filteredRegistros = registros.filter(
    (registro) => {
      const matchesSearch = 
        registro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.entrada.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.llegada.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "Todos" || registro.estatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  )

  const statusOptions = ["Todos", "Pendiente", "En tránsito", "Completado", "Cancelado"];

  return (
    <SideBar>
      <div className="entrada-container">
        <div className="entrada-header">
          <h1>entradas de Productos</h1>
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
              Nueva entrada
            </button>
          </div>
        </div>

        <div className="entrada-table-container">
          {filteredRegistros.length === 0 ? (
            <div className="no-results">
              <FileText size={48} />
              <p>No se encontraron registros de entrada</p>
            </div>
          ) : (
            <div className="entrada-table">
              <div className="entrada-table-header">
                <div className="header-cell image-cell">Imagen</div>
                <div className="header-cell">Código</div>
                <div className="header-cell">Producto</div>
                <div className="header-cell">Estatus</div>
                <div className="header-cell">entrada</div>
                <div className="header-cell">Llegada</div>
                <div className="header-cell actions-cell">Acciones</div>
              </div>
              
              <div className="entrada-table-body">
                {filteredRegistros.map((registro) => (
                  <div key={registro.id} className="entrada-table-row">
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
                    <div className="cell">{registro.entrada}</div>
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

export default Entrada