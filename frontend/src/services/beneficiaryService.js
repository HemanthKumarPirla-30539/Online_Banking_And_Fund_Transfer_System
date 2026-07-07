import api from './api';

const beneficiaryService = {
  getAll: async (accountId) => {
    const response = await api.get('/beneficiaries', { params: { accountId } });
    return response.data;
  },
  add: async (payload) => {
    const response = await api.post('/beneficiaries', payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/beneficiaries/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/beneficiaries/${id}`);
    return response.data;
  },
};

export default beneficiaryService;
