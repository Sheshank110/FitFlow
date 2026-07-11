import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContent, getFeatures } from '../api';
import { useReveal } from '../hooks/useReveal';
import styles from './Home.module.css';

/* ---- Hero Section ---- */
function Hero({ data }) {
  if (!data) return null;
  const lines = data.headline.split('\n');

  return (
    <section className={styles.hero} aria-label="Hero section">
      {/* Animated mesh background */}
      <div className={styles.mesh} aria-hidden="true">
        <div className={styles.meshBlob1} />
        <div className={styles.meshBlob2} />
        <div className={styles.meshBlob3} />
        <div className={styles.meshGrid} />
      </div>

      <div className={`${styles.heroContent} container`}>
        <div className={`${styles.eyebrow} animate-fadeInUp stagger-1`}>
          <span className={styles.eyebrowDot} />
          Performance Platform
        </div>

        <h1 className={`${styles.heroHeadline} animate-fadeInUp stagger-2`}>
          {lines.map((line, i) => (
            <span key={i} className={i === 1 ? styles.headlineAccent : ''}>{line}</span>
          ))}
        </h1>

        <p className={`${styles.heroSub} animate-fadeInUp stagger-3`}>
          {data.subheadline}
        </p>

        <div className={`${styles.heroCtas} animate-fadeInUp stagger-4`}>
          <Link to={data.ctaPrimary.href} className="btn btn--primary btn--lg" id="hero-cta-primary">
            {data.ctaPrimary.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link to={data.ctaSecondary.href} className="btn btn--outline btn--lg" id="hero-cta-secondary">
            {data.ctaSecondary.label}
          </Link>
        </div>

        {/* Stats bar */}
        <div className={`${styles.stats} animate-fadeInUp stagger-5`}>
          {data.stats.map((s, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero image */}
      <div className={`${styles.heroImage} animate-fadeIn stagger-3`} aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80"
          alt="Athlete training with FitFlow"
          loading="eager"
          className={styles.heroImg}
        />
        <div className={styles.heroImageOverlay} />
        {/* Floating metric card */}
        <div className={styles.floatCard}>
          <div className={styles.floatCardInner}>
            <div className={styles.floatCardLabel}>Weekly Progress</div>
            <div className={styles.floatCardValue}>+23%</div>
            <div className={styles.floatCardBar}>
              <div className={styles.floatCardFill} style={{ width: '73%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Feature Teaser ---- */
function FeatureTeaser({ features }) {
  const { ref, revealed } = useReveal();

  return (
    <section className={`${styles.featureTeaser} section section--alt`} ref={ref}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className="eyebrow">Why FitFlow</p>
          <h2 className={`display-3 ${revealed ? 'animate-fadeInUp' : ''}`}>
            Everything you need.<br />
            <span className={styles.textGradient}>Nothing you don't.</span>
          </h2>
        </div>

        <div className={styles.featureGrid}>
          {features.slice(0, 3).map((f, i) => (
            <div
              key={f._id}
              className={`${styles.featureCard} ${revealed ? `animate-fadeInUp stagger-${i + 2}` : ''}`}
            >
              <div className={styles.featureIconWrap}>
                <FeatureIcon name={f.icon} />
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.featuresLink}>
          <Link to="/features" className="btn btn--outline" id="home-features-link">
            See all features
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---- Testimonials ---- */
function Testimonials({ testimonials }) {
  const { ref, revealed } = useReveal();

  return (
    <section className={`section section--dark`} ref={ref}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className="eyebrow">Real Results</p>
          <h2 className="display-3">
            Coaches & athletes<br />
            <span className={styles.textAccent}>love FitFlow</span>
          </h2>
        </div>

        <div className={styles.testimonialGrid}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`card ${styles.testimonialCard} ${revealed ? `animate-fadeInUp stagger-${i + 1}` : ''}`}
            >
              <div className={styles.stars} aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }, (_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FF4D1C" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <blockquote className={styles.quote}>"{t.quote}"</blockquote>
              <div className={styles.reviewer}>
                <img
                  src={t.avatar}
                  alt={`${t.name} profile`}
                  className={styles.reviewerAvatar}
                  loading="lazy"
                  width={40}
                  height={40}
                />
                <div>
                  <div className={styles.reviewerName}>{t.name}</div>
                  <div className={styles.reviewerRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- CTA Strip ---- */
function CTAStrip() {
  const { ref, revealed } = useReveal();

  return (
    <section className={styles.ctaStrip} ref={ref}>
      <div className="container">
        <div className={`${styles.ctaInner} ${revealed ? 'animate-scaleIn' : ''}`}>
          <div className={styles.ctaText}>
            <h2 className="display-3">
              Ready to level up?
            </h2>
            <p>Join 12,000+ athletes already training with FitFlow.</p>
          </div>
          <div className={styles.ctaBtns}>
            <Link to="/register" className="btn btn--accent btn--lg" id="home-cta-register">
              Start 14-Day Free Trial
            </Link>
            <Link to="/pricing" className="btn btn--outline btn--lg" id="home-cta-pricing">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Icon helper ---- */
function FeatureIcon({ name }) {
  const icons = {
    zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    'bar-chart': <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    leaf: <path d="M2 22c1-1 2.5-2 4-2 3 0 3 2 6 2 2 0 4-1 5-2V4c-1 1-2.5 2-4 2-3 0-3-2-6-2-2 0-4 1-5 2z" />,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    trophy: <><polyline points="8 10 12 14 16 10" /><line x1="12" y1="14" x2="12" y2="3" /><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 1 3 16.29" /></>,
  };

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
}

/* ---- Page ---- */
export default function Home() {
  const [hero, setHero] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'FitFlow — Train Smarter, Live Stronger';

    const load = async () => {
      try {
        const [heroRes, testimonialsRes, featuresRes] = await Promise.all([
          getContent('hero'),
          getContent('testimonials'),
          getFeatures({ highlight: true }),
        ]);
        setHero(heroRes.data.data);
        setTestimonials(testimonialsRes.data.data);
        setFeatures(featuresRes.data.data);
      } catch (err) {
        console.error('Failed to load home content', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3, color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <main>
      <Hero data={hero} />
      <FeatureTeaser features={features} />
      <Testimonials testimonials={testimonials} />
      <CTAStrip />
    </main>
  );
}
