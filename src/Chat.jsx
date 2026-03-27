import { useState } from 'react';
import axios from 'axios';

function Chat() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setError('');
    setLoading(true);

    // Add user message to history
    const newHistory = [...history, { role: 'user', content: userMessage }];
    setHistory(newHistory);

    try {
      const response = await axios.post('http://127.0.0.1:5000/chat', {
        message: userMessage,
        history: newHistory,
      });

      // Add AI response to history
      setHistory([...newHistory, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      setError('Failed to get response. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ET AI Concierge</h1>

      {/* Chat Messages */}
      <div style={styles.chatBox}>
        {history.length === 0 && (
          <p style={styles.placeholder}>Start a conversation...</p>
        )}
        {history.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage),
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <p style={styles.messageText}>{msg.content}</p>
          </div>
        ))}
        {loading && <p style={styles.loading}>AI is thinking...</p>}
      </div>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Input Section */}
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
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          style={styles.button}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  chatBox: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    height: '400px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
    marginBottom: '15px',
  },
  placeholder: {
    color: '#999',
    textAlign: 'center',
    marginTop: '180px',
  },
  message: {
    marginBottom: '12px',
    padding: '10px',
    borderRadius: '8px',
  },
  userMessage: {
    backgroundColor: '#e3f2fd',
    textAlign: 'right',
  },
  assistantMessage: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
  },
  messageText: {
    margin: '5px 0 0 0',
    whiteSpace: 'pre-wrap',
  },
  loading: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  },
  inputSection: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default Chat;
