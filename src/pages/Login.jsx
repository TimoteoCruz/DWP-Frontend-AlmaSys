import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Footer from '../Layouts/footer'; 
import '../styles/Login.css'; 
import Swal from 'sweetalert2';
import AuthService from '../services/authService'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#3085d6'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showAlert('warning', 'Campos vacíos', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const { token, empresa } = await AuthService.login(email, password);

      localStorage.setItem("token", token);  
      localStorage.setItem('email', email); 
      localStorage.setItem('empresa', empresa || 'Sin empresa'); 

      await AuthService.sendVerificationCode(email);

      showAlert('success', 'Inicio de sesión exitoso', 'Redirigiendo a verificación de dos pasos...');

      navigate('/mfa', { state: { email: email } });

    } catch (error) {
      console.error("Error en el login", error);

      let errorMessage = "Ocurrió un problema inesperado.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Credenciales inválidas. Verifica tu correo y contraseña.";
            break;
          case 401:
            errorMessage = "Acceso no autorizado. Verifica tus credenciales.";
            break;
          case 500:
            errorMessage = "Error del servidor. Intenta más tarde.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }

      showAlert('error', 'Error de autenticación', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset');
  };

  return (
    <div className="container">
      <FaUserCircle className="icon" />
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Correo" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input 
          type="password" 
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <p 
          className="forgot-password"
          onClick={handleForgotPassword}
          style={{ cursor: 'pointer' }}
        >
          ¿Olvidaste tu contraseña?
        </p>

        <div className="button-group">
          <button 
            type="submit" 
            className="bg-blue" 
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Ingresar'}
          </button>
          <div className="divider"></div>
          <Link to="/register">
            <button 
              type="button" 
              className="bg-green"
              disabled={loading}
            >
              Solicitar una cuenta
            </button>
          </Link>
        </div>
      </form>

      <Footer />
    </div>
  );
};

export default Login;
