import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { getPost } from '../api';
import styles from './BlogPost.module.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getPost(slug)
      .then((res) => {
        setPost(res.data.data);
        document.title = `${res.data.data.title} — FitFlow Blog`;
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={`${styles.container} container`}>
          <div className="skeleton" style={{ height: 40, width: '70%', marginBottom: 'var(--space-4)', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 400, borderRadius: 12, marginBottom: 'var(--space-8)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton" style={{ height: 18, width: `${90 - i * 5}%`, borderRadius: 4 }} />)}
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className={styles.page}>
        <div className={`${styles.container} container`} style={{ textAlign: 'center', paddingTop: 'var(--space-20)' }}>
          <h1 className="display-3">Post not found</h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-4) 0 var(--space-8)' }}>
            This post may have been moved or removed.
          </p>
          <Link to="/blog" className="btn btn--primary">← Back to Blog</Link>
        </div>
      </main>
    );
  }

  const html = marked.parse(post.body || '');

  return (
    <main className={styles.page}>
      {/* Hero image */}
      {post.coverImage && (
        <div className={styles.hero} aria-hidden="true">
          <img src={post.coverImage} alt={post.title} className={styles.heroImg} />
          <div className={styles.heroOverlay} />
        </div>
      )}

      <div className={`${styles.container} container`}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/blog" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            All posts
          </Link>
        </nav>

        <header className={styles.header}>
          {/* Tags */}
          <div className={styles.tags}>
            {post.tags.map((t) => (
              <Link key={t} to={`/blog?tag=${t}`} className={styles.tag}>{t}</Link>
            ))}
          </div>

          <h1 className={`${styles.title} display-2`}>{post.title}</h1>

          <div className={styles.meta}>
            <span className={styles.author}>{post.author}</span>
            <span className={styles.dot} />
            <span className={styles.readTime}>{post.readTime} min read</span>
            <span className={styles.dot} />
            <time className={styles.date} dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
        </header>

        {/* Markdown body */}
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerTags}>
            <span className={styles.footerTagsLabel}>Tagged:</span>
            {post.tags.map((t) => (
              <Link key={t} to={`/blog?tag=${t}`} className={styles.tag}>{t}</Link>
            ))}
          </div>
          <Link to="/blog" className="btn btn--outline" id="blogpost-back-btn">← More articles</Link>
        </footer>

        {/* CTA */}
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to apply this to your training?</h2>
          <p className={styles.ctaText}>FitFlow's adaptive coaching puts these principles into practice automatically — so you can focus on training, not planning.</p>
          <Link to="/register" className="btn btn--primary btn--lg" id="blogpost-cta">Start Free Trial</Link>
        </div>
      </div>
    </main>
  );
}
