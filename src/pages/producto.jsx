"use client";

import { useState } from "react";
import SideBar from "../Layouts/Sidebar";
import { Upload, Save, Box } from "lucide-react";
import "../styles/producto.css";
import AlmacenesService from "../services/AlmacenesService"; 

const RegistroProducto = () => {
  const [formData, setFormData] = useState({
    nombreProducto: "",
    categoria: "",
    precio: "",
    stock: "",
    codigoSKU: "",
    fechaRegistro: "",
  });

  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productoData = {
      ...formData,
      imagen: imagen,
    };

    try {
      const response = await AlmacenesService.createProducto(productoData);
      console.log("Producto registrado exitosamente:", response);
      setFormData({
        nombreProducto: "",
        categoria: "",
        precio: "",
        stock: "",
        codigoSKU: "",
        fechaRegistro: "",
      });
      setImagen(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error al registrar el producto:", error);
    }
  };

  return (
    <SideBar>
      <div className="productos-container">
        <div className="productos-header">
          <h1>Registro de Nuevo Producto</h1>
        </div>

        <form onSubmit={handleSubmit} className="productos-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombreProducto">Nombre del Producto</label>
              <input
                type="text"
                id="nombreProducto"
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="codigoSKU">Código SKU</label>
              <input
                type="text"
                id="codigoSKU"
                name="codigoSKU"
                value={formData.codigoSKU}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio">Precio</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Inicial</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaRegistro">Fecha de Registro</label>
              <input
                type="date"
                id="fechaRegistro"
                name="fechaRegistro"
                value={formData.fechaRegistro}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="imagen-upload-section">
            <h3>Imagen del Producto</h3>
            <div className="imagen-upload-container">
              {previewUrl ? (
                <div className="imagen-preview">
                  <img src={previewUrl} alt="Vista previa del producto" />
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={32} />
                  <p>Por favor adjunte una foto del producto</p>
                </div>
              )}
              <input
                type="file"
                id="imagen"
                name="imagen"
                onChange={handleImagenChange}
                accept="image/*"
                className="imagen-input"
              />
              <label htmlFor="imagen" className="imagen-label">
                <Upload size={16} />
                Seleccionar Imagen
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar">
              <Save size={18} />
              Registrar Producto
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  );
};

export default RegistroProducto;
