"use client"

import { useState, useEffect, useRef } from "react";
import SideBar from "../Layouts/Sidebar";
import { Package, Truck, CheckCircle } from "lucide-react";
import "../styles/estatus.css";
import AlmacenesService from "../services/AlmacenesService";
import { useLocation, useNavigate } from "react-router-dom";
import { useLongPolling } from "../hooks/use-long-polling";


const Estatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movimiento = location.state?.movimiento;

  // Estado inicial (puedes ajustar según lo que llegue en el objeto movimiento)
  const [estatus, setEstatus] = useState(movimiento?.estadoMostrar || "Procesado");
  const [fechaLlegada, setFechaLlegada] = useState(movimiento?.fechaLlegada || "Pendiente");
  const socketRef = useRef(null);
  const estatusRef = useRef(estatus);

  // Actualizar referencia del estado para usar en callbacks
  useEffect(() => {
    estatusRef.current = estatus;
  }, [estatus]);

  // Actualizar el estado y el DOM cuando se recibe una actualización
  const updateStateAndDOM = (newEstatus, newFechaLlegada) => {
    if (newEstatus && newEstatus !== estatus) {
      console.log('Actualizando estatus en el DOM:', newEstatus);
      setEstatus(newEstatus);
    }
    if (newFechaLlegada && newFechaLlegada !== fechaLlegada) {
      console.log('Actualizando fecha de llegada en el DOM:', newFechaLlegada);
      setFechaLlegada(newFechaLlegada);
    }
  };
  
  // Función para obtener el estado actual del movimiento
  const fetchEstatus = async () => {
    if (!movimiento?.id) {
      console.log('No hay ID de movimiento, no se puede obtener estatus');
      return null;
    }
    
    console.log('Obteniendo estatus mediante polling para movimiento:', movimiento.id);
    try {
      // Usar el método de long polling que espera cambios en el servidor
      const data = await AlmacenesService.longPollMovimientoStatus(movimiento.id, estatusRef.current);
      
      // Si no hay cambios, simplemente devolver el estado actual
      if (data.noChange) {
        console.log('No hay cambios en el estatus, manteniendo estado actual');
        return { estatus: estatusRef.current, fechaLlegada };
      }
      
      console.log('Datos de estatus obtenidos mediante long polling:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener estatus mediante long polling:', error);
      return null;
    }
  };

  // Configurar long polling para actualizaciones de estado
  const { data: estatusData, startPolling, stopPolling } = useLongPolling(fetchEstatus, {
    interval: 1000, // Intervalo de 1 segundo para mayor reactividad
    enabled: !!movimiento?.id, // Habilitar solo si hay ID de movimiento
    immediate: true, // Ejecutar inmediatamente al montar
    onSuccess: (data) => {
      if (data && data.estatus) {
        console.log('Actualización recibida por long polling:', data);
        // Verificar si hay cambios reales en el estatus
        if (data.estatus !== estatus || (data.fechaLlegada && data.fechaLlegada !== fechaLlegada)) {
          console.log('Actualizando estado local con nuevos datos');
          updateStateAndDOM(data.estatus, data.fechaLlegada);
        }
      }
    },
    onError: (error) => {
      console.error('Error en long polling:', error);
      // Reintentar después de un error
      setTimeout(startPolling, 2000);
    }
  });
  
  // Forzar actualización inmediata cuando cambia el ID del movimiento
  useEffect(() => {
    if (movimiento?.id) {
      console.log('ID de movimiento cambiado, forzando actualización');
      stopPolling();
      startPolling();
    }
  }, [movimiento?.id]);
  
  // Efectos al cambiar datos de estatusData
  useEffect(() => {
    if (estatusData) {
      console.log('Datos de estatus actualizados:', estatusData);
      if (estatusData.estatus !== estatus || 
          (estatusData.fechaLlegada && estatusData.fechaLlegada !== fechaLlegada)) {
        updateStateAndDOM(estatusData.estatus, estatusData.fechaLlegada);
      }
    }
  }, [estatusData, estatus, fechaLlegada]);

  // Obtener estado inicial (opcional, si es que el objeto movimiento no trae todo)
  useEffect(() => {
    if (movimiento?.id) {
      AlmacenesService.getMovimientoStatus(movimiento.id)
        .then((data) => {
          if (data.estatus) {
            setEstatus(data.estatus);
            if (data.estatus === "Recibido" && data.fechaLlegada) {
              setFechaLlegada(data.fechaLlegada);
            }
          }
        })
        .catch((error) => console.error("Error al obtener estado inicial:", error));
    }
  }, [movimiento?.id]);

  const handleEstatusChange = async (newEstatus) => {
    if (newEstatus === estatus) {
      console.log('El estatus es el mismo, no se actualiza');
      return;
    }

    console.log('Iniciando actualización de estatus a:', newEstatus);
    setEstatus(newEstatus);
    
    let nuevaFecha = fechaLlegada;
    if (newEstatus === "Recibido") {
      nuevaFecha = new Date().toLocaleString();
      setFechaLlegada(nuevaFecha);
    }

    try {
      console.log('Enviando actualización al servidor...');
      // Actualizar el estatus en el servidor
      await AlmacenesService.updateMovimientoEstatus(movimiento.id, newEstatus);
      console.log('Estatus actualizado exitosamente en el servidor:', newEstatus);
      
      // Forzar una actualización inmediata del polling para que otras ventanas
      // detecten el cambio más rápido
      stopPolling();
      startPolling();
    } catch (error) {
      console.error('Error al actualizar el estatus:', error);
      setEstatus(estatusRef.current);
      setFechaLlegada(fechaLlegada);
    }
  };

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
  ];

  return (
    <SideBar>
      <div className="estatus-container">
        <h1>Estatus de Movimiento</h1>
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
                    className={`estatus-select estatus-${estatus.toLowerCase().replace(/\s+/g, "-")}`}
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
        <div className="estatus-timeline">
          {historial.map((item, index) =>
            item.activo ? (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">{item.icono}</div>
                <div className="timeline-content">
                  <h3>{item.estado}</h3>
                  <p>{item.mensaje}</p>
                  {item.estado === "Enviado" && estatus === "Enviado" && (
                    <p className="timeline-date">{new Date().toLocaleString()}</p>
                  )}
                  {item.estado === "Recibido" && estatus === "Recibido" && (
                    <p className="timeline-date">{fechaLlegada}</p>
                  )}
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
            ) : null
          )}
        </div>
      </div>
    </SideBar>
  );
};

export default Estatus;
