import { useNavigate } from 'react-router-dom';

function Card({ item, size = 'medium' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/item/${item.id}`);
  };

  const cardStyle = size === 'large' ? styles.cardLarge : styles.card;

  return (
    <div style={cardStyle} onClick={handleClick}>
      {/* Category Badge */}
      <span style={styles.badge}>{item.category}</span>
      
      {/* Title */}
      <h3 style={styles.title}>{item.title}</h3>
      
      {/* Description */}
      <p style={styles.description}>{item.description}</p>
      
      {/* Meta Info */}
      <div style={styles.meta}>
        {item.date && <span style={styles.metaItem}>📅 {item.date}</span>}
        {item.readTime && <span style={styles.metaItem}>⏱️ {item.readTime}</span>}
        {item.duration && <span style={styles.metaItem}>⏱️ {item.duration}</span>}
        {item.type && <span style={styles.metaTag}>{item.type}</span>}
      </div>
    </div>
  );
}

const styles = {
  card: {
    minWidth: '280px',
    maxWidth: '280px',
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
    transition: 'transform 0.2s, box-shadow 0.2s',
    flexShrink: 0,
  },
  cardLarge: {
    minWidth: '320px',
    maxWidth: '320px',
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
    transition: 'transform 0.2s, box-shadow 0.2s',
    flexShrink: 0,
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    background: '#e8f4fd',
    color: '#1976d2',
    borderRadius: '4px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    margin: '0 0 8px',
    lineHeight: '1.4',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 12px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '12px',
    color: '#888',
  },
  metaTag: {
    fontSize: '11px',
    padding: '3px 8px',
    background: '#f5f5f5',
    borderRadius: '4px',
    color: '#666',
    textTransform: 'capitalize',
  },
};

export default Card;
