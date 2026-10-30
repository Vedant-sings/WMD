import React from 'react';

export default function Header({ currentRoute, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Students Directory' },
    { id: 'support', label: 'Support & Assistance' },
  ];

  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="header-brand">
          <div className="logo-badge" aria-hidden="true">CG</div>
          <div>
            <h1 className="brand-title">CourseGap Companion</h1>
            <p className="brand-subtitle">Academic Progress & Early Intervention Dashboard</p>
          </div>
        </div>

        <nav aria-label="Main Navigation">
          <ul className="nav-links" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {navItems.map((item) => (
              <li key={item.id} style={{ display: 'inline-block' }}>
                <button
                  type="button"
                  className={`nav-btn ${currentRoute === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                  aria-current={currentRoute === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
