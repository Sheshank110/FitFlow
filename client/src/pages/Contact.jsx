import { useState, useEffect } from 'react';
import { submitContact } from '../api';
import { useToast } from '../components/Toast';
import { useReveal } from '../hooks/useReveal';
import styles from './Contact.module.css';

const SUBJECTS = [
  'General inquiry',
  'Coaching question',
  'Billing & plans',
  'Technical support',
  'Partnership',
  'Other',
];

export default function Contact() {
  const { addToast } = useToast();
  const { ref: heroRef, revealed: heroRevealed } = useReveal(0.1);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { document.title = 'Contact — FitFlow'; }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.subject) errs.subject = 'Please choose a subject';
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
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
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      addToast({ message: "Your message was sent! We'll reply within 24 hours.", type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      addToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.pageHero} ref={heroRef}>
        <div className="container">
          <p className="eyebrow">Get in touch</p>
          <h1 className={`display-2 ${heroRevealed ? 'animate-fadeInUp stagger-1' : ''}`}>
            We'd love to<br />
            <span className={styles.accent}>hear from you</span>
          </h1>
          <p className={`${styles.heroSub} ${heroRevealed ? 'animate-fadeInUp stagger-2' : ''}`}>
            Questions about coaching, plans, or just want to say hi — we're real people and we actually respond.
          </p>
        </div>
      </section>

      <section className={`section section--dark`}>
        <div className="container">
          <div className={styles.layout}>
            {/* Info sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Support hours</h2>
                <p className={styles.infoText}>Monday – Sunday<br />8am – 10pm EST</p>
              </div>
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Response time</h2>
                <p className={styles.infoText}>Free & Pro: within 24h<br />Elite: within 2 hours</p>
              </div>
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Direct channels</h2>
                <p className={styles.infoText}>
                  <a href="mailto:hello@fitflow.com" className={styles.infoLink}>hello@fitflow.com</a>
                </p>
              </div>
            </aside>

            {/* Form */}
            <div className={styles.formWrap}>
              {submitted ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon} aria-hidden="true">✓</div>
                  <h2 className={styles.successTitle}>Message sent!</h2>
                  <p className={styles.successText}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    className="btn btn--outline"
                    onClick={() => setSubmitted(false)}
                    id="contact-send-another"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate aria-label="Contact form">
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">Full name</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                        placeholder="Marcus Rivera"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <p className="form-error" id="contact-name-error" role="alert">{errors.name}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-email">Email address</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                        placeholder="marcus@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className="form-error" id="contact-email-error" role="alert">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-subject">Subject</label>
                    <select
                      id="contact-subject"
                      name="subject"
                      className={`form-select ${errors.subject ? 'form-input--error' : ''}`}
                      value={form.subject}
                      onChange={handleChange}
                      aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                      aria-invalid={!!errors.subject}
                    >
                      <option value="">Choose a subject...</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="form-error" id="contact-subject-error" role="alert">{errors.subject}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className={`form-textarea ${errors.message ? 'form-input--error' : ''}`}
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      maxLength={2000}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      aria-invalid={!!errors.message}
                    />
                    <div className={styles.charCount}>{form.message.length}/2000</div>
                    {errors.message && <p className="form-error" id="contact-message-error" role="alert">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className={`btn btn--primary btn--lg ${styles.submitBtn} ${submitting ? 'btn--loading' : ''}`}
                    disabled={submitting}
                    id="contact-submit-btn"
                  >
                    {submitting ? <><span className="spinner" />Sending...</> : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
