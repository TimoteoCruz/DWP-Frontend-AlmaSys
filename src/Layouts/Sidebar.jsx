import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import 'font-awesome/css/font-awesome.min.css';

const breadcrumbMap = {
  "/almacenes": "Inicio > Almacenes",
  "/programar": "Inicio > Programar",
  "/entrada": "Inicio > Entradas",
  "/salida": "Inicio > Salidas",
  "/producto": "Inicio > Productos",
  "/nalmacen": "Inicio > Almacenes"
};

const SideBar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem("email") || "Usuario Desconocido";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">
          <div className="logo-cloud">
            <span>AlmaSys</span>
          </div>
        </div>

        <nav className="nav-menu">
          <ul>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/almacenes")}>
                <i className="icon home-icon"></i>
                <span>Inicio</span>
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/programar")}>
                <i className="icon clock-icon"></i>
                <span>Programar</span>
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/entrada")}>
                <i className="icon truck-in-icon"></i>
                <span>Entradas</span>
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/salida")}>
                <i className="icon truck-out-icon"></i>
                <span>Salidas</span>
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/producto")}>
                <i className="icon product-icon"></i>
                <span>Productos</span>
              </button>
            </li>
            <li className="nav-item active">
              <button onClick={() => handleNavigation("/nalmacen")}>
                <i className="icon warehouse-icon"></i>
                <span>Almacenes</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="logout-section" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <i className="icon logout-icon"></i>
          <span>Cerrar Sesión</span>
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="navigation-path">
            <span>{breadcrumbMap[location.pathname] || "Inicio"}</span>
          </div>

          <div className="search-container">
            <div className="input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Escribe algo aquí"
              />
            </div>
          </div>

          <div className="user-logged-in">
            <div className="user-avatar">
              <i className="user-icon"></i>
            </div>
            <span className="user-name">{userEmail}</span>
          </div>
        </div>

        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
