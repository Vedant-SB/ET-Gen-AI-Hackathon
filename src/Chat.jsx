import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Get or generate user_id
const getUserId = () => {
  let user_id = localStorage.getItem("user_id");
  if (!user_id) {
    user_id = crypto.randomUUID();
    localStorage.setItem("user_id", user_id);
  }
  return user_id;
};

// Onboarding questions - each step collects specific data
const ONBOARDING_FLOW = [
  {
    key: 'name',
    content: "Hello! Welcome to ET Navigator. I'm your AI concierge, here to help personalize your experience.\n\nWhat should I call you?",
    type: 'text'
  },
  {
    key: 'role',
    content: "Nice to meet you! Which best describes you?",
    type: 'mcq',
    options: ['Student', 'Working Professional', 'Business Owner', 'Other']
  },
  {
    key: 'domain',
    content: "What field are you in or interested in?",
    type: 'suggestion',
    suggestions: ['Finance', 'Technology', 'Marketing', 'Healthcare', 'Data Science', 'Manufacturing']
  },
  {
    key: 'interests',
    content: "What kind of updates would you like to see regularly?",
    type: 'suggestion',
    suggestions: ['Market Updates', 'Business News', 'Industry Trends', 'Learning & Courses', 'Startup Insights']
  },
  {
    key: 'preference',
    content: "How do you prefer your content?",
    type: 'mcq',
    options: ['Quick updates', 'Deep insights']
  },
  {
    key: 'goals',
    content: "Last one! What are your current goals? (Optional - type 'skip' to continue)",
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
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState('');
  const chatBoxRef = useRef(null);
  
  // Collect profile data as user answers
  const [profileData, setProfileData] = useState({
    name: '',
    role: '',
    domain: [],
    interests: [],
    preference: '',
    goals: []
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const processAnswer = (answer, step) => {
    const currentQuestion = ONBOARDING_FLOW[step];
    const key = currentQuestion.key;
    
    setProfileData(prev => {
      const updated = { ...prev };
      
      if (key === 'name') {
        updated.name = answer;
      } else if (key === 'role') {
        updated.role = answer;
      } else if (key === 'domain') {
        // Convert comma-separated to array
        const domains = answer.split(',').map(s => s.trim()).filter(s => s);
        updated.domain = domains;
      } else if (key === 'interests') {
        // Convert comma-separated to array
        const interests = answer.split(',').map(s => s.trim()).filter(s => s);
        updated.interests = interests;
      } else if (key === 'preference') {
        updated.preference = answer;
      } else if (key === 'goals') {
        if (answer.toLowerCase() !== 'skip') {
          const goals = answer.split(',').map(s => s.trim()).filter(s => s);
          updated.goals = goals;
        }
      }
      
      return updated;
    });
  };

  const saveProfile = async (finalProfileData) => {
    const user_id = getUserId();
    
    try {
      // Save to backend
      await axios.post('http://127.0.0.1:5000/save-profile', {
        user_id,
        profile: finalProfileData
      });
      
      // Also save to localStorage as backup
      localStorage.setItem('user', JSON.stringify(finalProfileData));
      
      return true;
    } catch (err) {
      console.error('Error saving profile:', err);
      // Still save to localStorage even if backend fails
      localStorage.setItem('user', JSON.stringify(finalProfileData));
      return true; // Continue anyway
    }
  };

  const sendMessage = async (customMessage = null) => {
    const userMessage = (customMessage || message).trim();
    if (!userMessage) return;

    setMessage('');
    setOtherValue('');
    setShowOtherInput(false);
    setError('');
    setLoading(true);

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    // Process the answer for current step
    processAnswer(userMessage, currentStep);

    // Move to next step
    const nextStep = currentStep + 1;

    // Small delay to feel more natural
    await new Promise(resolve => setTimeout(resolve, 300));

    if (nextStep >= ONBOARDING_FLOW.length) {
      // Onboarding complete - prepare final profile
      const finalProfile = {
        ...profileData,
        // Update with latest answer (goals)
        goals: userMessage.toLowerCase() !== 'skip' 
          ? userMessage.split(',').map(s => s.trim()).filter(s => s)
          : []
      };
      
      // Show completion message
      const completionMessage = {
        role: 'assistant',
        content: `Perfect, ${profileData.name || 'friend'}!\n\nI've got everything I need. Click below to explore your personalized ET experience!`
      };
      setMessages([...newMessages, completionMessage]);
      
      // Save profile
      await saveProfile(finalProfile);
      
      setShowButton(true);
    } else {
      // Show next question
      const nextQuestion = ONBOARDING_FLOW[nextStep];
      const assistantMessage = {
        role: 'assistant',
        content: nextQuestion.content,
        options: nextQuestion.options || null,
        suggestions: nextQuestion.suggestions || null
      };
      
      setMessages([...newMessages, assistantMessage]);
      setCurrentStep(nextStep);
    }

    setLoading(false);
  };

  const handleOptionClick = (option) => {
    if (option === 'Other') {
      setShowOtherInput(true);
    } else {
      sendMessage(option);
    }
  };

  const handleOtherSubmit = () => {
    if (otherValue.trim()) {
      sendMessage(otherValue.trim());
    }
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

  const handleOtherKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleOtherSubmit();
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
      <div style={styles.chatWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>ET</div>
            <h1 style={styles.title}>Navigator</h1>
          </div>
          <p style={styles.subtitle}>Your AI Concierge for Economic Times</p>
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
                {msg.role === 'assistant' && <span style={styles.aiAvatar}>AI</span>}
                <div style={{
                  ...styles.messageContent,
                  ...(msg.role === 'user' ? styles.userContent : styles.assistantContent),
                }}>
                  <p style={styles.messageText}>{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
              <span style={styles.aiAvatar}>AI</span>
              <div style={{ ...styles.messageContent, ...styles.assistantContent }}>
                <p style={styles.messageText}>...</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* MCQ Options */}
        {currentOptions && !showButton && !loading && !showOtherInput && (
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

        {/* Other Input (when "Other" is clicked) */}
        {showOtherInput && !loading && (
          <div style={styles.otherInputContainer}>
            <p style={styles.otherLabel}>Please specify:</p>
            <div style={styles.inputSection}>
              <input
                type="text"
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                onKeyPress={handleOtherKeyPress}
                placeholder="Enter your role..."
                style={styles.input}
                autoFocus
              />
              <button
                onClick={handleOtherSubmit}
                disabled={!otherValue.trim()}
                style={{
                  ...styles.sendButton,
                  opacity: !otherValue.trim() ? 0.6 : 1,
                }}
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* Suggestion Chips (no label) */}
        {currentSuggestions && !showButton && !loading && (
          <div style={styles.suggestionsContainer}>
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
            Explore ET
          </button>
        )}

        {/* Input Section - for text and suggestion type questions (single input) */}
        {!currentOptions && !showButton && !showOtherInput && (
          <div style={styles.inputSection}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentSuggestions ? "Type or click options above..." : "Type your message..."}
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
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: '#f9fafb',
  },
  chatWrapper: {
    width: '100%',
    maxWidth: '680px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    background: '#ef4444',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '8px 0 0',
  },
  chatBox: {
    borderRadius: '12px',
    padding: '24px',
    overflowY: 'auto',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    marginBottom: '16px',
    minHeight: '420px',
    maxHeight: '500px',
  },
  messageBubble: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '12px',
  },
  userBubble: {
    flexDirection: 'row-reverse',
  },
  assistantBubble: {
    flexDirection: 'row',
  },
  aiAvatar: {
    width: '32px',
    height: '32px',
    background: '#f3f4f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    flexShrink: 0,
  },
  userAvatar: {
    fontSize: '24px',
    flexShrink: 0,
  },
  messageContent: {
    maxWidth: '80%',
    padding: '14px 18px',
    borderRadius: '12px',
  },
  userContent: {
    background: '#fee2e2',
    color: '#111827',
    borderBottomRightRadius: '4px',
  },
  assistantContent: {
    background: '#f3f4f6',
    color: '#111827',
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
    fontSize: '14px',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: '12px',
    fontSize: '14px',
    background: '#fee2e2',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  optionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '14px',
    justifyContent: 'center',
  },
  optionButton: {
    padding: '12px 22px',
    fontSize: '14px',
    fontWeight: '500',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.15s ease',
  },
  otherInputContainer: {
    marginBottom: '14px',
  },
  otherLabel: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '10px',
    textAlign: 'center',
  },
  suggestionsContainer: {
    marginBottom: '12px',
  },
  suggestionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  suggestionChip: {
    padding: '10px 16px',
    fontSize: '13px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.15s ease',
  },
  generateButton: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '15px',
    fontWeight: '500',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.15s ease',
  },
  inputSection: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    background: '#fff',
    color: '#111827',
  },
  sendButton: {
    width: '50px',
    height: '50px',
    fontSize: '18px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
};

export default Chat;
