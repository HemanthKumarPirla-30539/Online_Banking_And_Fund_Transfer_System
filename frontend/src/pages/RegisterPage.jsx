import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import PasswordField from '../components/PasswordField';
import { useAuth } from '../context/AuthContext';
import { evaluatePasswordStrength } from '../utils/passwordValidation';

function RegisterPage() {
  const auth = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordValidation = useMemo(() => evaluatePasswordStrength(password), [password]);
  const passwordsMatch = password === confirmPassword;
  const isFormValid = Boolean(
    name &&
      email &&
      phone &&
      passwordValidation.strength === 'strong' &&
      passwordsMatch &&
      password &&
      confirmPassword
  );

  const onSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await auth.register({ name, email, password, phone });
      toast.success('Registered successfully');
    } catch (error) {
      toast.error(error?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h2 className="card-title mb-4">Register</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                id="register-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <div className="mb-3">
                <div className={`fw-semibold text-${passwordValidation.strength === 'strong' ? 'success' : passwordValidation.strength === 'medium' ? 'warning' : 'danger'}`}>
                  Strength: {passwordValidation.strength === 'strong' ? 'Strong' : passwordValidation.strength === 'medium' ? 'Medium' : 'Weak'}
                </div>
                <ul className="list-unstyled small mt-2 mb-0">
                  {[
                    { label: 'Minimum 8 characters', ok: passwordValidation.checks.minimumLength },
                    { label: 'Maximum 20 characters', ok: passwordValidation.checks.maximumLength },
                    { label: 'One uppercase letter', ok: passwordValidation.checks.uppercase },
                    { label: 'One lowercase letter', ok: passwordValidation.checks.lowercase },
                    { label: 'One number', ok: passwordValidation.checks.number },
                    { label: 'One special character', ok: passwordValidation.checks.special },
                  ].map((item) => (
                    <li key={item.label} className={item.ok ? 'text-success' : 'text-danger'}>
                      <span className="me-2">{item.ok ? '✓' : '✗'}</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
              <PasswordField
                label="Confirm Password"
                id="register-confirm-password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              {!passwordsMatch && confirmPassword && (
                <div className="text-danger small mb-3">Passwords do not match.</div>
              )}
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading || !isFormValid}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
