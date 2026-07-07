import api from './api';

const accountService = {
  getBalance: async (accountId) => {
    const response = await api.get(`/account/${accountId}/balance`);
    return response.data;
  },
  deposit: async (payload) => {
    const response = await api.post('/account/deposit', payload);
    return response.data;
  },
  withdraw: async (payload) => {
    const response = await api.post('/account/withdraw', payload);
    return response.data;
  },
};

export default accountService;
