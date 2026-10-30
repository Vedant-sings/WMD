/**
 * Default Seed Data and Academic Subject Catalogs for CourseGap Companion Pro
 */

export const DEFAULT_STUDENTS = [
  {
    id: 'STU101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.edu',
    semester: 4,
    course: 'Computer Science & Engineering',
    status: 'On Track',
    attendance: 92,
    marks: 88,
    gaps: 0,
    notes: 'Consistently strong performance in algorithmic lab sessions.',
    subjects: [
      { code: 'CS401', name: 'Data Structures & Algorithms', marks: 88, attendance: 94, gap: false },
      { code: 'CS402', name: 'Database Management Systems', marks: 85, attendance: 90, gap: false },
      { code: 'CS403', name: 'Operating Systems', marks: 86, attendance: 92, gap: false },
      { code: 'MA401', name: 'Discrete Mathematics', marks: 93, attendance: 92, gap: false }
    ]
  },
  {
    id: 'STU102',
    name: 'Priya Nair',
    email: 'priya.nair@example.edu',
    semester: 4,
    course: 'Information Technology',
    status: 'Needs Attention',
    attendance: 74,
    marks: 62,
    gaps: 2,
    notes: 'Low attendance in Database Systems. Needs remedial sessions.',
    subjects: [
      { code: 'IT401', name: 'Object-Oriented Analysis', marks: 78, attendance: 82, gap: false },
      { code: 'IT402', name: 'Database Systems', marks: 48, attendance: 68, gap: true },
      { code: 'IT403', name: 'Computer Networks', marks: 64, attendance: 72, gap: true },
      { code: 'MA402', name: 'Applied Probability & Stats', marks: 58, attendance: 74, gap: false }
    ]
  },
  {
    id: 'STU103',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@example.edu',
    semester: 6,
    course: 'Computer Science & Engineering',
    status: 'At Risk',
    attendance: 58,
    marks: 44,
    gaps: 3,
    notes: 'Missed internal assessments 1 and 2. Counseling requested.',
    subjects: [
      { code: 'CS601', name: 'Compiler Design', marks: 42, attendance: 54, gap: true },
      { code: 'CS602', name: 'Distributed Systems', marks: 46, attendance: 58, gap: true },
      { code: 'CS603', name: 'Cloud Architecture', marks: 39, attendance: 60, gap: true },
      { code: 'CS604', name: 'Information Security', marks: 51, attendance: 60, gap: false }
    ]
  },
  {
    id: 'STU104',
    name: 'Ananya Verma',
    email: 'ananya.v@example.edu',
    semester: 6,
    course: 'Electronics & Communication',
    status: 'On Track',
    attendance: 96,
    marks: 91,
    gaps: 0,
    notes: 'Exemplary capstone project progress and high lab dedication.',
    subjects: [
      { code: 'EC601', name: 'Digital Signal Processing', marks: 94, attendance: 98, gap: false },
      { code: 'EC602', name: 'VLSI Design & Technology', marks: 89, attendance: 95, gap: false },
      { code: 'EC603', name: 'Wireless Communication', marks: 92, attendance: 96, gap: false },
      { code: 'EC604', name: 'Embedded Microcontrollers', marks: 89, attendance: 95, gap: false }
    ]
  },
  {
    id: 'STU105',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@example.edu',
    semester: 2,
    course: 'Computer Science & Engineering',
    status: 'Needs Attention',
    attendance: 71,
    marks: 69,
    gaps: 1,
    notes: 'Struggles with Discrete Math problem sets.',
    subjects: [
      { code: 'CS201', name: 'Programming in C++', marks: 78, attendance: 76, gap: false },
      { code: 'CS202', name: 'Digital Circuit Logic', marks: 74, attendance: 75, gap: false },
      { code: 'MA201', name: 'Discrete Mathematics', marks: 49, attendance: 66, gap: true },
      { code: 'PH201', name: 'Engineering Physics', marks: 75, attendance: 67, gap: false }
    ]
  },
  {
    id: 'STU106',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.edu',
    semester: 2,
    course: 'Artificial Intelligence & Data Science',
    status: 'On Track',
    attendance: 89,
    marks: 85,
    gaps: 0,
    notes: 'Active participant in seminar discussions and AI hackathon team.',
    subjects: [
      { code: 'AI201', name: 'Foundations of AI', marks: 88, attendance: 90, gap: false },
      { code: 'AI202', name: 'Data Structures in Python', marks: 84, attendance: 88, gap: false },
      { code: 'MA202', name: 'Linear Algebra & Optimization', marks: 82, attendance: 86, gap: false },
      { code: 'AI203', name: 'Ethics & Governance in Tech', marks: 86, attendance: 92, gap: false }
    ]
  },
  {
    id: 'STU107',
    name: 'Devansh Gupta',
    email: 'devansh.g@example.edu',
    semester: 4,
    course: 'Information Technology',
    status: 'At Risk',
    attendance: 61,
    marks: 49,
    gaps: 3,
    notes: 'Attendance warning issued to guardian. Remedial tutoring recommended.',
    subjects: [
      { code: 'IT401', name: 'Object-Oriented Analysis', marks: 46, attendance: 60, gap: true },
      { code: 'IT402', name: 'Database Systems', marks: 43, attendance: 58, gap: true },
      { code: 'IT403', name: 'Computer Networks', marks: 47, attendance: 62, gap: true },
      { code: 'MA402', name: 'Applied Probability & Stats', marks: 60, attendance: 64, gap: false }
    ]
  }
];

