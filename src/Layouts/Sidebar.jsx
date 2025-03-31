"use client"
import { useNavigate, useLocation, Link } from "react-router-dom"
import "../styles/Sidebar.css"
import "font-awesome/css/font-awesome.min.css"

const breadcrumbMap = {
  "/almacenes": "Inicio > Almacenes",
  "/programar": "Inicio > Programar",
  "/entrada": "Inicio > Entradas",
  "/salida": "Inicio > Salidas",
  "/producto": "Inicio > Productos",
  "/nalmacen": "Inicio > Almacenes",
}

const SideBar = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const userEmail = localStorage.getItem("email") || "Usuario Desconocido"

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    navigate("/login")
  }

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
              <Link to="/almacenes">
                <i className="icon home-icon"></i>
                <span>Inicio</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/programar">
                <i className="icon clock-icon"></i>
                <span>Programar</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/entrada">
                <i className="icon truck-in-icon"></i>
                <span>Entradas</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/salida">
                <i className="icon truck-out-icon"></i>
                <span>Salidas</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/producto">
                <i className="icon product-icon"></i>
                <span>Productos</span>
              </Link>
            </li>
            <li className="nav-item active">
              <Link to="/nalmacen">
                <i className="icon warehouse-icon"></i>
                <span>Almacenes</span>
              </Link>
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
              <input type="text" className="search-input" placeholder="Escribe algo aquí" />
            </div>
          </div>

          <div className="user-logged-in">
            <div className="user-avatar">
              <i className="user-icon"></i>
            </div>
            <span className="user-name">{userEmail}</span>
          </div>
        </div>

        <div className="content-wrapper">{children}</div>
      </div>
    </div>
  )
}

export default SideBar

