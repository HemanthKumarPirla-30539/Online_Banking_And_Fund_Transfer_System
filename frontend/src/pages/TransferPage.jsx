import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import beneficiaryService from '../services/beneficiaryService';
import transferService from '../services/transferService';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import LoadingSpinner from '../components/LoadingSpinner';

function TransferPage() {
  const auth = useAuth();
  const [senderAccount, setSenderAccount] = useState(auth.accountNumber || '');
  const [receiverAccount, setReceiverAccount] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [balance, setBalance] = useState(0);
  const [dailyTransferred, setDailyTransferred] = useState(0);
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (auth.accountNumber) {
      setSenderAccount(auth.accountNumber);
    }
  }, [auth.accountNumber]);

  useEffect(() => {
    const loadBeneficiaries = async () => {
      if (!auth.accountId) {
        setPageLoading(false);
        return;
      }

      try {
        const [data, balanceData, txData] = await Promise.all([
          beneficiaryService.getAll(auth.accountId),
          accountService.getBalance(auth.accountId),
          transactionService.getByAccount(auth.accountId),
        ]);

        setBeneficiaries(data || []);
        setBalance(Number(balanceData.balance || 0));

        const today = new Date().toISOString().split('T')[0];
        const transferredToday = (txData || [])
          .filter((tx) => tx.status === 'SUCCESS')
          .filter((tx) => new Date(tx.date).toISOString().split('T')[0] === today)
          .reduce((total, tx) => total + Number(tx.amount || 0), 0);

        setDailyTransferred(transferredToday);
      } catch (error) {
        toast.error(error?.message || 'Unable to load beneficiaries');
      } finally {
        setPageLoading(false);
      }
    };

    loadBeneficiaries();
  }, [auth.accountId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await transferService.transfer({
        senderAccount,
        receiverAccount,
        amount: Number(amount),
        remarks,
      });
      toast.success('Transfer completed successfully');
      setReceiverAccount('');
      setAmount('');
      setRemarks('');
    } catch (error) {
      toast.error(error?.message || 'Transfer failed');
    }
    setLoading(false);
  };

  if (pageLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="row gy-4">
      <div className="col-lg-4">
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3">Transfer Summary</h4>
          <p className="mb-1">Current Balance</p>
          <h3 className="fw-bold">{auth.accountNumber ? `Account ${auth.accountNumber}` : 'Loading...'}</h3>
          <p className="mb-1">Remaining Daily Limit</p>
          <h5 className="text-primary">₹ 50,000</h5>
          <div className="mt-4 p-3 bg-primary-soft rounded-4">
            <p className="mb-1">Current Balance</p>
            <h3 className="fw-bold">₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="mb-1 mt-3">Remaining Daily Limit</p>
            <h5 className="text-primary">₹ {Math.max(0, 50000 - dailyTransferred).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card p-4 shadow-sm">
          <h4 className="mb-4">Transfer Money</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Sender Account</label>
              <input
                type="text"
                className="form-control"
                value={senderAccount}
                onChange={(e) => setSenderAccount(e.target.value)}
                required
                disabled={Boolean(auth.accountNumber)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Receiver Account</label>
              <select className="form-select" value={receiverAccount} onChange={(e) => setReceiverAccount(e.target.value)} required>
                <option value="">Select beneficiary</option>
                {beneficiaries.map((beneficiary) => (
                  <option key={beneficiary.id} value={beneficiary.beneficiaryAccountNumber}>
                    {beneficiary.beneficiaryName} - {beneficiary.beneficiaryAccountNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Remarks</label>
              <textarea
                className="form-control"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" disabled={loading || beneficiaries.length === 0}>
              {loading ? 'Sending...' : 'Send Transfer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TransferPage;
