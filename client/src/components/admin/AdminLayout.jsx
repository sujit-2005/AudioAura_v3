import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const navItems = [
  ['Dashboard', '/adm/dashboard'],
  ['Products', '/adm/products'],
  ['Inventory', '/adm/inventory'],
  ['Orders', '/adm/orders'],
  ['Customers', '/adm/customers'],
  ['Reviews', '/adm/reviews'],
  ['Coupons', '/adm/coupons'],
  ['Reports', '/adm/reports'],
  ['Settings', '/adm/settings'],
];

const AdminLayout = ({ children, title, kicker = 'Admin Console' }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/adm/login', { replace: true });
  };

  return (
    <main className="admin-console">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-mark__icon">AA</span>
          <div>
            <strong>AudioAura</strong>
            <span>Commerce Admin</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(([label, to]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <span>{user?.email}</span>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="section-kicker">{kicker}</span>
            <h1>{title}</h1>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  kicker: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default AdminLayout;
