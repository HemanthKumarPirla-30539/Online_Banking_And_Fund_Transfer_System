import api from './api';

const transactionService = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  getByAccount: async (accountId) => {
    const response = await api.get(`/transactions/account/${accountId}`);
    return response.data;
  },
};

export default transactionService;
