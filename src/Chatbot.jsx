import { useState } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Static demo messages
  const messages = [
    { role: 'assistant', content: "Hi! I'm your ET Navigator assistant. How can I help you today?" },
    { role: 'assistant', content: "I can help you explore ET services, find relevant content, or answer questions about markets, events, and more." },
  ];

  const handleSend = () => {
    // Demo only - does nothing
    if (inputValue.trim()) {
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.floatingBtn,
          ...(isOpen ? styles.floatingBtnActive : {}),
        }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.statusDot}></div>
              <div>
                <h3 style={styles.headerTitle}>AI Assistant</h3>
                <span style={styles.headerStatus}>Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeBtn}
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div style={styles.chatBody}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageRow,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={styles.avatarSmall}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                    </svg>
                  </div>
                )}
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.role === 'user' ? styles.userBubble : styles.assistantBubble),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div style={styles.messageRow}>
              <div style={styles.avatarSmall}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
              </div>
              <div style={styles.typingIndicator}>
                <span style={styles.typingDot}></span>
                <span style={{ ...styles.typingDot, animationDelay: '0.2s' }}></span>
                <span style={{ ...styles.typingDot, animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
            />
            <button
              onClick={handleSend}
              style={styles.sendBtn}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <span>Powered by ET Navigator AI</span>
          </div>
        </div>
      )}

      {/* CSS Animation for typing dots */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}

const styles = {
  floatingBtn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
    transition: 'all 0.3s ease',
    zIndex: 1000,
  },
  floatingBtnActive: {
    background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '96px',
    right: '24px',
    width: '380px',
    maxHeight: '520px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1000,
    animation: 'slideUp 0.3s ease',
    border: '1px solid #e5e7eb',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: '12px',
    opacity: 0.9,
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
  chatBody: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    background: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '280px',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  avatarSmall: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  assistantBubble: {
    background: '#fff',
    color: '#374151',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '12px 16px',
    background: '#fff',
    borderRadius: '16px',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#9ca3af',
    animation: 'typingBounce 1.4s infinite ease-in-out',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
    padding: '16px 20px',
    borderTop: '1px solid #e5e7eb',
    background: '#fff',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
  },
  footer: {
    padding: '10px',
    textAlign: 'center',
    fontSize: '11px',
    color: '#9ca3af',
    background: '#fff',
    borderTop: '1px solid #f3f4f6',
  },
};

export default Chatbot;
