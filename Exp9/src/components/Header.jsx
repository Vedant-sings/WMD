import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  AlertTriangle,
  LifeBuoy,
  BarChart3,
  Sun,
  Moon,
  RefreshCw,
  Plus,
  Download,
} from 'lucide-react';

export function Header({
  currentRoute,
  onNavigate,
  gapCount,
  theme,
  onToggleTheme,
  onRefresh,
  loading,
  onOpenAddModal,
  onExportCSV,
}) {
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students Directory', icon: Users },
    { id: 'gap-alerts', label: 'Gap Alerts', icon: AlertTriangle, badge: gapCount },
    { id: 'support', label: 'Support & Mentoring', icon: LifeBuoy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        {/* Brand Logo & Name */}
        <div className="header-left">
          <div className="brand-badge" aria-hidden="true">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="brand-title">CourseGap Companion Pro</h1>
            <p className="brand-subtitle">
              Academic Intervention, Attendance Monitoring & Learning Gap Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Exp3 + Pro Additions) */}
        <nav className="header-nav" aria-label="Main Navigation">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentRoute === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(tab.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="nav-badge-pill" aria-label={`${tab.badge} gaps`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls (Exp4 theme, refresh, add + Pro export) */}
        <div className="header-right">
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onExportCSV}
            title="Export Students Roster to CSV"
            aria-label="Export Students to CSV"
          >
            <Download size={16} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-icon-text"
            onClick={onRefresh}
            title="Refresh student records from server"
            disabled={loading}
            aria-label="Refresh student records"
          >
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            <span className="hide-mobile">Refresh</span>
          </button>

          <button
            type="button"
            className="btn btn-icon"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Toggle Theme (Current: ${theme})`}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-icon-text"
            onClick={onOpenAddModal}
            aria-label="Enroll New Student"
          >
            <Plus size={17} />
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
