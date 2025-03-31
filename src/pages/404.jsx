import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Error404.css"; 
import Footer
 from "../Layouts/footer";
const Error404 = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="error-container">
      <button className="login-button" onClick={handleLoginRedirect}>
        Iniciar Sesión
      </button>
      <h1 className="error-code">404</h1>
      <h2 className="error-message">
        <span className="zero">⓪</span>
        <span className="zero">⓪</span>
        PS...
      </h2>
      <Footer/>
    </div>
  );
};

export default Error404;
