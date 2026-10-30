/**
 * Export Utilities for CourseGap Companion Pro
 */

export function exportStudentsToCSV(students) {
  if (!students || students.length === 0) return;

  const headers = ['ID', 'Name', 'Email', 'Course', 'Semester', 'Status', 'Attendance (%)', 'Marks (%)', 'Course Gaps', 'Notes'];

  const rows = students.map((s) => [
    `"${s.id}"`,
    `"${s.name}"`,
    `"${s.email}"`,
    `"${s.course}"`,
    s.semester,
    `"${s.status}"`,
    s.attendance,
    s.marks,
    s.gaps,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CourseGap_Students_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportGapAlertsToCSV(students) {
  const alerts = [];
  students.forEach((student) => {
    (student.subjects || []).forEach((subject) => {
      const isGapFlagged = subject.gap === true;
      const isLowMarks = subject.marks < 50;
      const isLowAttendance = subject.attendance < 75;

      if (isGapFlagged || isLowMarks || isLowAttendance) {
        const reasons = [];
        if (isGapFlagged) reasons.push('Gap Flagged');
        if (isLowMarks) reasons.push(`Low Marks (${subject.marks}%)`);
        if (isLowAttendance) reasons.push(`Low Attendance (${subject.attendance}%)`);

        alerts.push({
          studentId: student.id,
          studentName: student.name,
          email: student.email,
          course: student.course,
          subjectCode: subject.code,
          subjectName: subject.name,
          marks: subject.marks,
          attendance: subject.attendance,
          reasons: reasons.join('; '),
        });
      }
    });
  });

  if (alerts.length === 0) return;

  const headers = ['Student ID', 'Student Name', 'Email', 'Course', 'Subject Code', 'Subject Name', 'Marks (%)', 'Attendance (%)', 'Risk Triggers'];

  const rows = alerts.map((a) => [
    `"${a.studentId}"`,
    `"${a.studentName}"`,
    `"${a.email}"`,
    `"${a.course}"`,
    `"${a.subjectCode}"`,
    `"${a.subjectName}"`,
    a.marks,
    a.attendance,
    `"${a.reasons}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CourseGap_Academic_Alerts_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
