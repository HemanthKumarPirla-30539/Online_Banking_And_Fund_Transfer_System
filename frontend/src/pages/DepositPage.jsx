import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import LoadingSpinner from '../components/LoadingSpinner';

function DepositPage() {
  const { accountId, accountNumber } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await accountService.deposit({ accountId, amount: Number(amount) });
      setResult(response);
      toast.success('Deposit completed successfully');
      setAmount('');
    } catch (error) {
      toast.error(error?.message || 'Deposit failed');
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
          <h2>Deposit Money</h2>
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
              {loading ? 'Processing...' : 'Deposit'}
            </button>
          </form>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card p-4 shadow-sm">
          <h4>Latest Deposit</h4>
          {result ? (
            <div>
              <p className="mb-2">Updated Balance</p>
              <p className="fs-4 fw-bold">₹ {Number(result.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          ) : (
            <p className="text-muted">Make a deposit to see the updated balance here.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DepositPage;
