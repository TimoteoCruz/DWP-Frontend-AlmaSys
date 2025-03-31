import api from "./api";

const getAuthToken = () => {
  return localStorage.getItem("token"); 
};

const ProgramadasService = {
  createProgramada: async (programadaData) => {
    try {
      const token = getAuthToken();
      const response = await api.post('/programadas/nueva', programadaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error al crear entrada programada');
    }
  },

  getAllProgramadas: async (filters = {}) => {
    try {
      const token = getAuthToken();
      const response = await api.get('/programadas', {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.programadas || [];
    } catch (error) {
      throw error.response?.data || new Error('Error al obtener entradas programadas');
    }
  },

  getProgramadaById: async (id) => {
    try {
      const token = getAuthToken();
      const response = await api.get(`/programadas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error al obtener entrada programada');
    }
  },

  updateProgramada: async (id, programadaData) => {
    try {
      const token = getAuthToken();
      const response = await api.put(`/programadas/${id}`, programadaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error al actualizar entrada programada');
    }
  },

  deleteProgramada: async (id) => {
    try {
      const token = getAuthToken();
      const response = await api.delete(`/programadas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error al eliminar entrada programada');
    }
  },
};

export default ProgramadasService;