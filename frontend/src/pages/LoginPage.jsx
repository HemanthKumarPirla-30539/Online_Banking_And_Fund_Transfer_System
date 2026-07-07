import { useState } from 'react';
import { toast } from 'react-toastify';
import PasswordField from '../components/PasswordField';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await auth.login({ email, password });
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h2 className="card-title mb-4">Login</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <PasswordField
                label="Password"
                id="login-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
