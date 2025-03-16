"use client"

import { useState } from "react"
import SideBar from "../Layouts/Sidebar"
import { Save, Warehouse } from 'lucide-react'
import "../styles/NuevoAlmacen.css"

const NuevoAlmacen = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Datos del nuevo almacén:", formData)
  }

  return (
    <SideBar>
      <div className="nuevo-almacen-container">
        <div className="nuevo-almacen-header">
          <h1>Nuevo Almacén</h1>
        </div>

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
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="espacios"
                  name="espacios"
                  value={formData.espacios}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Espacios"
                  required
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
                />
              </div>
              
              <div className="form-group empty-group">
              </div>
            </div>
          </div>
          
          <div className="form-divider"></div>
          
          <div className="form-actions">
            <button type="submit" className="btn-agregar">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  )
}

export default NuevoAlmacen