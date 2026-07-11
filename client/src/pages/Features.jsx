import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeatures } from '../api';
import { useReveal } from '../hooks/useReveal';
import styles from './Features.module.css';

const CATEGORIES = [
  { key: 'all', label: 'All Features' },
  { key: 'training', label: 'Training' },
  { key: 'coaching', label: 'Coaching' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'community', label: 'Community' },
];

function FeatureIcon({ name }) {
  const icons = {
    zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    'bar-chart': <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    leaf: <path d="M2 22c1-1 2.5-2 4-2 3 0 3 2 6 2 2 0 4-1 5-2V4c-1 1-2.5 2-4 2-3 0-3-2-6-2-2 0-4 1-5 2z" />,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
}

function FeatureCard({ feature, index }) {
  const { ref, revealed } = useReveal(0.1);
  return (
    <article
      ref={ref}
      className={`${styles.card} ${revealed ? `animate-fadeInUp stagger-${(index % 3) + 1}` : ''} ${feature.highlight ? styles.highlight : ''}`}
    >
      {feature.highlight && <div className={styles.highlightBadge}>Featured</div>}
      <div className={styles.iconWrap}>
        <FeatureIcon name={feature.icon} />
      </div>
      <div className={styles.category}>{feature.category}</div>
      <h3 className={styles.title}>{feature.title}</h3>
      <p className={styles.desc}>{feature.description}</p>
    </article>
  );
}

export default function Features() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { ref: heroRef, revealed: heroRevealed } = useReveal(0.1);

  useEffect(() => {
    document.title = 'Features — FitFlow';
    getFeatures()
      .then((res) => setFeatures(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? features
    : features.filter((f) => f.category === activeCategory);

  return (
    <main className={styles.page}>
      {/* Page hero */}
      <section className={styles.pageHero} ref={heroRef}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBlob} />
        </div>
        <div className="container">
          <p className="eyebrow">The Platform</p>
          <h1 className={`display-2 ${heroRevealed ? 'animate-fadeInUp stagger-1' : ''}`}>
            Every tool you need<br />
            <span className={styles.accent}>to perform at your peak</span>
          </h1>
          <p className={`${styles.heroSub} ${heroRevealed ? 'animate-fadeInUp stagger-2' : ''}`}>
            FitFlow brings together adaptive training, expert coaching, deep analytics, and community — all in one platform that learns and adapts to you.
          </p>
          <div className={`${styles.heroCtas} ${heroRevealed ? 'animate-fadeInUp stagger-3' : ''}`}>
            <Link to="/register" className="btn btn--primary btn--lg" id="features-try-btn">Try Free for 14 Days</Link>
            <Link to="/pricing" className="btn btn--outline btn--lg" id="features-pricing-btn">See Plans</Link>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className={styles.filterBar}>
        <div className="container">
          <div className={styles.filters} role="tablist" aria-label="Filter features by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                role="tab"
                aria-selected={activeCategory === cat.key}
                className={`${styles.filterBtn} ${activeCategory === cat.key ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.key)}
                id={`filter-${cat.key}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <section className={`section section--dark`}>
        <div className="container">
          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${styles.card} skeleton`} style={{ height: 220 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className={styles.empty}>No features found in this category.</p>
          ) : (
            <div className={styles.grid}>
              {filtered.map((f, i) => (
                <FeatureCard key={f._id} feature={f} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison table */}
      <section className={`section section--alt ${styles.compareSection}`}>
        <div className="container">
          <p className="eyebrow">Plan Comparison</p>
          <h2 className="display-3" style={{ marginBottom: 'var(--space-10)' }}>What's included in each plan</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table} aria-label="Feature comparison by plan">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Free</th>
                  <th scope="col" className={styles.popularCol}>Pro</th>
                  <th scope="col">Elite</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Workout logging', true, true, true],
                  ['Progress charts', 'Basic', 'Full', 'Full'],
                  ['Adaptive training plans', false, true, true],
                  ['Dedicated coach', false, '1 coach', 'Unlimited'],
                  ['Nutrition tracking', false, true, true],
                  ['Recovery & HRV monitoring', false, false, true],
                  ['Video technique analysis', false, false, true],
                  ['Priority support', false, false, true],
                ].map(([feat, free, pro, elite]) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    <td>{renderCell(free)}</td>
                    <td className={styles.popularCol}>{renderCell(pro)}</td>
                    <td>{renderCell(elite)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/pricing" className="btn btn--primary btn--lg" id="features-see-pricing">See Full Pricing</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function renderCell(val) {
  if (val === true) return <span className={styles.check} aria-label="Included">✓</span>;
  if (val === false) return <span className={styles.cross} aria-label="Not included">—</span>;
  return <span className={styles.partial}>{val}</span>;
}
