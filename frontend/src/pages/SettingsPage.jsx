import { useAuth } from '../context/AuthContext';

function SettingsPage() {
  const { name, email, phone, accountNumber } = useAuth();

  return (
    <div className="card p-4 shadow-sm">
      <h2>Settings</h2>
      <p className="text-muted">Manage your account information and banking preferences.</p>
      <div className="row gy-3">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={name || 'N/A'} disabled />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={email || 'N/A'} disabled />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Phone</label>
            <input className="form-control" value={phone || 'N/A'} disabled />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Account Number</label>
            <input className="form-control" value={accountNumber || 'N/A'} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
