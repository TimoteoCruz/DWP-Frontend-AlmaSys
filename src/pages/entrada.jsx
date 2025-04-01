"use client"

import { useState, useEffect } from "react";
import SideBar from "../Layouts/Sidebar";
import { Search, FileText, Filter, Calendar, ChevronDown, Box, Save, Edit, Trash2, Eye } from 'lucide-react';
import "../styles/entrada.css";
import AlmacenesService from "../services/AlmacenesService";
import { useNavigate } from "react-router-dom";

const Entrada = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [registros, setRegistros] = useState([]);
  const [almacenes, setAlmacenes] = useState({});
  const [productos, setProductos] = useState({}); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const almacenesData = await AlmacenesService.getAllAlmacenes();
        
        const almacenesMap = {};
        almacenesData.forEach(almacen => {
          almacenesMap[almacen.id] = almacen.nombre;
        });
        
        setAlmacenes(almacenesMap);
        
        const productosData = await AlmacenesService.getAllProductos();
        
        const productosMap = {};
        productosData.forEach(producto => {
          productosMap[producto.id] = producto.codigoSKU || producto.codigo;
        });
        
        setProductos(productosMap);
        
        const response = await AlmacenesService.getMovimientos();
        
        const movimientosNormalizados = (response.movimientos || []).map(movimiento => {
          const estadoMostrar = movimiento.estatus || movimiento.motivo || 'Sin estatus';
          
          return {
            ...movimiento,
            estadoMostrar,
            almacenOrigenNombre: movimiento.almacenOrigen || 
                               (movimiento.almacenOrigenId ? almacenesMap[movimiento.almacenOrigenId] || 'Sin especificar' : 'Sin especificar'),
            almacenDestinoNombre: movimiento.almacenDestino || 
                                (movimiento.almacenDestinoId ? almacenesMap[movimiento.almacenDestinoId] || 'Sin especificar' : 'Sin especificar'),
            codigoSKU: movimiento.productoId ? productosMap[movimiento.productoId] || 'N/A' : 'N/A'
          };
        });
        
        setRegistros(movimientosNormalizados);
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleNuevaEntrada = () => {
    navigate("/nentrada");
  };

  const handleEditEstatus = (registro) => {
    navigate("/estatus", { state: { movimiento: registro } });
  };

  const filteredRegistros = registros.filter((registro) => {
    const matchesSearch =
      (registro.productoId?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (registro.nombreProducto?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (registro.codigoSKU?.toLowerCase().includes(searchTerm.toLowerCase()) || '') || 
      (registro.almacenOrigenNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registro.almacenDestinoNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registro.estadoMostrar.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (registro.fechaMovimiento?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    
    const matchesStatus = statusFilter === "Todos" || 
                         registro.estadoMostrar.toLowerCase() === statusFilter.toLowerCase();
  
    return matchesSearch && matchesStatus;
  });

  const getUniqueStatuses = () => {
    const allStatuses = registros.map(r => r.estadoMostrar);
    const uniqueStatuses = [...new Set(allStatuses)];
    return ["Todos", ...uniqueStatuses.filter(s => s)];
  };

  const statusOptions = getUniqueStatuses();

  return (
    <SideBar>
      <div className="entrada-container">
        <div className="entrada-header">
          <h1>Entradas de Productos</h1>
          <div className="search-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar productos, almacenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
            <button className="btn-nuevo" onClick={handleNuevaEntrada}>
              <Box size={18} />
              Nueva entrada
            </button>
          </div>
        </div>

        <div className="entrada-table-container">
          {loading ? (
            <div className="loading">
              <p>Cargando datos...</p>
            </div>
          ) : filteredRegistros.length === 0 ? (
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
                <div className="header-cell">Almacén Origen</div>
                <div className="header-cell">Almacén Destino</div>
                <div className="header-cell">Estatus</div>
                <div className="header-cell">Fecha Movimiento</div>
                <div className="header-cell">Fecha Llegada</div>
                <div className="header-cell actions-cell">Acciones</div>
              </div>
              
              <div className="entrada-table-body">
                {filteredRegistros.map((registro) => (
                  <div key={registro.id} className="entrada-table-row">
                    <div className="cell image-cell">
                      <img src={registro.imagen || '/images/placeholder.jpg'} alt={registro.nombreProducto || 'Producto desconocido'} />
                    </div>
                    <div className="cell">{registro.codigoSKU || 'N/A'}</div>
                    <div className="cell">{registro.nombreProducto || 'Producto desconocido'}</div>
                    <div className="cell">{registro.almacenOrigenNombre}</div>
                    <div className="cell">{registro.almacenDestinoNombre}</div>
                    <div className="cell">
                      <span className={`status-badge status-${registro.estadoMostrar.toLowerCase().replace(/\s+/g, '-')}`}>
                        {registro.estadoMostrar}
                      </span>
                    </div>
                    <div className="cell">{registro.fechaMovimiento || 'Fecha desconocida'}</div>
                    <div className="cell">{registro.fechaLlegada || 'Pendiente'}</div>
                    <div className="cell actions-cell">
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEditEstatus(registro)}
                      >
                        <Edit size={16} />
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
  );
};

export default Entrada;