"use client"

import { useState, useEffect } from "react"
import SideBar from "../Layouts/Sidebar"
import { Save } from "lucide-react"
import "../styles/nuevaEntrada.css"
import AlmacenesService from "../services/AlmacenesService"

const NuevaSalida = () => {
  const [formData, setFormData] = useState({
    producto: "",
    almacenSalida: "",
    almacenLlegada: "",
    cantidad: "",
    fechaSalida: "",
    motivo: "",
    estatus: "pendiente",
    tipoMovimiento: "salida",
  })

  const [productos, setProductos] = useState([])
  const [almacenes, setAlmacenes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosData = await AlmacenesService.getAllProductos();
        const almacenesData = await AlmacenesService.getAllAlmacenes();
  
        // Agrupar productos por nombre y sumar sus stocks
        const productosUnicos = {};
        productosData.forEach((prod) => {
          if (!productosUnicos[prod.nombreProducto]) {
            productosUnicos[prod.nombreProducto] = {
              id: prod.id, // Puedes guardar un ID cualquiera
              nombre: prod.nombreProducto,
              stockTotal: prod.stock,
            };
          } else {
            productosUnicos[prod.nombreProducto].stockTotal += prod.stock;
          }
        });
  
        setProductos(Object.values(productosUnicos)); // Convertir en array
        setAlmacenes(almacenesData.map((alm) => ({ id: alm.id, nombre: alm.nombreAlmacen })));
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.almacenSalida === formData.almacenLlegada) {
      alert("El almacén de salida no puede ser el mismo que el de llegada.")
      return
    }

    try {
      const movimiento = {
        productoId: formData.producto,
        almacenSalida: formData.almacenSalida,
        almacenLlegada: formData.almacenLlegada,
        cantidad: formData.cantidad,
        fechaRecepcion: formData.fechaSalida,
        motivo: formData.motivo || "Salida de producto",
        estatus: formData.estatus,
        tipoMovimiento: formData.tipoMovimiento,
      }

      await AlmacenesService.registrarMovimiento(movimiento)
      alert("Salida registrada exitosamente")

      setFormData({
        producto: "",
        almacenSalida: "",
        almacenLlegada: "",
        cantidad: "",
        fechaSalida: "",
        motivo: "",
        estatus: "pendiente",
        tipoMovimiento: "salida",
      })
    } catch (error) {
      console.error("Error al registrar salida:", error)
      alert("Error al registrar la salida: " + (error.message || "Error desconocido"))
    }
  }

  return (
    <SideBar>
      <div className="nueva-entrada-container">
        <div className="nueva-entrada-header">
          <h1>Salida de Producto</h1>
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
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre}
                  </option>
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
                  <option key={alm.id} value={alm.id}>
                    {alm.nombre}
                  </option>
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
                  <option key={alm.id} value={alm.id}>
                    {alm.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaSalida">Fecha de Salida</label>
              <input
                type="date"
                id="fechaSalida"
                name="fechaSalida"
                value={formData.fechaSalida}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="motivo">Motivo</label>
              <input
                type="text"
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                className="form-control"
                placeholder="Motivo de la salida"
              />
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
              <Save size={18} /> Registrar Salida
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  )
}

export default NuevaSalida

