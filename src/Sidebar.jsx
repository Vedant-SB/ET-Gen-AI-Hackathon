import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/home', label: 'Home', icon: '🏠' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

const exploreItems = [
  { path: '/section/prime', label: 'ET Prime', icon: '📰' },
  { path: '/section/markets', label: 'ET Markets', icon: '📈' },
  { path: '/section/masterclasses', label: 'Masterclasses', icon: '🎓' },
  { path: '/section/events', label: 'Events', icon: '📅' },
  { path: '/section/wealth', label: 'Wealth', icon: '💰' },
  { path: '/section/industry', label: 'Industry', icon: '🏭' },
];

function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>🧭</span>
        <span style={styles.logoText}>ET Navigator</span>
      </div>

      {/* Main Nav */}
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Explore Section */}
      <div style={styles.sectionLabel}>Explore ET</div>
      <nav style={styles.nav}>
        {exploreItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>© 2024 ET Navigator</p>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: '#1a1a2e',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
  },
  nav: {
    padding: '12px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navItemActive: {
    background: 'rgba(102, 126, 234, 0.2)',
    color: '#fff',
    borderRight: '3px solid #667eea',
  },
  navIcon: {
    fontSize: '18px',
    width: '24px',
    textAlign: 'center',
  },
  sectionLabel: {
    padding: '16px 20px 8px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.4)',
  },
  footer: {
    marginTop: 'auto',
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  footerText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },
};

export default Sidebar;
