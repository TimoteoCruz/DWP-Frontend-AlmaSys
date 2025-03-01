import React from 'react';
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Footer from '../Layouts/footer'; 
import '../styles/Login.css'; 

const Login = () => {
  return (
    <div className="container">
      <FaUserCircle className="icon" />
      <h2>Iniciar Sesión</h2>
      <form>
        <input type="email" placeholder="Correo" />
        <input type="password" placeholder="Contraseña" />
        <p className="forgot-password">¿Olvidaste tu contraseña?</p>

        <div className="button-group">
          <button className="bg-blue">Ingresar</button>
          <div className="divider"></div>
          <Link to="/register">
            <button className="bg-green">Solicitar una cuenta</button>
          </Link>
        </div>
      </form>

      <Footer />
    </div>
  );
};

export default Login;
