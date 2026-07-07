import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

function AccountSummaryPage() {
  const { accountId, accountNumber } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    const loadSummary = async () => {
      try {
        const [balanceData, txData] = await Promise.all([
          accountService.getBalance(accountId),
          transactionService.getByAccount(accountId),
        ]);
        setBalance(Number(balanceData.balance || 0));
        setTransactions(txData || []);
      } catch (error) {
        toast.error(error?.message || 'Unable to load account summary');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [accountId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="row gy-4 mb-4">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4>Account Overview</h4>
            <p className="mb-2 text-muted">Account Number</p>
            <p className="fs-5 fw-bold">{accountNumber}</p>
            <p className="mb-2 text-muted">Available Balance</p>
            <p className="fs-3 fw-bold">₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4>Quick Actions</h4>
            <p className="mb-3">Use the sidebar to access deposits, withdrawals, transfers, and beneficiary management.</p>
            <div className="list-group">
              <span className="list-group-item">Deposit money instantly</span>
              <span className="list-group-item">Withdraw funds securely</span>
              <span className="list-group-item">Monitor transaction history</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <h4 className="mb-4">Recent Activity</h4>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No recent transactions.
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleString()}</td>
                    <td>{tx.senderAccount}</td>
                    <td>{tx.receiverAccount}</td>
                    <td>₹ {Number(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{tx.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AccountSummaryPage;
