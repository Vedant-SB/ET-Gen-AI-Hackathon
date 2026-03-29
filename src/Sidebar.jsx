import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import etLogo from './assets/et-logo.png';

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/profile', label: 'Profile' },
];

const exploreItems = [
  { path: '/section/prime', label: 'ET Prime' },
  { path: '/section/markets', label: 'ET Markets' },
  { path: '/section/masterclasses', label: 'Masterclasses' },
  { path: '/section/events', label: 'Events' },
  { path: '/section/startups', label: 'Startups' },
  { path: '/section/technology', label: 'Technology' },
];

function Sidebar({ isOpen, onToggle }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const sidebarWidth = isOpen ? '260px' : '64px';

  const NavItem = ({ item }) => (
    <NavLink
      key={item.path}
      to={item.path}
      style={({ isActive }) => ({
        ...styles.navItem,
        ...(isActive ? styles.navItemActive : {}),
        ...(hoveredItem === item.path && !isActive ? styles.navItemHover : {}),
        justifyContent: isOpen ? 'flex-start' : 'center',
        padding: isOpen ? '12px 16px' : '12px',
      })}
      onMouseEnter={() => setHoveredItem(item.path)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {isOpen && <span>{item.label}</span>}
      {!isOpen && <span style={styles.navDot}>{item.label.charAt(0)}</span>}
    </NavLink>
  );

  return (
    <aside style={{ ...styles.sidebar, width: sidebarWidth }}>
      {/* Header */}
      <div style={styles.header}>
        {isOpen ? (
          <>
            <div style={styles.logo}>
              <img src={etLogo} alt="Economic Times" style={styles.etLogo} />
              <div style={styles.logoTextContainer}>
                <span style={styles.logoText}>Navigator</span>
              </div>
            </div>
            <button style={styles.toggleBtn} onClick={onToggle}>
              ‹
            </button>
          </>
        ) : (
          <button style={styles.toggleBtnCollapsed} onClick={onToggle}>
            <div style={styles.etBadgeSmall}>ET</div>
          </button>
        )}
      </div>

      {/* Main Nav */}
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Explore Section */}
      {isOpen && <div style={styles.sectionLabel}>Explore</div>}
      <nav style={styles.nav}>
        {exploreItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div style={styles.footer}>
          <p style={styles.footerText}>© 2024 ET Navigator</p>
        </div>
      )}
    </aside>
  );
}

const styles = {
  sidebar: {
    minHeight: '100vh',
    background: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'width 0.2s ease',
    overflow: 'hidden',
    zIndex: 100,
  },
  toggleBtnCollapsed: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 16px',
    borderBottom: '1px solid #e5e7eb',
    minHeight: '72px',
  },
  toggleBtn: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    color: '#6b7280',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '6px 10px',
    borderRadius: '6px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  etLogo: {
    height: '24px',
    objectFit: 'contain',
  },
  etBadgeSmall: {
    width: '32px',
    height: '32px',
    background: '#ef4444',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff',
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
  },
  nav: {
    padding: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    margin: '2px 0',
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    background: 'rgba(254, 226, 226, 0.8)',
    color: '#dc2626',
    fontWeight: '600',
  },
  navItemHover: {
    background: '#f3f4f6',
  },
  navDot: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
  },
  sectionLabel: {
    padding: '16px 16px 8px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#9ca3af',
  },
  footer: {
    marginTop: 'auto',
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  footerText: {
    fontSize: '11px',
    color: '#9ca3af',
    margin: 0,
  },
};

export default Sidebar;
