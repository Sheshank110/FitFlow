import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 — Page Not Found | FitFlow';
  }, []);

  return (
    <main className={styles.page} aria-labelledby="notfound-heading">
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.blob} />
      </div>

      <div className={styles.content}>
        <div className={styles.number} aria-hidden="true">404</div>
        <h1 className={styles.title} id="notfound-heading">
          Page not found
        </h1>
        <p className={styles.sub}>
          This page took a rest day. Let's get you back to training.
        </p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn--primary btn--lg" id="notfound-home-btn">
            Back to Home
          </Link>
          <button
            className="btn btn--outline btn--lg"
            onClick={() => navigate(-1)}
            id="notfound-back-btn"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
