import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Main navigation">
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo} aria-label="FitFlow home">
            <span className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="12" height="28" rx="2" fill="#FF4D1C" />
                <rect x="16" y="8" width="12" height="20" rx="2" fill="#B6FF4A" />
              </svg>
            </span>
            <span className={styles.logoText}>FitFlow</span>
          </Link>

          {/* Desktop nav links */}
          <ul className={styles.links} role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Auth actions */}
          <div className={styles.actions}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn--outline btn--sm">Dashboard</Link>
                <button className="btn btn--ghost btn--sm" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm">Log in</Link>
                <Link to="/register" className="btn btn--primary btn--sm">Start Free</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!mobileOpen}
        id="mobile-menu"
      >
        <ul className={styles.drawerLinks} role="list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.drawerActions}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn--primary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button className="btn btn--outline" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn--primary" onClick={() => setMobileOpen(false)}>Start Free Trial</Link>
              <Link to="/login" className="btn btn--outline" onClick={() => setMobileOpen(false)}>Log in</Link>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
