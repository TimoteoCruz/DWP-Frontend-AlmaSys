"use client"

import { useState } from "react"
import SideBar from "../Layouts/Sidebar"
import { Package, Truck, AlertCircle, Search } from 'lucide-react'
import "../styles/sestatus.css"

const Sestatus = () => {
  const [searchCode, setSearchCode] = useState("")
  const [trackingData, setTrackingData] = useState({
    codigo: "10392",
    producto: "Combustible",
    descripcion: "Etanol",
    cantidad: "500 L",
    sestatus: "En camino",
    fechaLlegada: "10/02/2025 - 10:50 PM",
    historial: [
      {
        estado: "Procesado",
        icono: <Package size={48} />,
        mensaje: "El paquete se prepara para ser enviado.",
        fecha: null
      },
      {
        estado: "Enviado",
        icono: <Truck size={48} />,
        mensaje: "El paquete se ha enviado con éxito",
        fecha: "09/02/2025 - 10:03 AM"
      },
      {
        estado: "Recibido",
        icono: <AlertCircle size={48} />,
        mensaje: "El paquete ha llegado a tu almacen.",
        fecha: "09/02/2025 - 10:03 AM"
      }
    ]
  })

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Buscando código:", searchCode)
  }

  const handleConfirmar = () => {
    console.log("Pedido confirmado")
    alert("Pedido confirmado con éxito")
  }

  return (
    <SideBar>
      <div className="sestatus-container">
  

        <div className="sestatus-info-container">
          <table className="sestatus-info-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>sestatus</th>
                <th>Fecha de Llegada</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{trackingData.codigo}</td>
                <td>{trackingData.producto}</td>
                <td>{trackingData.descripcion}</td>
                <td>{trackingData.cantidad}</td>
                <td>
                  <span className={`sestatus-badge sestatus-${trackingData.sestatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {trackingData.sestatus}
                  </span>
                </td>
                <td>{trackingData.fechaLlegada}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sestatus-timeline">
          {trackingData.historial.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-icon">
                {item.icono}
              </div>
              <div className="timeline-content">
                <h3>{item.estado}</h3>
                <p>{item.mensaje}</p>
                {item.fecha && <p className="timeline-date">{item.fecha}</p>}
              </div>
              {index < trackingData.historial.length - 1 && (
                <div className="timeline-arrow">
                  <svg width="50" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M49.707 13.707a1 1 0 00.093-1.32l-.093-.094-5-5a1 1 0 00-1.497 1.32l.083.094L47.585 13H1a1 1 0 100 2h46.585l-4.292 4.293a1 1 0 00-.083 1.32l.083.094a1 1 0 001.32.083l.094-.083 5-5z" fill="#000" fillRule="nonzero"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="confirmar-container">
          <button className="confirmar-button" onClick={handleConfirmar}>
            Confirmar Pedido
          </button>
        </div>
      </div>
    </SideBar>
  )
}

export default Sestatus