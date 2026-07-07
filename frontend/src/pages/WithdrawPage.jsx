import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import LoadingSpinner from '../components/LoadingSpinner';

function WithdrawPage() {
  const { accountId, accountNumber } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await accountService.withdraw({ accountId, amount: Number(amount) });
      setResult(response);
      toast.success('Withdrawal completed successfully');
      setAmount('');
    } catch (error) {
      toast.error(error?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  if (!accountId) {
    return <LoadingSpinner />;
  }

  return (
    <div className="row gy-4">
      <div className="col-lg-6">
        <div className="card p-4 shadow-sm">
          <h2>Withdraw Money</h2>
          <p className="text-muted">Account Number: {accountNumber}</p>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
            </div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
          </form>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card p-4 shadow-sm">
          <h4>Latest Withdrawal</h4>
          {result ? (
            <div>
              <p className="mb-2">Updated Balance</p>
              <p className="fs-4 fw-bold">₹ {Number(result.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          ) : (
            <p className="text-muted">Withdraw funds to see the updated balance here.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
