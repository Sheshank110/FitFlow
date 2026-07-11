import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import styles from './Auth.module.css';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Log In — FitFlow';
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      addToast({ message: `Welcome back, ${res.data.user.name.split(' ')[0]}!`, type: 'success' });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      addToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="12" height="28" rx="2" fill="#FF4D1C" />
              <rect x="16" y="8" width="12" height="20" rx="2" fill="#B6FF4A" />
            </svg>
            FitFlow
          </Link>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Log in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate aria-label="Login form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="form-error" id="login-email-error" role="alert">{errors.email}</p>}
          </div>

          <div className="form-group">
            <div className={styles.labelRow}>
              <label className="form-label" htmlFor="login-password">Password</label>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="form-error" id="login-password-error" role="alert">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className={`btn btn--primary btn--lg ${styles.submitBtn} ${submitting ? 'btn--loading' : ''}`}
            disabled={submitting}
            id="login-submit-btn"
          >
            {submitting ? <><span className="spinner" />Logging in...</> : 'Log In'}
          </button>
        </form>

        <p className={styles.switchLink}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link} id="login-to-register">Start free</Link>
        </p>

        <p className={styles.demoHint}>
          Demo: <code>demo@fitflow.com</code> / <code>FitFlow2024!</code>
        </p>
      </div>
    </main>
  );
}
