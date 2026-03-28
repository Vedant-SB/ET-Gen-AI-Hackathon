import { useNavigate } from 'react-router-dom';
import Card from './Card';

function SectionRow({ title, items, sectionKey, showViewAll = true }) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate(`/section/${sectionKey}`);
  };

  return (
    <section style={styles.section}>
      {/* Section Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>
        {showViewAll && (
          <button style={styles.viewAllBtn} onClick={handleViewAll}>
            View All →
          </button>
        )}
      </div>

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
    color: '#1a1a2e',
    margin: 0,
  },
  viewAllBtn: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    background: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s',
  },
  scrollContainer: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
    scrollbarWidth: 'thin',
  },
};

export default SectionRow;
