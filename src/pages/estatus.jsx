"use client"

import { useState, useCallback, useEffect } from "react"
import SideBar from "../Layouts/Sidebar"
import { Package, Truck, CheckCircle } from 'lucide-react'
import "../styles/estatus.css"
import AlmacenesService from "../services/AlmacenesService"
import { useLocation, useNavigate } from "react-router-dom"
import { useLongPolling } from "../hooks/use-long-pollin"

const Estatus = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const movimiento = location.state?.movimiento

  const [estatus, setEstatus] = useState(movimiento?.estadoMostrar || "Procesado")
  const [fechaLlegada, setFechaLlegada] = useState(movimiento?.fechaLlegada || "Pendiente")

  // Usar useCallback para la función de fetch
  const fetchMovimientoStatus = useCallback(() => {
    console.log('Llamando a getMovimientoStatus con ID:', movimiento?.id);
    return AlmacenesService.getMovimientoStatus(movimiento?.id);
  }, [movimiento?.id]);

  // Usar useCallback para onSuccess
  const handleSuccessResponse = useCallback((data) => {
    console.log('Datos recibidos en onSuccess:', data);
    if (data.estatus && data.estatus !== estatus) {
      setEstatus(data.estatus);
      if (data.estatus === "Recibido" && data.fechaLlegada) {
        setFechaLlegada(data.fechaLlegada);
      }
    }
  }, [estatus]);

  // Usar las funciones con useCallback en el hook
  const { data: statusData, isPolling } = useLongPolling(
    fetchMovimientoStatus, 
    {
      interval: 5000,
      enabled: !!movimiento?.id,
      onSuccess: handleSuccessResponse,
      onError: useCallback((err) => {
        console.error('Error en polling:', err);
      }, []),
    }
  );

  // Agregar logs para depuración
  useEffect(() => {
    console.log('Movimiento:', movimiento);
    console.log('Estado de polling:', isPolling);
  }, [movimiento, isPolling]);

  const handleEstatusChange = async (newEstatus) => {
    setEstatus(newEstatus)

    let nuevaFecha = fechaLlegada
    if (newEstatus === "Recibido") {
      nuevaFecha = new Date().toLocaleString()
      setFechaLlegada(nuevaFecha)
    }

    try {
      await AlmacenesService.updateMovimientoEstatus(movimiento.id, newEstatus)
    } catch (error) {
      console.error("Error al actualizar el estatus:", error)
    }
  }

  const historial = [
    {
      estado: "Procesado",
      icono: <Package size={48} />,
      mensaje: "El paquete se prepara para ser enviado.",
      activo: true,
    },
    {
      estado: "Enviado",
      icono: estatus !== "Procesado" ? <Truck size={48} /> : null,
      mensaje: "El paquete se ha enviado con éxito.",
      activo: estatus !== "Procesado",
    },
    {
      estado: "Recibido",
      icono: estatus === "Recibido" ? <CheckCircle size={48} /> : null,
      mensaje: "El paquete se ha recibido en el almacén.",
      activo: estatus === "Recibido",
    },
  ]

  return (
    <SideBar>
      <div className="estatus-container">
        <h1>Estatus de Movimiento</h1>

        {/* Información del movimiento */}
        <div className="estatus-info-container">
          <table className="estatus-info-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Almacén Origen</th>
                <th>Almacén Destino</th>
                <th>Cantidad</th>
                <th>Estatus</th>
                <th>Fecha de Llegada</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{movimiento?.id || "N/A"}</td>
                <td>{movimiento?.nombreProducto || "N/A"}</td>
                <td>{movimiento?.almacenOrigenNombre || "N/A"}</td>
                <td>{movimiento?.almacenDestinoNombre || "N/A"}</td>
                <td>{movimiento?.cantidad || "N/A"}</td>
                <td>
                  <select
                    value={estatus}
                    onChange={(e) => handleEstatusChange(e.target.value)}
                    className={`estatus-select estatus-${estatus.toLowerCase()}`}
                  >
                    <option value="Procesado">Procesado</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Recibido">Recibido</option>
                  </select>
                </td>
                <td>{fechaLlegada}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Timeline de estatus */}
        <div className="estatus-timeline">
          {historial.map((item, index) =>
            item.activo ? (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">{item.icono}</div>
                <div className="timeline-content">
                  <h3>{item.estado}</h3>
                  <p>{item.mensaje}</p>
                </div>
                {index < historial.length - 1 && historial[index + 1].activo && (
                  <div className="timeline-arrow">
                    <svg width="50" height="24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M49.707 13.707a1 1 0 00.093-1.32l-.093-.094-5-5a1 1 0 00-1.497 1.32l.083.094L47.585 13H1a1 1 0 100 2h46.585l-4.292 4.293a1 1 0 00-.083 1.32l.083.094a1 1 0 001.32.083l.094-.083 5-5z"
                        fill="#000"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ) : null,
          )}
        </div>
      </div>
    </SideBar>
  )
}

export default Estatus