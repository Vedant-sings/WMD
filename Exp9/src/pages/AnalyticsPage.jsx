import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Users } from 'lucide-react';
import { COURSE_OPTIONS } from '../data/defaultData';

export function AnalyticsPage({ students }) {
  // Course-level aggregations
  const courseAnalytics = useMemo(() => {
    return COURSE_OPTIONS.map((course) => {
      const match = students.filter((s) => s.course === course);
      if (match.length === 0) {
        return { course, count: 0, avgAttendance: 0, avgMarks: 0, gaps: 0 };
      }
      const totalAtt = match.reduce((a, c) => a + (Number(c.attendance) || 0), 0);
      const totalMarks = match.reduce((a, c) => a + (Number(c.marks) || 0), 0);
      const gaps = match.reduce((a, c) => a + (Number(c.gaps) || 0), 0);

      return {
        course,
        count: match.length,
        avgAttendance: Math.round(totalAtt / match.length),
        avgMarks: Math.round(totalMarks / match.length),
        gaps,
      };
    }).filter((c) => c.count > 0);
  }, [students]);

  // Risk Distribution Tier computation
  const riskDistribution = useMemo(() => {
    let honors = 0;
    let standard = 0;
    let attention = 0;
    let critical = 0;

    students.forEach((s) => {
      const compositeScore = (Number(s.marks) + Number(s.attendance)) / 2;
      if (compositeScore >= 85 && s.gaps === 0) {
        honors++;
      } else if (compositeScore >= 70 && s.attendance >= 75) {
        standard++;
      } else if (compositeScore >= 50 && s.attendance >= 65) {
        attention++;
      } else {
        critical++;
      }
    });

    return { honors, standard, attention, critical };
  }, [students]);

  // Semester breakdown
  const semesterBreakdown = useMemo(() => {
    const semMap = {};
    students.forEach((s) => {
      const sem = `Semester ${s.semester}`;
      if (!semMap[sem]) {
        semMap[sem] = { total: 0, attendanceSum: 0, marksSum: 0 };
      }
      semMap[sem].total++;
      semMap[sem].attendanceSum += Number(s.attendance) || 0;
      semMap[sem].marksSum += Number(s.marks) || 0;
    });

    return Object.entries(semMap).map(([sem, data]) => ({
      sem,
      total: data.total,
      avgAttendance: Math.round(data.attendanceSum / data.total),
      avgMarks: Math.round(data.marksSum / data.total),
    }));
  }, [students]);

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <h2 className="page-title">Academic Analytics & Risk Matrix</h2>
          <p className="page-description">
            Cohort-wide statistical comparisons, branch health indices, and predictive early-warning distributions.
          </p>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Card 1: Department / Branch Performance */}
        <section aria-labelledby="branch-heading" className="analytics-card">
          <div className="section-title-wrap">
            <h3 id="branch-heading" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 className="text-blue" size={20} />
              <span>Department Cohort Health</span>
            </h3>
          </div>

          <div>
            {courseAnalytics.map((c) => (
              <div key={c.course} className="analytics-bar-item">
                <div className="analytics-bar-label">
                  <span>{c.course} ({c.count} students)</span>
                  <span>{c.avgMarks}% Marks • {c.avgAttendance}% Att</span>
                </div>
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar-val"
                    style={{
                      width: `${c.avgMarks}%`,
                      backgroundColor: c.avgMarks < 60 ? 'var(--color-danger)' : 'var(--primary-blue)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card 2: Composite Risk Matrix */}
        <section aria-labelledby="risk-heading" className="analytics-card">
          <div className="section-title-wrap">
            <h3 id="risk-heading" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck className="text-green" size={20} />
              <span>Academic Performance Tiers</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ color: 'var(--color-success)', display: 'block', fontSize: '0.92rem' }}>
                  Dean's Honors Tier (&gt;85% composite)
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No academic gaps, attendance &gt;90%</span>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)' }}>
                {riskDistribution.honors}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--primary-blue-light)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ color: 'var(--primary-blue)', display: 'block', fontSize: '0.92rem' }}>
                  Satisfactory Standing (70% - 84%)
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Healthy examination outcomes</span>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                {riskDistribution.standard}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--color-warning-bg)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ color: 'var(--color-warning)', display: 'block', fontSize: '0.92rem' }}>
                  Needs Attention (50% - 69%)
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Borderline attendance or marks</span>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                {riskDistribution.attention}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ color: 'var(--color-danger)', display: 'block', fontSize: '0.92rem' }}>
                  Critical At-Risk Tier (&lt;50% marks or &lt;75% att)
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target for counseling & remedial plans</span>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-danger)' }}>
                {riskDistribution.critical}
              </span>
            </div>
          </div>
        </section>

        {/* Card 3: Semester Progress Progression */}
        <section aria-labelledby="sem-heading" className="analytics-card" style={{ gridColumn: '1 / -1' }}>
          <div className="section-title-wrap">
            <h3 id="sem-heading" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp className="text-purple" size={20} />
              <span>Semester-wise Average Metric Overview</span>
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {semesterBreakdown.map((s) => (
              <div
                key={s.sem}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  {s.sem}
                </strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  Enrolled: {s.total} students
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Avg Marks:</span>
                  <strong style={{ color: s.avgMarks < 60 ? 'var(--color-danger)' : 'var(--text-main)' }}>
                    {s.avgMarks}%
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  <span>Avg Attendance:</span>
                  <strong style={{ color: s.avgAttendance < 75 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {s.avgAttendance}%
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
