import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import styles from './Dashboard.module.css';

const QUICK_ACTIONS = [
  { label: 'Log a Workout', icon: 'zap', to: '#', id: 'dash-log-workout' },
  { label: 'View Progress', icon: 'bar-chart', to: '#', id: 'dash-progress' },
  { label: 'Message Coach', icon: 'message', to: '#', id: 'dash-coach' },
  { label: 'Nutrition Log', icon: 'leaf', to: '#', id: 'dash-nutrition' },
];

const MOCK_STATS = [
  { label: 'Workouts This Month', value: '18', delta: '+3 vs last month', positive: true },
  { label: 'Current Streak', value: '7 days', delta: 'Personal best!', positive: true },
  { label: 'Avg. Session', value: '52 min', delta: '-4 min vs target', positive: false },
  { label: 'Recovery Score', value: '84%', delta: 'Good to train', positive: true },
];

function ActionIcon({ name }) {
  const icons = {
    zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    'bar-chart': <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    message: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
    leaf: <path d="M2 22c1-1 2.5-2 4-2 3 0 3 2 6 2 2 0 4-1 5-2V4c-1 1-2.5 2-4 2-3 0-3-2-6-2-2 0-4 1-5 2z" />,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
}

const PLAN_LABEL = { free: 'Free Plan', pro: 'Pro', elite: 'Elite' };
const PLAN_COLOR = { free: '#666', pro: 'var(--color-primary)', elite: 'var(--color-accent)' };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard — FitFlow';
  }, []);

  const handleLogout = () => {
    logout();
    addToast({ message: 'You have been logged out.', type: 'info' });
    navigate('/');
  };

  if (!user) return null;

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Header */}
        <header className={styles.header}>
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className={styles.greeting}>
              Good morning,{' '}
              <span className={styles.name}>{user.name.split(' ')[0]}</span> 👋
            </h1>
            <div className={styles.planBadge} style={{ '--plan-color': PLAN_COLOR[user.plan] }}>
              {PLAN_LABEL[user.plan]}
              {user.plan === 'free' && (
                <Link to="/pricing" className={styles.upgradeCta} id="dash-upgrade-cta">Upgrade →</Link>
              )}
            </div>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={handleLogout} id="dash-logout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </header>

        {/* Stats */}
        <section className={styles.statsGrid} aria-label="Performance stats">
          {MOCK_STATS.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statValue}>{s.value}</span>
              <span className={`${styles.statDelta} ${s.positive ? styles.positive : styles.negative}`}>
                {s.delta}
              </span>
            </div>
          ))}
        </section>

        {/* Quick actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.id}
                to={a.to}
                className={styles.actionCard}
                id={a.id}
                aria-label={a.label}
              >
                <div className={styles.actionIcon}><ActionIcon name={a.icon} /></div>
                <span className={styles.actionLabel}>{a.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.actionArrow} aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Profile summary */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Profile</h2>
          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{user.name}</div>
              <div className={styles.profileEmail}>{user.email}</div>
              {user.bio && <div className={styles.profileBio}>{user.bio}</div>}
              {user.fitnessGoal && (
                <div className={styles.profileGoal}>
                  <span className={styles.goalLabel}>Goal:</span> {user.fitnessGoal}
                </div>
              )}
            </div>
            <div className={styles.profileMeta}>
              <div className={styles.profileMetaItem}>
                <span className={styles.metaLabel}>Member since</span>
                <span className={styles.metaValue}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className={styles.profileMetaItem}>
                <span className={styles.metaLabel}>Plan</span>
                <span className={styles.metaValue} style={{ color: PLAN_COLOR[user.plan] }}>
                  {PLAN_LABEL[user.plan]}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Upgrade CTA for free users */}
        {user.plan === 'free' && (
          <section className={styles.upgradeBanner}>
            <div className={styles.upgradeText}>
              <h2 className={styles.upgradeTitle}>Unlock your full potential</h2>
              <p>Upgrade to Pro to get a dedicated coach, adaptive training plans, and full analytics.</p>
            </div>
            <Link to="/pricing" className="btn btn--primary btn--lg" id="dash-upgrade-banner-btn">
              View Plans →
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
