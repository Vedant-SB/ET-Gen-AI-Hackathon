import { useNavigate } from 'react-router-dom';
import Card from './Card';

function SectionRow({ title, items, sectionKey, showViewAll = true, hideTitle = false }) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate(`/section/${sectionKey}`);
  };

  return (
    <section style={styles.section}>
      {/* Section Header */}
      {!hideTitle && (
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          {showViewAll && (
            <button 
              style={styles.viewAllBtn} 
              onClick={handleViewAll}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#dc2626';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              View All
            </button>
          )}
        </div>
      )}

      {/* Horizontal Scroll Container */}
      <div style={styles.scrollContainer}>
        {items.slice(0, 5).map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    marginBottom: '32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  viewAllBtn: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    background: 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#dc2626',
    transition: 'all 0.15s ease',
  },
  scrollContainer: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
};

export default SectionRow;
