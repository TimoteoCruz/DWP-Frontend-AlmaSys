"use client"

import { useState } from "react"
import SideBar from "../Layouts/Sidebar"
import { Upload, Save, Box } from 'lucide-react'
import "../styles/nuevaEntrada.css"

const NuevaEntrada = () => {
  const [formData, setFormData] = useState({
    producto: "",
    proveedor: "",
    unidadMedida: "",
    cantidad: "",
    almacenLlegada: "",
    fechaRecepcion: ""
  })
  
  const [imagen, setImagen] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Datos del formulario:", formData)
    console.log("Imagen:", imagen)
  }

  return (
    <SideBar>
      <div className="nueva-entrada-container">
        <div className="nueva-entrada-header">
          <h1>Nueva Entrada de Producto</h1>
        </div>

        <form onSubmit={handleSubmit} className="nueva-entrada-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="producto">Producto</label>
              <input
                type="text"
                id="producto"
                name="producto"
                value={formData.producto}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="proveedor">Proveedor</label>
              <input
                type="text"
                id="proveedor"
                name="proveedor"
                value={formData.proveedor}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="unidadMedida">Unidad de Medida</label>
              <input
                type="text"
                id="unidadMedida"
                name="unidadMedida"
                value={formData.unidadMedida}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="almacenLlegada">Almacén de Llegada</label>
              <input
                type="text"
                id="almacenLlegada"
                name="almacenLlegada"
                value={formData.almacenLlegada}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fechaRecepcion">Fecha de Recepción</label>
              <input
                type="date"
                id="fechaRecepcion"
                name="fechaRecepcion"
                value={formData.fechaRecepcion}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="imagen-upload-section">
            <h3>Subir Archivo</h3>
            <div className="imagen-upload-container">
              {previewUrl ? (
                <div className="imagen-preview">
                  <img src={previewUrl} alt="Vista previa del producto" />
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={32} />
                  <p>Por favor adjunte la foto de su producto.</p>
                </div>
              )}
              <input
                type="file"
                id="imagen"
                name="imagen"
                onChange={handleImagenChange}
                accept="image/*"
                className="imagen-input"
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
    </SideBar>
  )
}

export default NuevaEntrada