export const DEFAULT_SUPPORT_REQUESTS = [
  {
    id: 'REQ-101',
    studentId: 'STU103',
    studentName: 'Rohan Deshmukh',
    studentEmail: 'rohan.d@example.edu',
    subjectCode: 'CS601',
    issueCategory: 'Remedial Classes',
    urgency: 'High',
    status: 'In Review',
    description: 'Struggles with parser table construction algorithms and missed internal evaluation #1 due to medical emergency.',
    timestamp: '2026-10-28T14:20:00.000Z'
  },
  {
    id: 'REQ-102',
    studentId: 'STU102',
    studentName: 'Priya Nair',
    studentEmail: 'priya.nair@example.edu',
    subjectCode: 'IT402',
    issueCategory: 'Attendance Rectification',
    urgency: 'Medium',
    status: 'Pending',
    description: "Medical certificates submitted to Dean's office for 4 days missed during viral recovery. Attendance not yet reflected.",
    timestamp: '2026-10-29T10:15:00.000Z'
  }
];

export const COURSE_OPTIONS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Electrical & Electronics'
];

export const SUBJECT_PRESETS = {
  'Computer Science & Engineering': [
    { code: 'CS101', name: 'Programming Fundamentals' },
    { code: 'CS201', name: 'Object Oriented Programming' },
    { code: 'CS301', name: 'Computer Architecture' },
    { code: 'CS401', name: 'Data Structures & Algorithms' },
    { code: 'CS402', name: 'Database Management Systems' },
    { code: 'CS403', name: 'Operating Systems' },
    { code: 'CS501', name: 'Theory of Computation' },
    { code: 'CS601', name: 'Compiler Design' },
    { code: 'CS602', name: 'Distributed Systems' }
  ],
  'Information Technology': [
    { code: 'IT101', name: 'Information Systems' },
    { code: 'IT201', name: 'Web Programming' },
    { code: 'IT401', name: 'Object-Oriented Analysis' },
    { code: 'IT402', name: 'Database Systems' },
    { code: 'IT403', name: 'Computer Networks' },
    { code: 'IT601', name: 'Cloud Computing' }
  ],
  'Artificial Intelligence & Data Science': [
    { code: 'AI101', name: 'Python for Data Science' },
    { code: 'AI201', name: 'Foundations of AI' },
    { code: 'AI301', name: 'Machine Learning' },
    { code: 'AI401', name: 'Deep Learning & Neural Networks' }
  ],
  'Electronics & Communication': [
    { code: 'EC101', name: 'Basic Electronics' },
    { code: 'EC201', name: 'Electronic Circuits' },
    { code: 'EC601', name: 'Digital Signal Processing' },
    { code: 'EC602', name: 'VLSI Design & Technology' }
  ],
  'Electrical & Electronics': [
    { code: 'EE101', name: 'Circuit Theory' },
    { code: 'EE201', name: 'Power Systems' },
    { code: 'EE301', name: 'Control Systems' }
  ]
};
