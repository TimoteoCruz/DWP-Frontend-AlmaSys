"use client";

import { useState, useEffect } from "react";
import SideBar from "../Layouts/Sidebar";
import { Save } from "lucide-react";
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
    almacenID: "", // Campo para almacenar el ID del almacén seleccionado
  });
  
  const [almacenes, setAlmacenes] = useState([]); // Estado para almacenar la lista de almacenes
  const [loading, setLoading] = useState(false); // Estado para controlar la carga de datos
  const [error, setError] = useState(null); // Estado para manejar errores

  // Cargar la lista de almacenes cuando el componente se monta
  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        setLoading(true);
        setError(null);
        const almacenesData = await AlmacenesService.getAllAlmacenes();
        setAlmacenes(almacenesData);
      } catch (error) {
        console.error("Error al cargar almacenes:", error);
        setError("No se pudieron cargar los almacenes. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlmacenes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AlmacenesService.createProducto(formData);
      console.log("Producto registrado exitosamente:", response);
      
      // Limpiar el formulario después de un registro exitoso
      setFormData({
        nombreProducto: "",
        categoria: "",
        precio: "",
        stock: "",
        codigoSKU: "",
        fechaRegistro: "",
        almacenID: "",
      });
      
      // Aquí podrías mostrar una notificación de éxito
      alert("Producto registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar el producto:", error);
      // Aquí podrías mostrar una notificación de error
      alert(`Error al registrar el producto: ${error.message}`);
    }
  };

  return (
    <SideBar>
      <div className="productos-container">
        <div className="productos-header">
          <h1>Registro de Nuevo Producto</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="almacenID">Almacén</label>
              <select
                id="almacenID"
                name="almacenID"
                value={formData.almacenID}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Seleccione un almacén</option>
                {loading ? (
                  <option disabled>Cargando almacenes...</option>
                ) : (
                  almacenes.map((almacen) => (
                    <option key={almacen.id} value={almacen.id}>
                      {almacen.nombreAlmacen} - {almacen.codigo}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar" disabled={loading}>
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