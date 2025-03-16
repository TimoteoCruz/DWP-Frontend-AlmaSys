"use client"

import { useState } from "react"
import SideBar from "../Layouts/Sidebar"
import { Calendar, Clock, Save, Box, FileText, Home, ChevronDown, Truck, Edit, Trash2 } from 'lucide-react'
import "../styles/Programar.css"

const Programar = () => {
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    almacenSalida: "",
    producto: "",
    descripcion: "",
    cantidad: "",
    almacenLlegada: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [registros, setRegistros] = useState([
    {
      id: 1,
      codigo: "PRD001",
      producto: "Televisores LED 50\"",
      descripcion: "Smart TV con resolución 4K",
      cantidad: 25,
      subtotal: 12500,
      total: 14750
    },
    {
      id: 2,
      codigo: "PRD002",
      producto: "Refrigeradores",
      descripcion: "Nevera no-frost de dos puertas",
      cantidad: 12,
      subtotal: 9600,
      total: 11328
    },
    {
      id: 3,
      codigo: "PRD003",
      producto: "Laptops",
      descripcion: "Computador portátil Core i7",
      cantidad: 30,
      subtotal: 24000,
      total: 28320
    },
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const nuevoRegistro = {
      id: registros.length + 1,
      codigo: `PRD00${registros.length + 1}`,
      producto: formData.producto,
      descripcion: formData.descripcion,
      cantidad: parseInt(formData.cantidad),
      subtotal: parseInt(formData.cantidad) * 800, 
      total: parseInt(formData.cantidad) * 800 * 1.18 
    }
    
    setRegistros([nuevoRegistro, ...registros])
    
    console.log("Datos enviados:", formData)
    setSubmitted(true)

    setTimeout(() => {
      setFormData({
        fecha: "",
        hora: "",
        almacenSalida: "",
        producto: "",
        descripcion: "",
        cantidad: "",
        almacenLlegada: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  const filteredRegistros = registros.filter(
    (registro) =>
      registro.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const almacenes = [
    "Almacén Central",
    "Almacén Norte",
    "Almacén Sur",
    "Almacén Este",
    "Almacén Oeste",
    "Almacén Metropolitano",
  ]

  return (
    <SideBar>
      <div className="programar-container">
        <div className="programar-header">
         
        </div>

        {submitted ? (
          <div className="success-message">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h2>¡Registro Exitoso!</h2>
              <p>El producto ha sido registrado correctamente.</p>
            </div>
          </div>
        ) : (
          <div className="form-container">
            <form onSubmit={handleSubmit} className="programar-form">
              <div className="form-row three-columns">
                <div className="form-group">
                  <label htmlFor="fecha">
                    <Calendar size={16} className="icon" />
                    Fecha de Registro
                  </label>
                  <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="hora">
                    <Clock size={16} className="icon" />
                    Hora de Registro
                  </label>
                  <input type="time" id="hora" name="hora" value={formData.hora} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="almacenSalida">
                    <Home size={16} className="icon" />
                    Almacén
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="almacenSalida"
                      name="almacenSalida"
                      value={formData.almacenSalida}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Seleccione un almacén
                      </option>
                      {almacenes.map((alm, index) => (
                        <option key={index} value={alm}>
                          {alm}
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
                  <input
                    type="text"
                    id="producto"
                    name="producto"
                    value={formData.producto}
                    onChange={handleChange}
                    placeholder="Ingrese el producto"
                    required
                  />
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
          <div className="registros-table-container">
            <table className="registros-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistros.map((registro) => (
                  <tr key={registro.id}>
                    <td>{registro.codigo}</td>
                    <td>{registro.producto}</td>
                    <td>{registro.descripcion}</td>
                    <td>{registro.cantidad}</td>
                    <td>S/ {registro.subtotal.toFixed(2)}</td>
                    <td>S/ {registro.total.toFixed(2)}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-button edit-button">
                          <Edit size={16} />
                        </button>
                        <button className="action-button delete-button">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SideBar>
  )
}

export default Programar