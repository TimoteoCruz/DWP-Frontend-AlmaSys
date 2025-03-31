import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import '../styles/mfa.css'; 
import Swal from 'sweetalert2';
import api from '../services/api'; // Import the API service

const MFAVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailFromLocation = location.state?.email || '';
    if (!emailFromLocation) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso inválido',
        text: 'Por favor inicia sesión primero',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/login');
      });
      return;
    }
    setEmail(emailFromLocation);
  }, [location, navigate]);

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!verificationCode || verificationCode.length !== 6) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingresa el código de verificación de 6 dígitos',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    setLoading(true);

    try {
      // Use API service to verify code
      const response = await api.post("/verify-code", { 
        email, 
        verificationCode 
      });

      // Success handling
      Swal.fire({
        icon: 'success',
        title: '¡Verificación exitosa!',
        text: 'Iniciando sesión...',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/almacenes');
      });

    } catch (error) {
      // Error handling
      console.error("Error en la verificación:", error);
      
      let errorMessage = "Error al verificar el código";
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data.error || "Código de verificación incorrecto";
            break;
          case 500:
            errorMessage = "Error del servidor. Intenta más tarde.";
            break;
          default:
            errorMessage = error.response.data?.error || errorMessage;
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post("/send-verification-code", { email });
      
      Swal.fire({
        icon: 'success',
        title: 'Código reenviado',
        text: 'Se ha enviado un nuevo código de verificación a tu correo',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error("Error al reenviar código:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo reenviar el código. Intenta más tarde.',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="container mfa-container">
      <div className="mfa-header">
        <FaShieldAlt className="shield-icon-large" />
        <h2>Verificación en dos pasos</h2>
        <p className="user-email">Usuario: {email}</p>
      </div>

      <form onSubmit={handleVerificationSubmit}>
        <div className="step-indicator">Paso 2 de 2: Verificación</div>
        <p className="verification-instruction">
          Ingresa el código de 6 dígitos enviado a tu correo:
          <br />
          <strong>{email}</strong>
        </p>

        <input 
          type="text" 
          placeholder="Código de verificación" 
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
          maxLength={6}
          className="verification-input"
          disabled={loading}
        />

        <div className="button-group">
          <button 
            type="submit" 
            className="bg-blue" 
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Verificar e ingresar'}
          </button>
        </div>

        <div className="resend-code">
          <p 
            onClick={handleResendCode}
            style={{ 
              cursor: 'pointer', 
              color: '#3085d6', 
              textDecoration: 'underline',
              marginTop: '10px'
            }}
          >
            Reenviar código
          </p>
        </div>
      </form>
    </div>
  );
};

export default MFAVerification;