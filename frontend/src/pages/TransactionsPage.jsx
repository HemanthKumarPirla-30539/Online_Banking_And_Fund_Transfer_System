import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import transactionService from '../services/transactionService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

function TransactionsPage() {
  const { accountId } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    if (!accountId) {
      return;
    }

    try {
      const data = await transactionService.getByAccount(accountId);
      setTransactions(data || []);
    } catch (error) {
      toast.error(error?.message || 'Unable to load transactions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [accountId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="card p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Transaction History</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.senderAccount}</td>
                  <td>{tx.receiverAccount}</td>
                  <td>{`₹ ${tx.amount}`}</td>
                  <td>{tx.status}</td>
                  <td>{tx.remarks || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsPage;
