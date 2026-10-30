import React from 'react';
import { UserCheck, Award, TrendingUp, AlertCircle } from 'lucide-react';

export const DashboardStats = React.memo(function DashboardStats({ stats }) {
  const { totalStudents, avgAttendance, avgMarks, totalGaps, onTrackCount, atRiskCount } = stats;

  const cards = [
    {
      title: 'Total Enrolled',
      value: totalStudents,
      subtitle: `${onTrackCount} on track`,
      icon: Award,
      badgeColor: 'badge-blue',
      iconColor: 'text-blue',
    },
    {
      title: 'Cohort Attendance',
      value: `${avgAttendance}%`,
      subtitle: avgAttendance >= 75 ? 'Meets mandatory 75%' : 'Below 75% threshold',
      icon: UserCheck,
      badgeColor: avgAttendance >= 75 ? 'badge-green' : 'badge-amber',
      iconColor: avgAttendance >= 75 ? 'text-green' : 'text-amber',
    },
    {
      title: 'Average Marks',
      value: `${avgMarks}%`,
      subtitle: avgMarks >= 50 ? 'Satisfactory passing track' : 'Academic gap warning',
      icon: TrendingUp,
      badgeColor: avgMarks >= 70 ? 'badge-green' : avgMarks >= 50 ? 'badge-blue' : 'badge-red',
      iconColor: 'text-purple',
    },
    {
      title: 'Active Course Gaps',
      value: totalGaps,
      subtitle: `${atRiskCount} at-risk students`,
      icon: AlertCircle,
      badgeColor: totalGaps > 0 ? 'badge-red' : 'badge-green',
      iconColor: totalGaps > 0 ? 'text-red' : 'text-green',
    },
  ];

  return (
    <div className="stats-grid" role="region" aria-label="Academic Performance Summary">
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
