import api from './api';

const transferService = {
  transfer: async (payload) => {
    const response = await api.post('/transfer', payload);
    return response.data;
  },
};

export default transferService;
