import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import styles from './Auth.module.css';

export default function Register() {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Start Free — FitFlow';
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Valid email required';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
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
      const res = await registerUser(form);
      login(res.data.user, res.data.token);
      addToast({ message: `Account created! Welcome to FitFlow, ${res.data.user.name.split(' ')[0]}!`, type: 'success' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
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
          <div className={styles.badge}>14-day free trial</div>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>No credit card required. Cancel anytime.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate aria-label="Registration form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              placeholder="Marcus Rivera"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              aria-describedby={errors.name ? 'reg-name-error' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="form-error" id="reg-name-error" role="alert">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-describedby={errors.email ? 'reg-email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="form-error" id="reg-email-error" role="alert">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              aria-describedby={errors.password ? 'reg-password-error' : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="form-error" id="reg-password-error" role="alert">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className={`btn btn--primary btn--lg ${styles.submitBtn} ${submitting ? 'btn--loading' : ''}`}
            disabled={submitting}
            id="register-submit-btn"
          >
            {submitting ? <><span className="spinner" />Creating account...</> : 'Create Free Account'}
          </button>

          <p className={styles.terms}>
            By creating an account, you agree to our{' '}
            <Link to="#" className={styles.link}>Terms</Link> and{' '}
            <Link to="#" className={styles.link}>Privacy Policy</Link>.
          </p>
        </form>

        <p className={styles.switchLink}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link} id="register-to-login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
