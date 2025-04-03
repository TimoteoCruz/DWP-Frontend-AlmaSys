import api from "./api";

const getAuthToken = () => {
  return localStorage.getItem("token"); 
};

const AlmacenesService = {
  createAlmacen: async (almacenData) => {
    try {
      const token = getAuthToken();
      const response = await api.post('/almacenes/nuevo', almacenData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error creating warehouse');
    }
  },

  getAllAlmacenes: async (filters = {}) => {
    try {
      const token = getAuthToken();
      const response = await api.get('/almacenes', {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.almacenes || [];
    } catch (error) {
      throw error.response?.data || new Error('Error fetching warehouses');
    }
  },

  getAlmacenById: async (id) => {
    try {
      const token = getAuthToken();
      const response = await api.get(`/almacenes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error fetching warehouse');
    }
  },

  updateAlmacen: async (id, almacenData) => {
    try {
      const token = getAuthToken();
      const response = await api.put(`/almacenes/${id}`, almacenData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error updating warehouse');
    }
  },

  deleteAlmacen: async (id) => {
    try {
      const token = getAuthToken();
      const response = await api.delete(`/almacenes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error disabling warehouse');
    }
  },

  createProducto: async (productoData) => {
    try {
      const token = getAuthToken();
      const response = await api.post('/productos/nuevo', productoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;  
    } catch (error) {
      throw error.response?.data || new Error('Error creando producto');
    }
  },

  getAllProductos: async (filters = {}) => {
    try {
      const token = getAuthToken();
      const response = await api.get('/productos', {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.productos || [];
    } catch (error) {
      throw error.response?.data || new Error('Error fetching products');
    }
  },

  getProductoById: async (id) => {
    try {
      const token = getAuthToken();
      const response = await api.get(`/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error obteniendo el producto');
    }
  },

  updateProducto: async (id, productoData) => {
    try {
      const token = getAuthToken();
      const response = await api.put(`/productos/${id}`, productoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error actualizando el producto');
    }
  },

  deleteProducto: async (id) => {
    try {
      const token = getAuthToken();
      const response = await api.delete(`/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error eliminando el producto');
    }
  },

  registrarMovimiento: async (movimientoData) => {
    try {
      const token = getAuthToken();
      const response = await api.post('/movimientos/nuevo', movimientoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error registrando movimiento');
    }
  },

  getMovimientos: async () => {
    try {
      const token = getAuthToken();
      const response = await api.get("/movimientos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Return the whole data object so it includes the movimientos property
      if (response.data) {
        return response.data;
      } else {
        throw new Error("No se encontraron datos");
      }
    } catch (error) {
      // Manejo de errores, puede ser por falta de autorización o problemas con la petición
      throw error.response?.data || new Error("Error obteniendo movimientos");
    }
  },

  updateMovimientoEstatus: async (movimientoId, nuevoEstatus) => {
    try {
      const token = getAuthToken(); // Obtener el token de autenticación
      console.log(`Actualizando estatus para movimiento: ${movimientoId} a: ${nuevoEstatus}`);
      
      const response = await api.put(
        `/movimientos/${movimientoId}/estatus`,
        { estatus: nuevoEstatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log('Respuesta de actualización:', response.data);
      
      if (response.data) {
        return response.data;
      } else {
        throw new Error("No se pudo actualizar el estatus");
      }
    } catch (error) {
      console.error("Error en updateMovimientoEstatus:", error);
      throw error.response?.data || error;
    }
  },

  getMovimientoStatus: async (movimientoId) => {
    try {
      const token = getAuthToken();
      console.log(`Consultando status para movimiento: ${movimientoId}`);
      
      const response = await api.get(`/movimientos/${movimientoId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Datos de status recibidos:', response.data);
      
      if (response.data) {
        return response.data;
      } else {
        throw new Error("No se encontraron datos");
      }
    } catch (error) {
      console.error("Error obteniendo estatus:", error);
      throw error.response?.data || error;
    }
  },

  // Método específico para long polling de estatus
  longPollMovimientoStatus: async (movimientoId, lastKnownStatus) => {
    try {
      const token = getAuthToken();
      console.log(`Iniciando long polling para movimiento: ${movimientoId}, último estatus conocido: ${lastKnownStatus}`);
      
      // Como el endpoint de poll puede no existir en el backend, usamos el endpoint normal
      // pero simulamos el comportamiento de long polling con un intervalo corto
      const response = await api.get(`/movimientos/${movimientoId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Timeout corto para simular long polling
        timeout: 5000, 
      });
      
      console.log('Datos de long polling recibidos:', response.data);
      
      if (response.data) {
        // Verificar si el estatus ha cambiado
        if (response.data.estatus && response.data.estatus !== lastKnownStatus) {
          console.log(`Estatus cambiado: ${lastKnownStatus} -> ${response.data.estatus}`);
          return response.data;
        } else {
          console.log('No hay cambios en el estatus');
          return { estatus: lastKnownStatus, noChange: true };
        }
      } else {
        throw new Error("No se encontraron datos en long polling");
      }
    } catch (error) {
      // Si es un timeout, no es realmente un error en este contexto
      if (error.code === 'ECONNABORTED') {
        console.log('Long polling timeout, reiniciando...');
        return { estatus: lastKnownStatus, noChange: true };
      }
      
      console.error("Error en long polling:", error);
      throw error.response?.data || error;
    }
  }
};

export default AlmacenesService;
