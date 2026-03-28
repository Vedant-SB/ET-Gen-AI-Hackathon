import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Onboarding questions with optional MCQ options and suggestions
const ONBOARDING_FLOW = [
  {
    content: "Hello! 👋 Welcome to ET Navigator. I'm your AI concierge, here to help personalize your experience.\n\nWhat should I call you?",
    type: 'text'
  },
  {
    content: "Nice to meet you! Which best describes you?",
    type: 'mcq',
    options: ['Student', 'Working Professional', 'Business Owner', 'Other']
  },
  {
    content: "What field are you in or interested in?",
    type: 'suggestion',
    suggestions: ['Finance', 'Technology', 'Manufacturing', 'Marketing']
  },
  {
    content: "What topics are you most interested in?",
    type: 'suggestion',
    suggestions: ['Markets', 'Business News', 'Technology', 'Crypto', 'Learning']
  },
  {
    content: "How do you prefer your content?",
    type: 'mcq',
    options: ['Quick updates', 'Deep insights']
  },
  {
    content: "Last one! What are your current goals? (Optional - you can skip)",
    type: 'text'
  }
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: ONBOARDING_FLOW[0].content,
  options: ONBOARDING_FLOW[0].options || null,
  suggestions: ONBOARDING_FLOW[0].suggestions || null
};

function Chat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const chatBoxRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (customMessage = null) => {
    const userMessage = (customMessage || message).trim();
    if (!userMessage) return;

    setMessage('');
    setError('');
    setLoading(true);

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await axios.post('http://127.0.0.1:5000/chat', {
        message: userMessage,
        history: newMessages,
      });

      const reply = response.data.reply;
      const nextStep = currentStep + 1;
      
      // Check if we should trigger completion
      if (reply.toLowerCase().includes('generate your experience')) {
        const updatedMessages = [...newMessages, { role: 'assistant', content: reply }];
        setMessages(updatedMessages);
        setShowButton(true);
      } else {
        // Get next question from flow or use AI response
        const nextQuestion = ONBOARDING_FLOW[nextStep];
        const assistantMessage = {
          role: 'assistant',
          content: nextQuestion ? nextQuestion.content : reply,
          options: nextQuestion?.options || null,
          suggestions: nextQuestion?.suggestions || null
        };
        
        setMessages([...newMessages, assistantMessage]);
        setCurrentStep(nextStep);
      }
    } catch (err) {
      setError('Failed to get response. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    sendMessage(option);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(prev => {
      const current = prev.trim();
      if (current) {
        return current.includes(suggestion) ? current : `${current}, ${suggestion}`;
      }
      return suggestion;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  const handleGenerateExperience = () => {
    navigate('/home');
  };

  // Get current message options/suggestions
  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
  const currentOptions = lastAssistantMsg?.options;
  const currentSuggestions = lastAssistantMsg?.suggestions;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <span style={styles.logoIcon}>🧭</span>
          <h1 style={styles.title}>ET Navigator</h1>
        </div>
        <p style={styles.subtitle}>Your AI Concierge</p>
      </div>

      {/* Chat Messages */}
      <div style={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index}>
            <div
              style={{
                ...styles.messageBubble,
                ...(msg.role === 'user' ? styles.userBubble : styles.assistantBubble),
              }}
            >
              {msg.role === 'assistant' && <span style={styles.aiAvatar}>🤖</span>}
              <div style={{
                ...styles.messageContent,
                ...(msg.role === 'user' ? styles.userContent : styles.assistantContent),
              }}>
                <p style={styles.messageText}>{msg.content}</p>
              </div>
              {msg.role === 'user' && <span style={styles.userAvatar}>👤</span>}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
            <span style={styles.aiAvatar}>🤖</span>
            <div style={{ ...styles.messageContent, ...styles.assistantContent }}>
              <p style={styles.messageText}>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* MCQ Options */}
      {currentOptions && !showButton && !loading && (
        <div style={styles.optionsContainer}>
          {currentOptions.map((option, idx) => (
            <button
              key={idx}
              style={styles.optionButton}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Suggestion Chips */}
      {currentSuggestions && !showButton && !loading && (
        <div style={styles.suggestionsContainer}>
          <span style={styles.suggestionsLabel}>Suggestions:</span>
          <div style={styles.suggestionsRow}>
            {currentSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                style={styles.suggestionChip}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      {showButton && (
        <button style={styles.generateButton} onClick={handleGenerateExperience}>
          ✨ Generate My Experience
        </button>
      )}

      {/* Input Section */}
      {!currentOptions && !showButton && (
        <div style={styles.inputSection}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={styles.input}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !message.trim()}
            style={{
              ...styles.sendButton,
              opacity: loading || !message.trim() ? 0.6 : 1,
            }}
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
      )}

      {/* Show input for suggestions (optional text with suggestions) */}
      {currentSuggestions && !showButton && (
        <div style={styles.inputSection}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type or click suggestions above..."
            style={styles.input}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !message.trim()}
            style={{
              ...styles.sendButton,
              opacity: loading || !message.trim() ? 0.6 : 1,
            }}
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #f8f9fc 0%, #e8ebf2 100%)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '4px 0 0',
  },
  chatBox: {
    flex: 1,
    borderRadius: '16px',
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '16px',
    minHeight: '400px',
    maxHeight: '500px',
  },
  messageBubble: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '10px',
  },
  userBubble: {
    flexDirection: 'row-reverse',
  },
  assistantBubble: {
    flexDirection: 'row',
  },
  aiAvatar: {
    fontSize: '24px',
    flexShrink: 0,
  },
  userAvatar: {
    fontSize: '24px',
    flexShrink: 0,
  },
  messageContent: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '16px',
  },
  userContent: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  assistantContent: {
    background: '#f0f2f5',
    color: '#333',
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
    fontSize: '15px',
  },
  error: {
    color: '#e53935',
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '14px',
    background: '#ffebee',
    padding: '10px',
    borderRadius: '8px',
  },
  optionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '16px',
    justifyContent: 'center',
  },
  optionButton: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '500',
    background: '#fff',
    border: '2px solid #667eea',
    borderRadius: '25px',
    cursor: 'pointer',
    color: '#667eea',
    transition: 'all 0.2s',
  },
  suggestionsContainer: {
    marginBottom: '12px',
  },
  suggestionsLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px',
    display: 'block',
  },
  suggestionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  suggestionChip: {
    padding: '8px 14px',
    fontSize: '13px',
    background: '#f0f2f5',
    border: '1px solid #e0e0e0',
    borderRadius: '20px',
    cursor: 'pointer',
    color: '#555',
  },
  generateButton: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '12px',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
  },
  inputSection: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    outline: 'none',
    background: '#fff',
  },
  sendButton: {
    width: '50px',
    height: '50px',
    fontSize: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Chat;
