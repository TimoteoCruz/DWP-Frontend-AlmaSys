import { useState, useEffect } from "react";
import SideBar from "../Layouts/Sidebar";
import { Save } from 'lucide-react';
import "../styles/nuevaEntrada.css";
import AlmacenesService from "../services/AlmacenesService";
import { useNavigate } from 'react-router-dom';


const NuevaEntrada = () => {
  const [formData, setFormData] = useState({
    producto: "",
    proveedor: "",
    unidadMedida: "",
    cantidad: "",
    almacenSalida: "",
    almacenLlegada: "",
    fechaRecepcion: "",
    estatus: "pendiente", // Valor predeterminado
    tipoMovimiento: "entrada"  // Agregado el campo "tipoMovimiento"
  });
  
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosData = await AlmacenesService.getAllProductos();
        const almacenesData = await AlmacenesService.getAllAlmacenes();
        setProductos(productosData.map(prod => ({ id: prod.id, nombre: prod.nombreProducto })));
        setAlmacenes(almacenesData.map(alm => ({ id: alm.id, nombre: alm.nombreAlmacen })));
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.almacenSalida === formData.almacenLlegada) {
      alert("El almacén de salida no puede ser el mismo que el de llegada.");
      return;
    }
  
    try {
      const movimiento = {
        productoId: formData.producto,
        almacenSalida: formData.almacenSalida,
        almacenLlegada: formData.almacenLlegada,
        cantidad: formData.cantidad,
        fechaRecepcion: formData.fechaRecepcion,
        motivo: "Traslado de inventario",
        estatus: formData.estatus,
        tipoMovimiento: formData.tipoMovimiento // Agregado tipoMovimiento
      };
  
      await AlmacenesService.registrarMovimiento(movimiento);
      alert("Movimiento registrado exitosamente");
      
      // Resetear el formulario después del envío exitoso
      setFormData({
        producto: "",
        proveedor: "",
        unidadMedida: "",
        cantidad: "",
        almacenSalida: "",
        almacenLlegada: "",
        fechaRecepcion: "",
        estatus: "pendiente",
        tipoMovimiento: "entrada" // Resetear tipoMovimiento
      });
    } catch (error) {
      console.error("Error al registrar movimiento:", error);
      alert("Error al registrar el movimiento: " + (error.message || "Error desconocido"));
    }
  };
  

  return (
    <SideBar>
      <div className="nueva-entrada-container">
        <div className="nueva-entrada-header">
          <h1>Movimiento de Producto</h1>
        </div>

        <form onSubmit={handleSubmit} className="nueva-entrada-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="producto">Producto</label>
              <select
                id="producto"
                name="producto"
                value={formData.producto}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map((prod) => (
                  <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="almacenSalida">Almacén de Salida</label>
              <select
                id="almacenSalida"
                name="almacenSalida"
                value={formData.almacenSalida}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Seleccione un almacén</option>
                {almacenes.map((alm) => (
                  <option key={alm.id} value={alm.id}>{alm.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="almacenLlegada">Almacén de Llegada</label>
              <select
                id="almacenLlegada"
                name="almacenLlegada"
                value={formData.almacenLlegada}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Seleccione un almacén</option>
                {almacenes.map((alm) => (
                  <option key={alm.id} value={alm.id}>{alm.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proveedor">Proveedor</label>
              <input type="text" id="proveedor" name="proveedor" value={formData.proveedor} onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label htmlFor="unidadMedida">Unidad de Medida</label>
              <input type="text" id="unidadMedida" name="unidadMedida" value={formData.unidadMedida} onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad</label>
              <input type="number" id="cantidad" name="cantidad" value={formData.cantidad} onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label htmlFor="fechaRecepcion">Fecha de Movimiento</label>
              <input type="date" id="fechaRecepcion" name="fechaRecepcion" value={formData.fechaRecepcion} onChange={handleChange} className="form-control" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estatus">Estatus</label>
              <select
                id="estatus"
                name="estatus"
                value={formData.estatus}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_transito">En tránsito</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar">
              <Save size={18} /> Registrar Movimiento
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  );
};

export default NuevaEntrada;