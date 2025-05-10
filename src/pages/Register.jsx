import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService"; 
import "../styles/Register.css";
import Footer from "../Layouts/footer";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    empresa: "",  
    numeroEmpleado: "",
    rfc: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.register(formData.email, formData.empresa, formData.password, formData.numeroEmpleado, formData.rfc);
      setMessage(response.message);
      
      // Esperar un breve momento para mostrar el mensaje de éxito
      setTimeout(() => {
        // Redirigir al usuario a la página de login
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="container">
      <FaUserCircle className="icon" />
      <h2>Crear Cuenta</h2>
      {message && <p className="message">{message}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="grid-container">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="empresa"  
              placeholder="Empresa"
              className="input"
              value={formData.empresa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="numeroEmpleado"
              placeholder="Número de Empleado"
              className="input"
              value={formData.numeroEmpleado}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group center">
            <input
              type="text"
              name="rfc"
              placeholder="RFC"
              className="input"
              value={formData.rfc}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className="bg-blue" type="submit">Crear Cuenta</button>
      </form>
      <Footer />
    </div>
  );
};

export default Register;