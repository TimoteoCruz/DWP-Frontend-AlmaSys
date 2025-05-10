import api from "./api";

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Servicios de autenticación
const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error logging in');
    }
  },

  register: async (email, empresa, password, numeroEmpleado, rfc) => {
    try {
      const response = await api.post("/register", { email, empresa, password, numeroEmpleado, rfc });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error registering user');
    }
  },

  sendVerificationCode: async (email) => {
    try {
      const response = await api.post("/send-verification-code", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error sending verification code');
    }
  },

  verifyCode: async (email, verificationCode) => {
    try {
      const response = await api.post("/verify-code", { email, verificationCode });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error verifying code');
    }
  },

  requestResetPassword: async (email) => {
    try {
      const response = await api.post("/request-reset-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error requesting password reset');
    }
  },

  resetPassword: async (email, verificationCode, newPassword) => {
    try {
      const response = await api.post("/reset-password", { email, verificationCode, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error resetting password');
    }
  }
};

export default AuthService;
