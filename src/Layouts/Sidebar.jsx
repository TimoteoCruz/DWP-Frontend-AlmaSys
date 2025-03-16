import React from "react";
import "../styles/Sidebar.css";
import 'font-awesome/css/font-awesome.min.css';

const SideBar = ({ children }) => {
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
              <a href="/almacenes">
                <i className="icon home-icon"></i>
                <span>Inicio</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/programar">
                <i className="icon clock-icon"></i>
                <span>Programar</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/entrada">
                <i className="icon truck-in-icon"></i>
                <span>Entradas</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/salida">
                <i className="icon truck-out-icon"></i>
                <span>Salidas</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/nentrada">
                <i className="icon product-icon"></i>
                <span>Productos</span>
              </a>
            </li>
            <li className="nav-item active">
              <a href="/nalmacen">
                <i className="icon warehouse-icon"></i>
                <span>Almacenes</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="logout-section">
          <a href="#logout">
            <i className="icon logout-icon"></i>
            <span>Cerrar Sesión</span>
          </a>
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="navigation-path">
            <a href="/nalmacen">Inicio</a>
            <span className="separator">&gt;</span>
            <span className="current-page">Almacenes</span>
          </div>

          <div className="search-container">
            <div className="input-wrapper">
              <i className="search-icon fas fa-search"></i>
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
            <span className="user-name">Usuario_Logeado</span>
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
