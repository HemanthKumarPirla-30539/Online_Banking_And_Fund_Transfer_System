import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export default authService;
