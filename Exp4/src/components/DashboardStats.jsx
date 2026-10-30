import React from 'react';
import { UserCheck, AlertTriangle, AlertCircle, Award, TrendingUp, BookOpen } from 'lucide-react';

/* Memoized presentation component */
export const DashboardStats = React.memo(function DashboardStats({ stats }) {
  const { totalStudents, avgAttendance, avgMarks, totalGaps, onTrackCount, atRiskCount } = stats;

  const cards = [
    {
      title: 'Total Students',
      value: totalStudents,
      subtitle: `${onTrackCount} on track`,
      icon: Award,
      badgeColor: 'badge-blue',
      iconColor: 'text-blue',
    },
    {
      title: 'Avg. Attendance',
      value: `${avgAttendance}%`,
      subtitle: avgAttendance >= 75 ? 'Healthy target met' : 'Below 75% threshold',
      icon: UserCheck,
      badgeColor: avgAttendance >= 75 ? 'badge-green' : 'badge-amber',
      iconColor: avgAttendance >= 75 ? 'text-green' : 'text-amber',
    },
    {
      title: 'Avg. Marks',
      value: `${avgMarks}/100`,
      subtitle: 'Across active courses',
      icon: TrendingUp,
      badgeColor: avgMarks >= 70 ? 'badge-green' : 'badge-blue',
      iconColor: 'text-purple',
    },
    {
      title: 'Total Course Gaps',
      value: totalGaps,
      subtitle: `${atRiskCount} at-risk students`,
      icon: AlertCircle,
      badgeColor: totalGaps > 3 ? 'badge-red' : 'badge-green',
      iconColor: totalGaps > 3 ? 'text-red' : 'text-green',
    },
  ];

  return (
    <div className="stats-grid" role="region" aria-label="Dashboard Performance Summary">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div key={idx} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{card.title}</span>
              <span className={`stat-icon-wrapper ${card.iconColor}`}>
                <IconComponent size={20} aria-hidden="true" />
              </span>
            </div>
            <div className="stat-body">
              <span className="stat-value">{card.value}</span>
              <span className={`stat-badge ${card.badgeColor}`}>{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
});
