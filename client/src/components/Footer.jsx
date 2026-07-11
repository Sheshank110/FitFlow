import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const LINKS = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Blog', to: '/blog' },
  ],
  Company: [
    { label: 'About', to: '/#about' },
    { label: 'Contact', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`${styles.inner} container`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="FitFlow home">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="12" height="28" rx="2" fill="#FF4D1C" />
              <rect x="16" y="8" width="12" height="20" rx="2" fill="#B6FF4A" />
            </svg>
            <span>FitFlow</span>
          </Link>
          <p className={styles.tagline}>
            Train smarter. Live stronger.<br />Built for athletes who mean it.
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>{group}</h3>
              <ul role="list">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className={styles.link}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.copy}>
            © {new Date().getFullYear()} FitFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
