import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts } from '../api';
import styles from './Blog.module.css';

const TAGS = ['all', 'training', 'nutrition', 'recovery', 'coaching', 'analytics', 'strength', 'endurance'];

function PostCard({ post }) {
  return (
    <article className={styles.card}>
      {post.coverImage && (
        <Link to={`/blog/${post.slug}`} className={styles.imageLink} tabIndex="-1" aria-hidden="true">
          <img
            src={post.coverImage}
            alt={post.title}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageOverlay} />
        </Link>
      )}
      <div className={styles.cardBody}>
        <div className={styles.meta}>
          <div className={styles.tags}>
            {post.tags.slice(0, 2).map((t) => (
              <Link key={t} to={`/blog?tag=${t}`} className={styles.tag}>{t}</Link>
            ))}
          </div>
          <span className={styles.readTime}>{post.readTime} min read</span>
        </div>
        <h2 className={styles.title}>
          <Link to={`/blog/${post.slug}`} className={styles.titleLink}>{post.title}</Link>
        </h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <footer className={styles.cardFooter}>
          <span className={styles.author}>{post.author}</span>
          <Link to={`/blog/${post.slug}`} className={`btn btn--ghost btn--sm ${styles.readMore}`} id={`blog-read-${post.slug}`}>
            Read
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </footer>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`skeleton ${styles.image}`} style={{ height: 200 }} />
      <div className={styles.cardBody} style={{ gap: 'var(--space-3)' }}>
        <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 24, width: '90%', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 60, borderRadius: 4 }} />
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const tag = searchParams.get('tag') || 'all';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    document.title = 'Blog — FitFlow';
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 6 };
    if (tag !== 'all') params.tag = tag;

    getPosts(params)
      .then((res) => {
        setPosts(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tag, page]);

  const setTag = (t) => {
    setSearchParams(t === 'all' ? {} : { tag: t });
  };

  return (
    <main className={styles.page}>
      <section className={styles.pageHero}>
        <div className="container">
          <p className="eyebrow">Knowledge Hub</p>
          <h1 className="display-2">
            Train smarter<br />
            <span className={styles.accent}>with better insights</span>
          </h1>
          <p className={styles.heroSub}>
            Evidence-based coaching, nutrition science, and performance strategies from FitFlow's team of expert coaches and sport scientists.
          </p>
        </div>
      </section>

      {/* Tag filter */}
      <div className={styles.tagBar}>
        <div className="container">
          <div className={styles.tags} role="tablist" aria-label="Filter posts by tag">
            {TAGS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tag === t}
                className={`${styles.tagBtn} ${tag === t ? styles.active : ''}`}
                onClick={() => setTag(t)}
                id={`blog-tag-${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts grid */}
      <section className={`section section--dark`}>
        <div className="container">
          {loading ? (
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.empty}>
              <p>No posts found{tag !== 'all' ? ` for tag "${tag}"` : ''}.</p>
              <button className="btn btn--outline" onClick={() => setTag('all')} id="blog-clear-filter">Clear filter</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {posts.map((p) => <PostCard key={p._id} post={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <nav className={styles.pagination} aria-label="Blog pagination">
              <button
                className="btn btn--outline btn--sm"
                disabled={page <= 1}
                onClick={() => setSearchParams({ ...(tag !== 'all' ? { tag } : {}), page: page - 1 })}
                id="blog-prev-page"
              >
                ← Previous
              </button>
              <span className={styles.pageInfo}>Page {page} of {pagination.pages}</span>
              <button
                className="btn btn--outline btn--sm"
                disabled={page >= pagination.pages}
                onClick={() => setSearchParams({ ...(tag !== 'all' ? { tag } : {}), page: page + 1 })}
                id="blog-next-page"
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
