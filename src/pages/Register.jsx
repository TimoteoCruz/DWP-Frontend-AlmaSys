import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styles/Register.css";
import Footer from '../Layouts/footer'; 

const Register = () => {
  return (
    <div className="container">
      <FaUserCircle className="icon" />
      <h2>Crear Cuenta</h2>
      <form className="form">
        <div className="grid-container">
          <div className="form-group">
            <input type="email" placeholder="Correo" className="input" />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Empresa" className="input" />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Contraseña" className="input" />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Número de Empleado" className="input" />
          </div>
          <div className="form-group center">
            <input type="text" placeholder="RFC" className="input" />
          </div>
        </div>

        <button className="bg-blue">Crear Cuenta</button>
      </form>

      <Footer />

    </div>
  );
};

export default Register;
