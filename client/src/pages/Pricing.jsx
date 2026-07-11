import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPricing } from '../api';
import { useAuth } from '../context/AuthContext';
import { useReveal } from '../hooks/useReveal';
import styles from './Pricing.module.css';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PricingCard({ plan, index }) {
  const { ref, revealed } = useReveal(0.1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCta = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <article
      ref={ref}
      className={`${styles.card} ${plan.isPopular ? styles.popular : ''} ${revealed ? `animate-fadeInUp stagger-${index + 1}` : ''}`}
      aria-label={`${plan.name} plan`}
    >
      {plan.isPopular && (
        <div className={styles.popularLabel} aria-label="Most popular plan">Most Popular</div>
      )}
      <header className={styles.cardHeader}>
        <h2 className={styles.planName}>{plan.name}</h2>
        <p className={styles.planDesc}>{plan.description}</p>
        <div className={styles.priceRow}>
          <span className={styles.currency}>$</span>
          <span className={styles.price}>{plan.price}</span>
          {plan.price > 0 && <span className={styles.period}>/ mo</span>}
          {plan.price === 0 && <span className={styles.period}>forever</span>}
        </div>
      </header>

      <button
        className={`btn btn--lg ${plan.isPopular ? 'btn--primary' : 'btn--outline'} ${styles.cta}`}
        onClick={handleCta}
        id={`pricing-cta-${plan.name.toLowerCase()}`}
      >
        {plan.ctaLabel}
      </button>

      <ul className={styles.features} role="list" aria-label={`${plan.name} plan features`}>
        {plan.features.map((f, i) => (
          <li key={i} className={styles.feature}>
            <span className={styles.featureCheck}><CheckIcon /></span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, revealed } = useReveal(0.1);

  useEffect(() => {
    document.title = 'Pricing — FitFlow';
    getPricing()
      .then((res) => setPlans(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.pageHero} ref={ref}>
        <div className="container">
          <p className="eyebrow">Pricing</p>
          <h1 className={`display-2 ${revealed ? 'animate-fadeInUp stagger-1' : ''}`}>
            Simple pricing.<br />
            <span className={styles.accent}>No surprises.</span>
          </h1>
          <p className={`${styles.heroSub} ${revealed ? 'animate-fadeInUp stagger-2' : ''}`}>
            14-day free trial on all paid plans. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      <section className={`section section--dark`}>
        <div className="container">
          {loading ? (
            <div className={styles.grid}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${styles.card} skeleton`} style={{ height: 480 }} />
              ))}
            </div>
          ) : (
            <div className={styles.grid}>
              {plans.map((plan, i) => (
                <PricingCard key={plan._id} plan={plan} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className={`section section--alt ${styles.faqSection}`}>
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h2 className="display-3" style={{ marginBottom: 'var(--space-10)' }}>Common questions</h2>
          <div className={styles.faqGrid}>
            {[
              { q: 'Can I switch plans anytime?', a: 'Yes — upgrade or downgrade at any point. Upgrades take effect immediately; downgrades at the end of your billing period.' },
              { q: 'Is the 14-day trial really free?', a: 'Completely. No credit card required. You only enter payment details when you decide to continue after the trial.' },
              { q: 'How are coaches matched to me?', a: 'After you complete your onboarding quiz, our matching algorithm considers your goals, sport, schedule, and experience level to suggest coaches. You pick the one you connect with.' },
              { q: 'What happens to my data if I cancel?', a: 'Your training history and data are exported in CSV/JSON format before your account closes. We retain anonymized aggregate data for product improvement.' },
              { q: 'Do you offer team or corporate plans?', a: 'Yes — contact us for group pricing. Teams of 5+ get discounted rates with a shared analytics dashboard.' },
              { q: 'Can I use FitFlow without a coach?', a: 'Absolutely. The Free plan gives you full access to self-guided workout logging and templates. Coaching is optional on paid plans too.' },
            ].map(({ q, a }) => (
              <FaqItem key={q} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button
        className={styles.faqQ}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        id={`faq-${question.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`}
      >
        {question}
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`${styles.faqChevron} ${open ? styles.faqOpen : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <p className={styles.faqA}>{answer}</p>}
    </div>
  );
}
