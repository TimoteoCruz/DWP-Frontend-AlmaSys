import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Footer from '../Layouts/footer';
import '../styles/Login.css';
import Swal from 'sweetalert2';

// Componente para solicitar correo y enviar código de recuperación
const RequestReset = ({ onNextStep, onEmailChange }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingresa tu correo electrónico',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      // Solicitud al servidor para enviar el código de recuperación
      const response = await fetch("http://localhost:3000/request-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al solicitar restablecimiento");
      }

      Swal.fire({
        icon: 'success',
        title: 'Código enviado',
        text: 'Se ha enviado un código de verificación a tu correo',
        confirmButtonColor: '#3085d6'
      });
      
      onEmailChange(email);
      onNextStep('verify');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al solicitar restablecimiento',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <>
      <h2>Recuperar Contraseña</h2>
      <p className="reset-instructions">Ingresa tu correo electrónico para recibir un código de verificación</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="button-group">
          <button type="submit" className="bg-blue">Enviar código</button>
        </div>
      </form>
    </>
  );
};

// Componente para verificar código y establecer nueva contraseña
const VerifyAndReset = ({ email, onNextStep }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      // Verificar código y establecer nueva contraseña
      const response = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          verificationCode, 
          newPassword 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer contraseña");
      }

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tu contraseña ha sido restablecida correctamente',
        confirmButtonColor: '#3085d6'
      });
      
      onNextStep('success');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al restablecer contraseña',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <>
      <h2>Establece tu nueva contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Código de verificación"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="button-group">
          <button type="submit" className="bg-blue">Restablecer contraseña</button>
        </div>
      </form>
    </>
  );
};

// Componente principal de restablecimiento de contraseña
const ResetPassword = () => {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <FaLock className="icon" />
      
      {step === 'request' && (
        <RequestReset 
          onNextStep={setStep} 
          onEmailChange={setEmail} 
        />
      )}
      
      {step === 'verify' && (
        <VerifyAndReset 
          email={email} 
          onNextStep={setStep} 
        />
      )}
      
      {step === 'success' && (
        <div className="success-message">
          <h2>¡Contraseña restablecida!</h2>
          <p>Tu contraseña ha sido cambiada correctamente.</p>
          <button 
            onClick={handleSuccess} 
            className="bg-blue"
          >
            Volver al inicio de sesión
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ResetPassword;