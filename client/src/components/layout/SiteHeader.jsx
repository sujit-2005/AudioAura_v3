import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const HeadphonesIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 14a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2v-3Z" />
    <path d="M20 14a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2v-3Z" />
  </svg>
);

const BagIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 8h12l1 12H5L6 8Z" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
  </svg>
);

const SiteHeader = () => {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);

    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });

    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const renderAccountAction = () =>
    isAuthenticated ? (
      <button className="nav-button" onClick={logout} type="button">
        Logout
      </button>
    ) : (
      <NavLink to="/login" onClick={closeMenu}>
        Login
      </NavLink>
    );

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link className="brand-mark" to="/" aria-label="AudioAura home">
          <span className="brand-mark__icon">
            <HeadphonesIcon />
          </span>
          <span>AudioAura</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          {renderAccountAction()}
        </nav>

        <div className="site-actions">
          <Link className="icon-button profile-button" to={isAuthenticated ? '/orders' : '/login'} aria-label="Account">
            <UserIcon />
          </Link>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
            <Link className="icon-button cart-button" to="/cart" aria-label="Shopping bag">
              <BagIcon />
              <span className="bag-count">{itemCount}</span>
            </Link>
          </motion.div>
          <button
            className="icon-button menu-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <NavLink to="/products" onClick={closeMenu}>
              Shop
            </NavLink>
            <NavLink to="/orders" onClick={closeMenu}>
              Orders
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" onClick={closeMenu}>
                Admin
              </NavLink>
            )}
            {renderAccountAction()}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;
