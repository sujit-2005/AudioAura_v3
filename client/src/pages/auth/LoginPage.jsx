import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const from = location.state?.from || '/products';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in');
    }
  };

  return (
    <main className="auth-page page-shell">
      <motion.section
        className="auth-split"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="auth-visual">
          <div className="auth-orbit" />
          <span className="section-kicker">AudioAura ID</span>
          <h1>Return to your private listening room.</h1>
          <p>Orders, saved sessions, and premium audio pathways live behind one quiet sign-in.</p>
        </div>
        <form className="panel-form glass-panel" onSubmit={handleSubmit}>
          <span className="section-kicker">Welcome back</span>
          <h1>Log in</h1>
          {error && <p className="form-error">{error}</p>}
          <label>
            Email
            <input
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
            Password
            <input
              minLength="8"
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              required
              type="password"
              value={form.password}
            />
          </label>
          <button className="primary-button wide-button" type="submit">
            Log in
          </button>
          <p>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </motion.section>
    </main>
  );
};

export default LoginPage;
