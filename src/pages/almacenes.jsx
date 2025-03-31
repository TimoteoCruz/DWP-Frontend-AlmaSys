import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import AlmacenesService from "../services/AlmacenesService";
import SideBar from "../Layouts/Sidebar";
import {
  PlusCircle,
  Edit,
  Trash2,
  MapPin,
  Box,
  BarChart,
  Filter,
  ChevronLeft,
  ChevronRight,
  Home,
  HelpCircle,
} from "lucide-react";
import "../styles/almacenes.css";

const Almacenes = () => {
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const data = await AlmacenesService.getAllAlmacenes();
        setAlmacenes(data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los almacenes',
          confirmButtonText: 'Aceptar'
        });
        console.error("Error fetching warehouses:", error);
      }
    };
    fetchAlmacenes();
  }, []);

  const handleEliminarAlmacen = async (almacenId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará permanentemente el almacén",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AlmacenesService.deleteAlmacen(almacenId);
          
          // Update the local state to remove the deleted warehouse
          setAlmacenes(almacenes.filter(a => a.id !== almacenId));
          
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El almacén ha sido eliminado exitosamente',
            confirmButtonText: 'Aceptar'
          });
        } catch (error) {
          console.error("Error deleting warehouse:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el almacén',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    });
  };

  const handleEditarAlmacen = (almacenId) => {
    navigate(`/editar-almacen/${almacenId}`);
  };

  const handleHelp = () => {
    Swal.fire({
      title: 'Ayuda - Almacenes',
      html: `
        <p>En esta sección puedes:</p>
        <ul>
          <li>Ver todos tus almacenes</li>
          <li>Agregar nuevos almacenes</li>
          <li>Editar información de almacenes existentes</li>
          <li>Eliminar almacenes que ya no necesites</li>
        </ul>
      `,
      icon: 'info',
      confirmButtonText: 'Entendido'
    });
  };

  const filteredAlmacenes = almacenes.filter(
    (almacen) =>
      (almacen.nombreAlmacen && almacen.nombreAlmacen.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (almacen.calle && almacen.calle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (almacen.municipio && almacen.municipio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (almacen.ciudad && almacen.ciudad.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlmacenes = filteredAlmacenes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAlmacenes.length / itemsPerPage);

  return (
    <SideBar>
      <div className="almacenes-container">
        <div className="almacenes-header">
          <h1 className="almacenes-title">
            <Home size={24} className="mr-2" /> Almacenes
          </h1>
          <div className="header-buttons">
            <button className="btn-filtros">
              <Filter size={18} /> Filtros
            </button>
            <button className="btn-agregar" onClick={() => navigate("/nalmacen")}>
              <PlusCircle size={18} /> Agregar
            </button>
            <button className="btn-help" onClick={handleHelp}>
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        <div className="almacenes-search">
          <input 
            type="text" 
            placeholder="Buscar almacenes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="almacenes-grid">
          {currentAlmacenes.map((almacen) => (
            <div key={almacen.id} className="almacen-card">
              <div className="almacen-card-content">
                <div className="almacen-header">
                  <h2 className="almacen-nombre">{almacen.nombreAlmacen}</h2>
                  <span className={`estado-badge ${almacen.estado === "Activo" ? "estado-activo" : "estado-inactivo"}`}>
                    {almacen.estado}
                  </span>
                </div>

                <div className="almacen-info">
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{`${almacen.calle}, ${almacen.ciudad}, ${almacen.municipio}, ${almacen.estado} ${almacen.codigoPostal}`}</span>
                  </div>

                  <div className="info-item">
                    <Box size={16} />
                    <span>Capacidad: {almacen.espacios} espacios</span>
                  </div>

                  <div className="ocupacion-container">
                    <div className="ocupacion-header">
                      <div className="info-item">
                        <BarChart size={16} />
                        <span>Ocupación:</span>
                      </div>
                      <span>{almacen.ocupacion ? almacen.ocupacion : 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${
                          almacen.ocupacion > 80
                            ? "progress-high"
                            : almacen.ocupacion > 60
                            ? "progress-medium"
                            : "progress-low"
                        }`}
                        style={{ width: `${almacen.ocupacion ? almacen.ocupacion : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="almacen-actions">
                <button 
                  className="action-button edit-button" 
                  onClick={() => handleEditarAlmacen(almacen.id)}
                >
                  <Edit size={18} />
                </button>
                <button 
                  className="action-button delete-button" 
                  onClick={() => handleEliminarAlmacen(almacen.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAlmacenes.length === 0 && <div className="no-results"> <p>No se encontraron almacenes.</p> </div>}

        {filteredAlmacenes.length > 0 && (
          <div className="pagination">
            <button className="pagination-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} className={`pagination-number ${currentPage === page ? "pagination-active" : ""}`} onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            ))}
            <button className="pagination-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </SideBar>
  );
};

export default Almacenes;