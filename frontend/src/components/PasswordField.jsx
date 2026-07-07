import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function PasswordField({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  placeholder = '',
  autoComplete = 'current-password',
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="position-relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          className="form-control pe-5"
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
          style={{ color: '#6c757d', lineHeight: 1 }}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          title={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;
