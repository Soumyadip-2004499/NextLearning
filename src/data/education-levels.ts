export interface EducationLevelOption {
  value: string;
  label: string;
  shortLabel?: string;
  category: 'school' | 'vocational' | 'higher_education';
  description: string;
}

export const EDUCATION_LEVELS: EducationLevelOption[] = [
  {
    value: 'class_8',
    label: 'Class 8 (Middle School)',
    shortLabel: 'Class 8',
    category: 'school',
    description: 'Completed or pursuing Class 8; exploring foundational vocational and technical skills.',
  },
  {
    value: 'class_9',
    label: 'Class 9',
    shortLabel: 'Class 9',
    category: 'school',
    description: 'Entering secondary education; building core academic foundations and career interests.',
  },
  {
    value: 'class_10',
    label: 'Class 10 (Secondary / Matriculation)',
    shortLabel: 'Class 10',
    category: 'school',
    description: 'Matriculation level; key transition point for streams, ITI trades, or polytechnic diplomas.',
  },
  {
    value: 'class_11',
    label: 'Class 11 (Higher Secondary - 1st Year)',
    shortLabel: 'Class 11',
    category: 'school',
    description: 'Stream-specific study in Science, Commerce, Arts/Humanities, or Vocational subjects.',
  },
  {
    value: 'class_12',
    label: 'Class 12 (Higher Secondary / Intermediate)',
    shortLabel: 'Class 12',
    category: 'school',
    description: 'Senior secondary completion; gateway to degree colleges, university entrance tests, and professional certifications.',
  },
  {
    value: 'vocational_iti',
    label: 'ITI / Vocational Training Certificate',
    shortLabel: 'ITI Certificate',
    category: 'vocational',
    description: 'Industrial Training Institute trades (Electrician, Fitter, Welder, COPA, Automotive).',
  },
  {
    value: 'polytechnic_diploma',
    label: 'Polytechnic Diploma (Engineering / Technical)',
    shortLabel: 'Polytechnic Diploma',
    category: 'vocational',
    description: '3-year applied technical diploma in Civil, Mechanical, Electrical, Computer, or Chemical.',
  },
  {
    value: 'undergraduate',
    label: "Bachelor's Degree / Graduation (Pursuing/Completed)",
    shortLabel: "Bachelor's Degree",
    category: 'higher_education',
    description: 'BA, BSc, BCom, BTech, BCA, BBA, BVoc, or equivalent undergraduate degrees.',
  },
  {
    value: 'postgraduate',
    label: "Master's Degree / Post-Graduation",
    shortLabel: "Master's Degree",
    category: 'higher_education',
    description: 'MA, MSc, MCom, MTech, MCA, MBA, or equivalent postgraduate diplomas and degrees.',
  },
  {
    value: 'open_school',
    label: 'Open Schooling (NIOS / State Open School)',
    shortLabel: 'Open Schooling',
    category: 'school',
    description: 'Flexible distance secondary or senior secondary education through NIOS or state boards.',
  },
];

export function getEducationLevel(value: string): EducationLevelOption | undefined {
  return EDUCATION_LEVELS.find((lvl) => lvl.value === value);
}

export function formatEducationLevel(value: string): string {
  const match = getEducationLevel(value);
  return match ? match.label : value;
}
