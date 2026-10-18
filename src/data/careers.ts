export interface CareerCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const CAREER_CATEGORIES: CareerCategory[] = [
  {
    id: 'technology',
    label: 'Science & Technology',
    icon: 'Cpu',
    color: 'indigo',
    description: 'Software development, IT support, electronics, robotics, and emerging digital innovations.',
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Allied Health',
    icon: 'HeartPulse',
    color: 'rose',
    description: 'Nursing, pharmacy, emergency medical response, lab diagnostics, and community health services.',
  },
  {
    id: 'education',
    label: 'Teaching & Education',
    icon: 'GraduationCap',
    color: 'amber',
    description: 'School teaching, vocational training, early childhood care, special education, and digital tutoring.',
  },
  {
    id: 'agriculture',
    label: 'Agriculture & Agritech',
    icon: 'Sprout',
    color: 'emerald',
    description: 'Precision farming, dairy management, organic horticulture, drone spraying, and soil testing.',
  },
  {
    id: 'environment',
    label: 'Environmental & Sustainability',
    icon: 'Leaf',
    color: 'teal',
    description: 'Solar panel installation, rainwater harvesting, biogas maintenance, and forest conservation.',
  },
  {
    id: 'trades',
    label: 'Skilled Trades & Technical',
    icon: 'Wrench',
    color: 'orange',
    description: 'Electrician work, plumbing, welding, automotive repair, CNC machining, and building maintenance.',
  },
  {
    id: 'business',
    label: 'Business & Entrepreneurship',
    icon: 'Briefcase',
    color: 'blue',
    description: 'Rural retail, micro-enterprise setup, digital marketing, self-help group ventures, and sales.',
  },
  {
    id: 'creative',
    label: 'Creative Arts, Design & Media',
    icon: 'Palette',
    color: 'purple',
    description: 'Graphic design, video editing, local journalism, handicraft design, and vernacular content creation.',
  },
  {
    id: 'hospitality',
    label: 'Hospitality & Tourism',
    icon: 'Utensils',
    color: 'pink',
    description: 'Eco-tourism guiding, culinary arts, homestay management, hotel front-office, and event catering.',
  },
  {
    id: 'finance',
    label: 'Banking, Finance & Accounting',
    icon: 'Landmark',
    color: 'cyan',
    description: 'Bank correspondence (BC), microfinance operations, GST & Tally accounting, and insurance advisory.',
  },
  {
    id: 'community',
    label: 'Community Services & Social Work',
    icon: 'Users',
    color: 'violet',
    description: 'Panchayat coordination, NGO project management, child welfare, elder care, and SHG facilitation.',
  },
  {
    id: 'manufacturing',
    label: 'Logistics, Manufacturing & Industry',
    icon: 'Factory',
    color: 'slate',
    description: 'Warehouse operation, supply chain dispatch, food processing, packaging technology, and textile production.',
  },
];

export function getCategoryById(id: string): CareerCategory | undefined {
  return CAREER_CATEGORIES.find((cat) => cat.id === id);
}

export function getAllCategoryIds(): string[] {
  return CAREER_CATEGORIES.map((cat) => cat.id);
}
