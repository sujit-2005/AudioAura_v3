import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await register(form);
      navigate('/products', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to register');
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
          <span className="section-kicker">Create account</span>
          <h1>Build your future audio profile.</h1>
          <p>Join AudioAura for orders, curated product paths, and a cleaner way to shop high-end sound.</p>
        </div>
        <form className="panel-form glass-panel" onSubmit={handleSubmit}>
          <span className="section-kicker">New account</span>
          <h1>Join AudioAura</h1>
          {error && <p className="form-error">{error}</p>}
          <label>
            Name
            <input
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              type="text"
              value={form.name}
            />
          </label>
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
            Register
          </button>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </motion.section>
    </main>
  );
};

export default RegisterPage;
