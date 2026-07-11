import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendChat } from '../api';
import styles from './ChatWidget.module.css';

const SESSION_KEY = 'fitflow_chat_session';

const getSessionId = () => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! 👋 I'm FitBot. Ask me anything about FitFlow — pricing, coaching, features, or anything else!", id: 'welcome' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionId = useRef(getSessionId());

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text, id: uuidv4() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChat({ message: text, sessionId: sessionId.current });
      const botMsg = { role: 'assistant', content: res.data.reply, id: uuidv4() };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg = {
        role: 'assistant',
        content: "Sorry, I'm having a moment — try again in a sec! For urgent help, visit our Contact page.",
        id: uuidv4(),
        error: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        className={`${styles.toggle} ${open ? styles.open : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat with FitBot'}
        aria-expanded={open}
        aria-controls="chat-widget"
        id="chat-toggle-btn"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && <span className={styles.badge}>1</span>}
      </button>

      {/* Chat panel */}
      <div
        id="chat-widget"
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="dialog"
        aria-label="FitBot chat"
        aria-modal="false"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="12" height="28" rx="2" fill="#FF4D1C" />
                <rect x="16" y="8" width="12" height="20" rx="2" fill="#B6FF4A" />
              </svg>
            </div>
            <div>
              <div className={styles.botName}>FitBot</div>
              <div className={styles.botStatus}>
                <span className={styles.dot} />
                Online
              </div>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messages} role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant} ${msg.error ? styles.errorMsg : ''}`}
            >
              <p>{msg.content}</p>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.typing} aria-label="FitBot is typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={send} className={styles.inputRow}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask FitBot anything..."
            className={styles.input}
            maxLength={500}
            disabled={loading}
            aria-label="Chat message input"
            id="chat-input"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            id="chat-send-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
