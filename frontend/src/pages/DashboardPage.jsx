import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import beneficiaryService from '../services/beneficiaryService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

function DashboardPage() {
  const navigate = useNavigate();
  const { accountId } = useAuth();
  const [balance, setBalance] = useState(0);
  const [dailyTransferred, setDailyTransferred] = useState(0);
  const [dailyRemaining, setDailyRemaining] = useState(50000);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) {
      return;
    }

    const loadDashboard = async () => {
      try {
        const [balanceData, beneficiaryData, transactionData] = await Promise.all([
          accountService.getBalance(accountId),
          beneficiaryService.getAll(accountId),
          transactionService.getByAccount(accountId),
        ]);

        const allTransactions = transactionData || [];
        const today = new Date().toISOString().split('T')[0];
        const transferredToday = allTransactions
          .filter((tx) => tx.status === 'SUCCESS')
          .filter((tx) => new Date(tx.date).toISOString().split('T')[0] === today)
          .reduce((total, tx) => total + Number(tx.amount || 0), 0);

        setBalance(Number(balanceData.balance || 0));
        setBeneficiaries(beneficiaryData || []);
        setTransactions(allTransactions.slice(0, 5));
        setDailyTransferred(transferredToday);
        setDailyRemaining(Math.max(0, 50000 - transferredToday));
      } catch (error) {
        toast.error(error?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [accountId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="row gy-4 mb-4">
        <div className="col-md-3">
          <div className="card p-4 bg-white rounded-4 shadow-sm">
            <h5 className="text-muted">Current Balance</h5>
            <p className="fs-3 fw-bold">₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 bg-primary-soft rounded-4 shadow-sm">
            <h5 className="text-muted">Today's Transfer</h5>
            <p className="fs-3 fw-bold text-primary">₹ {dailyTransferred.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 bg-white rounded-4 shadow-sm">
            <h5 className="text-muted">Remaining Daily Limit</h5>
            <p className="fs-3 fw-bold">₹ {dailyRemaining.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 bg-white rounded-4 shadow-sm">
            <h5 className="text-muted">Total Beneficiaries</h5>
            <p className="fs-3 fw-bold">{beneficiaries.length}</p>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="mb-1">Quick Actions</h4>
            <p className="text-muted mb-0">Jump directly to core banking operations.</p>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-sm-6 col-lg-4">
            <button className="btn btn-outline-primary w-100 py-3 rounded-4" onClick={() => navigate('/deposit')}>
              Deposit
            </button>
          </div>
          <div className="col-sm-6 col-lg-4">
            <button className="btn btn-outline-success w-100 py-3 rounded-4" onClick={() => navigate('/withdraw')}>
              Withdraw
            </button>
          </div>
          <div className="col-sm-6 col-lg-4">
            <button className="btn btn-outline-info w-100 py-3 rounded-4" onClick={() => navigate('/transfer')}>
              Transfer
            </button>
          </div>
          <div className="col-sm-6 col-lg-4">
            <button className="btn btn-outline-warning w-100 py-3 rounded-4" onClick={() => navigate('/beneficiaries')}>
              Beneficiaries
            </button>
          </div>
          <div className="col-sm-6 col-lg-4">
            <button className="btn btn-outline-secondary w-100 py-3 rounded-4" onClick={() => navigate('/transactions')}>
              Transactions
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Recent Transactions</h4>
          <button className="btn btn-outline-primary" onClick={() => navigate('/transactions')}>
            View All
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-borderless align-middle">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleString()}</td>
                  <td>{tx.remarks || `${tx.senderAccount} → ${tx.receiverAccount}`}</td>
                  <td>₹ {Number(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
