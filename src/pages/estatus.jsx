"use client"

import { useState } from "react"
import SideBar from "../Layouts/Sidebar"
import { Package, Truck, CheckCircle, Search } from 'lucide-react'
import "../styles/estatus.css"

const Estatus = () => {
  const [searchCode, setSearchCode] = useState("")
  const [trackingData, setTrackingData] = useState({
    codigo: "10392",
    producto: "Combustible",
    descripcion: "Etanol",
    cantidad: "500 L",
    estatus: "En camino",
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
        icono: <CheckCircle size={48} />,
        mensaje: "El paquete se ha recibido en el Almacén",
        fecha: "09/02/2025 - 10:03 AM"
      }
    ]
  })

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Buscando código:", searchCode)
  }

  return (
    <SideBar>
      <div className="estatus-container">
        <div className="estatus-header">
          <h1>Estatus de Envío</h1>
        </div>

        <div className="estatus-info-container">
          <table className="estatus-info-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Estatus</th>
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
                  <span className={`estatus-badge estatus-${trackingData.estatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {trackingData.estatus}
                  </span>
                </td>
                <td>{trackingData.fechaLlegada}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="estatus-timeline">
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
      </div>
    </SideBar>
  )
}

export default Estatus