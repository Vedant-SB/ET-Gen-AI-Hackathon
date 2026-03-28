import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from './data';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = getItemById(id);

  if (!item) {
    return (
      <div style={styles.container}>
        <div style={styles.notFound}>
          <h2>Item not found</h2>
          <p>The item you're looking for doesn't exist.</p>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const getActionText = () => {
    switch (item.category) {
      case 'event': return '📅 Register Now';
      case 'course': return '🎓 Enroll Now';
      case 'market': return '📈 View Details';
      default: return '📖 Read More';
    }
  };

  const getCategoryColor = () => {
    switch (item.category) {
      case 'event': return '#FF6B35';
      case 'course': return '#9C27B0';
      case 'market': return '#4CAF50';
      default: return '#1976d2';
    }
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Content Card */}
      <div style={styles.card}>
        {/* Category Badge */}
        <span style={{ ...styles.badge, background: getCategoryColor() }}>
          {item.category}
        </span>

        {/* Title */}
        <h1 style={styles.title}>{item.title}</h1>

        {/* Meta Info */}
        <div style={styles.metaRow}>
          {item.date && (
            <span style={styles.metaItem}>
              📅 {item.date}
            </span>
          )}
          {item.type && (
            <span style={styles.metaItem}>
              🏷️ {item.type}
            </span>
          )}
          {item.readTime && (
            <span style={styles.metaItem}>
              ⏱️ {item.readTime}
            </span>
          )}
          {item.duration && (
            <span style={styles.metaItem}>
              ⏱️ {item.duration}
            </span>
          )}
        </div>

        {/* Description */}
        <div style={styles.descriptionSection}>
          <h3 style={styles.sectionTitle}>About</h3>
          <p style={styles.description}>{item.description}</p>
          
          {/* Extended description for demo */}
          <p style={styles.description}>
            This is an excellent opportunity to expand your knowledge and stay updated 
            with the latest trends in {item.category === 'course' ? 'learning and development' : 
            item.category === 'event' ? 'industry gatherings' : 
            item.category === 'market' ? 'financial markets' : 'premium content'}.
          </p>
        </div>

        {/* Action Button */}
        <button style={styles.actionBtn}>
          {getActionText()}
        </button>

        {/* Share Section */}
        <div style={styles.shareSection}>
          <span style={styles.shareLabel}>Share:</span>
          <button style={styles.shareBtn}>📧 Email</button>
          <button style={styles.shareBtn}>🔗 Copy Link</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fc',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '24px',
  },
  notFound: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  backBtn: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px',
  },
  card: {
    maxWidth: '800px',
    background: '#fff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#fff',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 16px',
    lineHeight: '1.3',
  },
  metaRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #eee',
  },
  metaItem: {
    fontSize: '14px',
    color: '#666',
  },
  descriptionSection: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 12px',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.7',
    margin: '0 0 16px',
  },
  actionBtn: {
    width: '100%',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '24px',
  },
  shareSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  shareLabel: {
    fontSize: '14px',
    color: '#888',
  },
  shareBtn: {
    padding: '8px 16px',
    fontSize: '13px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#555',
  },
};

export default DetailPage;
