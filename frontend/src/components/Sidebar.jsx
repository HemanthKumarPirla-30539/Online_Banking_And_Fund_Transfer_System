import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="col-lg-3 mb-4 mb-lg-0">
      <div className="card shadow-sm p-3 sticky-top" style={{ top: '1rem' }}>
        <div className="mb-4 text-center">
          <h5 className="mb-1">Quick Menu</h5>
          <p className="text-muted small mb-0">Banking actions at a glance</p>
        </div>
        <nav className="nav flex-column">
          <NavLink className={({ isActive }) => `nav-link mb-2 ${isActive ? 'active' : 'text-secondary'}`} to="/">
            Dashboard
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link mb-2 ${isActive ? 'active' : 'text-secondary'}`} to="/account-summary">
            Account Summary
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link mb-2 ${isActive ? 'active' : 'text-secondary'}`} to="/deposit">
            Deposit Money
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link mb-2 ${isActive ? 'active' : 'text-secondary'}`} to="/withdraw">
            Withdraw Money
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link mb-2 ${isActive ? 'active' : 'text-secondary'}`} to="/transfer">
            Transfer Money
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link mb-2 ${isActive ? 'active' : 'text-secondary'}`} to="/beneficiaries">
            Beneficiaries
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link mb-2 ${isActive ? 'active' : 'text-secondary'}`} to="/transactions">
            Transactions
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-secondary'}`} to="/settings">
            Settings
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
