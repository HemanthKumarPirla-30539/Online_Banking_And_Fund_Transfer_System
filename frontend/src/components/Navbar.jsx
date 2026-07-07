import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const auth = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Fund Transfer Bank
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {auth.isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/transfer">
                    Transfer
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/beneficiaries">
                    Beneficiaries
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/transactions">
                    Transactions
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/profile">
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-3" onClick={auth.logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
