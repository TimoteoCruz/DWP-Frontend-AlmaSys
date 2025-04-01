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

// En AlmacenesService.js
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

async updateMovimientoEstatus(movimientoId, nuevoEstatus) {
  try {
    const token = getAuthToken(); // Obtener el token de autenticación
    const response = await api.put(
      `/movimientos/${movimientoId}/estatus`, // URL del endpoint
      { estatus: nuevoEstatus }, // Cuerpo de la solicitud
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pasar el token en el header
          "Content-Type": "application/json", // Especificar el tipo de contenido
        },
      }
    );

    // Si la respuesta es exitosa, retornar los datos
    if (response.data) {
      return response.data;
    } else {
      throw new Error("No se pudo actualizar el estatus");
    }
  } catch (error) {
    // Manejo de errores, puede ser por falta de autorización o problemas con la petición
    console.error("Error en updateMovimientoEstatus:", error);
    throw error.response?.data || new Error("Error al actualizar el estatus del movimiento");
  }
},

// Método para obtener el estatus de un movimiento específico
getMovimientoStatus: async (movimientoId) => {
  try {
    const token = getAuthToken();
    const response = await api.get(`/movimientos/${movimientoId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error("No se encontraron datos");
    }
  } catch (error) {
    throw error.response?.data || new Error("Error obteniendo estatus del movimiento");
  }
}

};

export default AlmacenesService;
