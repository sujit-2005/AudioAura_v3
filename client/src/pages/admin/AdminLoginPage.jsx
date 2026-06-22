import { motion } from 'framer-motion';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const { adminLogin, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) {
    return <Navigate to="/adm/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await adminLogin(form);
      navigate(location.state?.from?.pathname || '/adm/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in as admin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.main
      className="admin-login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <span className="section-kicker">Hidden Admin Portal</span>
        <h1>AudioAura admin</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          Email
          <input
            autoComplete="email"
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
            type="email"
            value={form.email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
            type="password"
            value={form.password}
          />
        </label>
        <button className="primary-button wide-button" disabled={submitting} type="submit">
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </motion.main>
  );
};

export default AdminLoginPage;
