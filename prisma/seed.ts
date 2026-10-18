import { PrismaClient, Role } from '@prisma/client';
import { seedExtendedContent } from '../scripts/seed-extended-content';
import { seed30NewCareers } from '../scripts/seed-30-careers';
import { seedStudentAndFacilitatorCredentials } from '../scripts/seed-student-credentials';
import { seed20KavyaModules } from '../scripts/seed-20-kavya-modules';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NextLearning database seed...');

  // ============================================
  // 1. DEMO SKILLS (34 skills across 4 categories)
  // ============================================
  console.log('📦 Seeding Skills...');
  const skillsData = [
    // Technical (10)
    {
      name: 'Basic Computer Operations',
      category: 'technical',
      description: 'Using operating systems, file management, web browsing, word processing, and spreadsheets.',
    },
    {
      name: 'Frontend Web Development (HTML/CSS/JS)',
      category: 'technical',
      description: 'Building responsive user interfaces with semantic HTML5, modern CSS, and JavaScript.',
    },
    {
      name: 'Smartphone Navigation & App Usage',
      category: 'technical',
      description: 'Navigating mobile operating systems, digital payment portals, and productivity apps.',
    },
    {
      name: 'Tally Prime & GST Accounting',
      category: 'technical',
      description: 'Maintaining double-entry ledgers, stock registers, and filing monthly GSTR reports in Tally.',
    },
    {
      name: 'Agricultural Drone Piloting',
      category: 'technical',
      description: 'Pre-flight calibration, GPS path programming, autonomous spraying, and battery maintenance.',
    },
    {
      name: 'Soil Sample Testing & Chemistry',
      category: 'technical',
      description: 'Collecting soil cores, testing pH, nitrogen, phosphorus, and potassium levels using mini-lab kits.',
    },
    {
      name: 'Solar Panel Testing & Multimeter Operation',
      category: 'technical',
      description: 'Measuring open-circuit voltage, short-circuit current, string continuity, and inverter diagnostics.',
    },
    {
      name: 'Graphic Design (Canva & Photoshop Basics)',
      category: 'technical',
      description: 'Creating promotional banners, social media creatives, brochures, and vernacular posters.',
    },
    {
      name: 'Medical Equipment Sanitization & First Aid',
      category: 'technical',
      description: 'Operating autoclaves, sterilizing instruments, emergency wound dressing, and CPR administration.',
    },
    {
      name: 'Inventory Barcode Scanning & Stock Counting',
      category: 'technical',
      description: 'Using handheld barcode terminals, cycle-counting SKUs, and updating warehouse registers.',
    },

    // Soft Skills (8)
    {
      name: 'Active Listening & Empathy',
      category: 'soft',
      description: 'Understanding community member concerns patiently without prejudice or premature judgment.',
    },
    {
      name: 'Customer Communication & Service',
      category: 'soft',
      description: 'Greeting patrons respectfully, addressing grievances calmly, and providing prompt assistance.',
    },
    {
      name: 'Time Management & Punctuality',
      category: 'soft',
      description: 'Prioritizing daily task lists, meeting scheduled deadlines, and maintaining strict attendance.',
    },
    {
      name: 'Problem Solving & Troubleshooting',
      category: 'soft',
      description: 'Diagnosing root causes logically and formulating cost-effective, practical solutions.',
    },
    {
      name: 'Team Collaboration & Trust Building',
      category: 'soft',
      description: 'Working harmoniously across diverse peer groups, self-help groups, and project crews.',
    },
    {
      name: 'Conflict Resolution & Mediation',
      category: 'soft',
      description: 'De-escalating disagreements through neutral dialogue and community consensus building.',
    },
    {
      name: 'Presentation & Public Speaking',
      category: 'soft',
      description: 'Explaining ideas clearly in village meetings, school assemblies, or formal presentations.',
    },
    {
      name: 'Adaptability & Continuous Learning',
      category: 'soft',
      description: 'Embracing modern digital workflows, evolving market demands, and new technologies eagerly.',
    },

    // Vocational (8)
    {
      name: 'Domestic Electrical Wiring & Safety',
      category: 'vocational',
      description: 'Conduit laying, MCB panel installation, socket fixing, earthing, and shock prevention.',
    },
    {
      name: 'MIG & Manual Metal Arc Welding',
      category: 'vocational',
      description: 'Surface joint preparation, electrode selection, torch control, and weld seam inspection.',
    },
    {
      name: 'Two-Wheeler / Electric Vehicle Servicing',
      category: 'vocational',
      description: 'Brake servicing, engine tuning, EV lithium battery inspection, and wiring harness checks.',
    },
    {
      name: 'Solar PV Array Mounting & Structure Fixing',
      category: 'vocational',
      description: 'Installing tin-shed or RCC roof aluminum railings, clamps, tilt angle alignment, and weatherproofing.',
    },
    {
      name: 'Plumbing & Pipe Fitting',
      category: 'vocational',
      description: 'CPVC/GI piping, water tank installation, leak detection, and sanitary fixture fittings.',
    },
    {
      name: 'Drip Irrigation & Fertigation Setup',
      category: 'vocational',
      description: 'Laying mainline pipelines, dripper spacing, sand filter flushing, and venturi injector setup.',
    },
    {
      name: 'Patient Vital Signs Monitoring',
      category: 'vocational',
      description: 'Measuring blood pressure using sphygmomanometers, blood glucose, pulse oximetry, and temperature.',
    },
    {
      name: 'Food Hygiene & Safe Packaging',
      category: 'vocational',
      description: 'FSSAI standards, clean-room practices, moisture barrier sealers, and label compliance.',
    },

    // Academic (8)
    {
      name: 'Foundational Mathematics & Calculations',
      category: 'academic',
      description: 'Percentages, ratios, unitary method, basic geometry, and mensuration applied to trades.',
    },
    {
      name: 'Science & Physics Fundamentals',
      category: 'academic',
      description: 'Ohm’s law, energy conservation, heat transfer, hydraulics, and elementary mechanical principles.',
    },
    {
      name: 'English Reading & Conversational Basics',
      category: 'academic',
      description: 'Reading equipment manuals, software interfaces, formal letters, and conversational exchanges.',
    },
    {
      name: 'Vernacular Language Fluency & Writing',
      category: 'academic',
      description: 'Drafting clear applications, village notices, and communication in regional mother tongues.',
    },
    {
      name: 'Financial Literacy & Bookkeeping',
      category: 'academic',
      description: 'Interest calculation, simple vs compound rates, profit margins, bank slips, and loan amortization.',
    },
    {
      name: 'Environmental & Ecological Awareness',
      category: 'academic',
      description: 'Water table dynamics, soil degradation, solar energy benefits, and plastic recycling lifecycles.',
    },
    {
      name: 'Civic Governance & Citizen Rights',
      category: 'academic',
      description: 'Understanding Panchayati Raj functions, RTI applications, welfare portals, and entitlement schemes.',
    },
    {
      name: 'Data Interpretation & Record Maintenance',
      category: 'academic',
      description: 'Reading bar charts, progress tables, survey spreadsheets, and maintaining accurate logs.',
    },
  ];

  const skillRecordMap = new Map<string, string>();
  for (const s of skillsData) {
    const record = await prisma.skill.upsert({
      where: { name: s.name },
      update: { category: s.category, description: s.description },
      create: { name: s.name, category: s.category, description: s.description },
    });
    skillRecordMap.set(s.name, record.id);
  }
  console.log(`✅ Seeded ${skillsData.length} skills.`);

  // ============================================
  // 2. DEMO CAREERS (3 per category across 12 categories = 36 total)
  // ============================================
  console.log('💼 Seeding Careers across 12 categories...');

  const careersData = [
    // 1. Science & Technology
    {
      title: 'Junior Frontend Web Developer',
      slug: 'junior-frontend-web-developer',
      category: 'technology',
      description:
        'Builds engaging, responsive websites and web apps for local businesses, schools, and digital agencies using HTML, CSS, and modern JavaScript. Collaborates with UI designers and backend engineers to create user-friendly mobile-first digital solutions. Ideal for creative problem solvers who enjoy visual software construction.',
      requiredSkills: [
        'Frontend Web Development (HTML/CSS/JS)',
        'Basic Computer Operations',
        'Problem Solving & Troubleshooting',
        'English Reading & Conversational Basics',
        'Adaptability & Continuous Learning',
      ],
      requiredQualifications: [
        'Class 12 in any stream (Science or Computer Science preferred)',
        'Polytechnic Diploma in CSE/IT or BCA / BTech, OR certified coding boot camp completion',
      ],
      salaryRange: '₹2,40,000 - ₹4,80,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'Very High (18% projected annual growth in India’s tier-2/3 tech hubs)',
      firstSteps: [
        'Master HTML5 semantic tags, CSS flexbox/grid, and modern ES6 JavaScript syntax.',
        'Build 3 real-world portfolio websites (e.g., local shop catalog, village noticeboard).',
        'Learn Git version control and publish project repositories to GitHub.',
        'Apply for entry-level internships or freelance gigs on platforms like Internshala.',
      ],
      educationPaths: [
        'Class 12 (Science/Vocational) → BCA / BSc Computer Science (3 Years)',
        'Class 10 → 3-Year Polytechnic Diploma in Computer Engineering',
        'Self-taught / Open School + Free online certifications (freeCodeCamp, Swayam, Coursera)',
      ],
      relatedCareers: [
        'hardware-network-technician',
        'data-entry-verification-operator',
        'graphic-designer-print-specialist',
      ],
      sourceUrl: 'https://www.nasscom.in',
    },
    {
      title: 'Hardware & Network Support Technician',
      slug: 'hardware-network-technician',
      category: 'technology',
      description:
        'Assembles, diagnoses, and repairs desktop computers, laptops, local LAN networks, and Wi-Fi routers for schools, offices, and cyber centers. Troubleshoots operating system glitches, installs peripheral drivers, and assists users with network connectivity. A critical, hands-on role powering India’s rural digital infrastructure.',
      requiredSkills: [
        'Basic Computer Operations',
        'Problem Solving & Troubleshooting',
        'Domestic Electrical Wiring & Safety',
        'Customer Communication & Service',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'ITI in Information & Communication Technology System Maintenance (ICTSM) or Hardware & Networking diploma',
      ],
      salaryRange: '₹1,80,000 - ₹3,20,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'High (Rising demand across rural schools, CSCs, and bank branches)',
      firstSteps: [
        'Enroll in an ITI ICTSM trade or CompTIA A+/Network+ equivalent local certification.',
        'Practice assembling and troubleshooting scrap PC towers and crimping RJ45 Ethernet cables.',
        'Learn router setup, IP address configuration, and printer sharing.',
        'Apprentice with a local computer repair shop or district IT vendor.',
      ],
      educationPaths: [
        'Class 10 → 2-Year ITI in ICTSM / Computer Hardware',
        'Class 10 → 3-Year Polytechnic Diploma in Electronics & Communication',
        'Short-term PMKVY hardware technician certification (3 to 6 months)',
      ],
      relatedCareers: [
        'junior-frontend-web-developer',
        'certified-electrician',
        'csc-digital-entrepreneur',
      ],
      sourceUrl: 'https://dgt.gov.in',
    },
    {
      title: 'Data Entry & Digital Verification Operator',
      slug: 'data-entry-verification-operator',
      category: 'technology',
      description:
        'Accurately inputs, reviews, and validates beneficiary information, official records, and database entries on government portals and enterprise software. Verifies supporting identity documents against state databases while upholding strict data privacy standards. Serves as a vital digital liaison in hospitals, tehsils, and banking service hubs.',
      requiredSkills: [
        'Basic Computer Operations',
        'Smartphone Navigation & App Usage',
        'Data Interpretation & Record Maintenance',
        'Time Management & Punctuality',
      ],
      requiredQualifications: [
        'Class 12 pass in any stream',
        'Basic computer certificate (CCC, DCA, or equivalent government certificate) with typing speed of 30+ wpm',
      ],
      salaryRange: '₹1,44,000 - ₹2,40,000 per annum',
      demandLevel: 'medium',
      growthOutlook: 'Moderate (Steady requirement in e-Governance and logistics back-offices)',
      firstSteps: [
        'Attain bilingual typing proficiency (English 30 wpm, Hindi/Regional 25 wpm).',
        'Master spreadsheet operations including lookup formulas, data validation, and deduplication.',
        'Earn the National NIELIT CCC (Course on Computer Concepts) certificate.',
        'Register on government outsourced job boards and regional outsourcing agencies.',
      ],
      educationPaths: [
        'Class 12 → 6-month DCA (Diploma in Computer Applications)',
        'Class 10 → ITI in COPA (Computer Operator and Programming Assistant)',
      ],
      relatedCareers: [
        'junior-tally-gst-accountant',
        'csc-digital-entrepreneur',
        'warehouse-inventory-associate',
      ],
      sourceUrl: 'https://nielit.gov.in',
    },

    // 2. Healthcare & Allied Health
    {
      title: 'General Duty Medical Assistant (GDA)',
      slug: 'general-duty-assistant',
      category: 'healthcare',
      description:
        'Provides compassionate patient bedside care, assists certified nursing staff with daily hygiene, and safely moves immobile patients in rural clinics and community health centers. Monitors essential vital signs like pulse, temperature, and blood pressure and alerts duty doctors during emergencies. Acts as the humane anchor in primary healthcare delivery.',
      requiredSkills: [
        'Patient Vital Signs Monitoring',
        'Medical Equipment Sanitization & First Aid',
        'Active Listening & Empathy',
        'Customer Communication & Service',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass (any stream, Science preferred)',
        'NSDC / Healthcare Sector Skill Council (HSSC) certified GDA diploma (6-12 months)',
      ],
      salaryRange: '₹1,50,000 - ₹2,80,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'Very High (Expanding network of Ayushman Arogya Mandirs and private nursing homes)',
      firstSteps: [
        'Complete a certified 6-month GDA training course affiliated with HSSC or Red Cross.',
        'Undergo mandatory 100-hour hospital clinical internship in patient handling and infection control.',
        'Obtain Basic Life Support (BLS) and CPR certification.',
        'Apply to sub-district hospitals, community health centers, or home eldercare networks.',
      ],
      educationPaths: [
        'Class 10/12 → NSDC Healthcare SSC GDA Certificate (6 months)',
        'Class 12 (Science) → Auxiliary Nurse Midwife (ANM) Diploma (2 Years)',
        'Class 12 (Science) → General Nursing and Midwifery (GNM) (3 Years)',
      ],
      relatedCareers: [
        'pharmacy-assistant',
        'emergency-medical-technician',
        'child-welfare-community-worker',
      ],
      sourceUrl: 'https://healthcare-ssc.in',
    },
    {
      title: 'Pharmacy Assistant & Inventory Clerk',
      slug: 'pharmacy-assistant',
      category: 'healthcare',
      description:
        'Assists registered pharmacists in organizing, dispensing, and inventorying medicines according to formal doctor prescriptions. Manages cold-chain storage for vaccines, checks expiry dates, and enters sales records on pharmacy billing systems. Explains basic dosage schedules and storage instructions respectfully to rural patients.',
      requiredSkills: [
        'Inventory Barcode Scanning & Stock Counting',
        'Customer Communication & Service',
        'Data Interpretation & Record Maintenance',
        'English Reading & Conversational Basics',
      ],
      requiredQualifications: [
        'Class 12 pass (Science stream with Biology or Chemistry preferred)',
        'Certificate in Pharmacy Assistance or D.Pharm (Diploma in Pharmacy)',
      ],
      salaryRange: '₹1,60,000 - ₹3,00,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'High (Rapid growth of Jan Aushadhi Kendras and retail pharmacy chains in rural towns)',
      firstSteps: [
        'Learn standard generic drug names and therapeutic categories (antibiotics, analgesics, antacids).',
        'Practice computerized pharmacy POS billing and stock management software.',
        'Apprentice at a busy community chemist shop or Jan Aushadhi Kendra.',
        'Consider pursuing a 2-year D.Pharm degree to become a fully licensed pharmacist.',
      ],
      educationPaths: [
        'Class 12 (PCB/PCM) → D.Pharm (Diploma in Pharmacy, 2 Years)',
        'Class 12 → Certificate in Pharmacy Sales & Dispensing Assistance (6 Months)',
      ],
      relatedCareers: [
        'general-duty-assistant',
        'warehouse-inventory-associate',
        'junior-tally-gst-accountant',
      ],
      sourceUrl: 'https://janaushadhi.gov.in',
    },
    {
      title: 'Emergency Medical Technician (EMT - Basic)',
      slug: 'emergency-medical-technician',
      category: 'healthcare',
      description:
        'Responds rapidly in 108/102 emergency ambulances to trauma victims, cardiac crises, and maternal emergencies in rural areas. Administers oxygen, stabilizes spinal fractures, and delivers essential pre-hospital life support en route to the referral hospital. Coordinates with hospital emergency teams via wireless telemetry to prepare receiving bays.',
      requiredSkills: [
        'Medical Equipment Sanitization & First Aid',
        'Patient Vital Signs Monitoring',
        'Problem Solving & Troubleshooting',
        'Conflict Resolution & Mediation',
      ],
      requiredQualifications: [
        'Class 12 pass with Science (Biology/Physics/Chemistry)',
        'Certificate or Diploma in Emergency Medical Technology (EMT-Basic, 1 Year)',
      ],
      salaryRange: '₹1,80,000 - ₹3,40,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'High (State health departments continuously upgrading emergency ambulance fleets)',
      firstSteps: [
        'Enroll in an accredited EMT-Basic training program at a medical college or recognized institute.',
        'Attain Advanced Cardiac Life Support (ACLS) and Pediatric Advanced Life Support (PALS) certifications.',
        'Complete mandatory 200 hours of emergency room and ambulance shift rotations.',
        'Apply to emergency medical response providers such as GVK EMRI or Ziqitza.',
      ],
      educationPaths: [
        'Class 12 (Science) → Diploma in Emergency Medical Services (DEMS, 1-2 Years)',
        'Class 12 (Science) → BSc in Emergency Care Technology (3 Years)',
      ],
      relatedCareers: [
        'general-duty-assistant',
        'pharmacy-assistant',
        'certified-electrician',
      ],
      sourceUrl: 'https://emri.in',
    },

    // 3. Teaching & Education
    {
      title: 'Primary School Teacher (Govt/Private)',
      slug: 'primary-school-teacher',
      category: 'education',
      description:
        'Nurtures foundational literacy, numeracy, and social values in children aged 6 to 11 across primary school classes. Crafts creative visual lesson plans, storytelling sessions, and hands-on activities to make learning enjoyable and accessible. Evaluates learning milestones and maintains close communication with parents and village education committees.',
      requiredSkills: [
        'Presentation & Public Speaking',
        'Active Listening & Empathy',
        'Vernacular Language Fluency & Writing',
        'English Reading & Conversational Basics',
        'Foundational Mathematics & Calculations',
      ],
      requiredQualifications: [
        'Class 12 with 50% marks + 2-Year Diploma in Elementary Education (D.El.Ed / BTC)',
        'Passing score in State Teacher Eligibility Test (TET) or Central TET (CTET Paper 1)',
      ],
      salaryRange: '₹2,16,000 - ₹4,80,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'High (National Education Policy 2020 emphasis on universal foundational literacy)',
      firstSteps: [
        'Complete senior secondary schooling with strong command over vernacular and English languages.',
        'Gain admission into a government District Institute of Education and Training (DIET) for D.El.Ed.',
        'Prepare thoroughly for CTET/State TET Paper 1 syllabus covering child pedagogy and child psychology.',
        'Volunteer as a remedial tutor in local village evening study circles to gain practical teaching hours.',
      ],
      educationPaths: [
        'Class 12 → 2-Year D.El.Ed (Diploma in Elementary Education) → TET / CTET',
        'Graduation (BA/BSc) → 2-Year B.Ed (Bachelor of Education) → TET',
        'Integrated 4-Year B.El.Ed degree program after Class 12',
      ],
      relatedCareers: [
        'anganwadi-early-educator',
        'digital-skills-tutor',
        'child-welfare-community-worker',
      ],
      sourceUrl: 'https://ncte.gov.in',
    },
    {
      title: 'Anganwadi & Early Childhood Educator',
      slug: 'anganwadi-early-educator',
      category: 'education',
      description:
        'Leads preschool play-based learning activities for toddlers and pre-primary children at village Anganwadi centers under the ICDS program. Conducts growth monitoring, tracks nutritional intake, and facilitates maternal and child immunization camps. Serves as the community’s primary guardian of early child development and maternal health.',
      requiredSkills: [
        'Active Listening & Empathy',
        'Vernacular Language Fluency & Writing',
        'Team Collaboration & Trust Building',
        'Customer Communication & Service',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass from a recognized board',
        'Resident of the local village / gram panchayat',
      ],
      salaryRange: '₹1,20,000 - ₹2,00,000 per annum (including honorarium and state performance incentives)',
      demandLevel: 'medium',
      growthOutlook: 'Moderate (Continuous government upgradation of Anganwadis into Saksham Anganwadis)',
      firstSteps: [
        'Monitor district Women and Child Development (WCD) recruitment circulars for Anganwadi Worker vacancies.',
        'Learn early childhood education techniques, rhymes, and interactive puppetry.',
        'Familiarize yourself with the POSHAN Abhiyaan mobile tracking app and growth monitoring charts.',
        'Work closely with local ASHA workers and village health sanitation committees.',
      ],
      educationPaths: [
        'Class 10/12 → WCD Department Anganwadi Worker Training Induction (1 Month)',
        'Class 12 → Diploma in Early Childhood Care and Education (ECCE, 1 Year)',
      ],
      relatedCareers: [
        'primary-school-teacher',
        'general-duty-assistant',
        'shg-community-mobilizer',
      ],
      sourceUrl: 'https://wcd.nic.in',
    },
    {
      title: 'Digital Skills & Vernacular Tutor',
      slug: 'digital-skills-tutor',
      category: 'education',
      description:
        'Conducts micro-classes for rural youth, women, and elders on smartphone literacy, digital financial payments, and basic software skills. Creates vernacular explanatory audio notes, pictorial cheat-sheets, and interactive screen walkthroughs. Empowers village communities to navigate welfare portals, online exams, and digital banking securely.',
      requiredSkills: [
        'Smartphone Navigation & App Usage',
        'Basic Computer Operations',
        'Presentation & Public Speaking',
        'Customer Communication & Service',
      ],
      requiredQualifications: [
        'Class 12 or graduate in any discipline',
        'Digital literacy certification (PMKVY Digital Educator, NIELIT CCC, or Pratham digital tutor)',
      ],
      salaryRange: '₹1,44,000 - ₹2,60,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'Very High (High demand from rural NGOs, PMGDISHA, and community coaching centers)',
      firstSteps: [
        'Achieve proficiency across major UPI apps, Digilocker, UMANG portal, and internet security rules.',
        'Host free weekend digital helpdesks in your neighborhood to build tutoring confidence.',
        'Partner with local panchayats or NGOs running digital literacy initiatives.',
        'Offer customized batch classes for small shopkeepers transitioning to digital bookkeeping.',
      ],
      educationPaths: [
        'Class 12 → NIELIT CCC / DCA Certification (3 to 6 Months)',
        'Graduation (BA/BSc/BCom) → Train-the-Trainer (ToT) certification by NSDC',
      ],
      relatedCareers: [
        'primary-school-teacher',
        'csc-digital-entrepreneur',
        'vernacular-content-creator',
      ],
      sourceUrl: 'https://pmgdisha.in',
    },

    // 4. Agriculture & Agritech
    {
      title: 'Agritech Drone Pilot & Crop Monitor',
      slug: 'agritech-drone-pilot',
      category: 'agriculture',
      description:
        'Flies commercial agricultural drones across farm fields to execute precision pesticide spraying, liquid fertilizer application, and multispectral crop health mapping. Programs GPS waypoints, manages lithium-polymer battery charging stations, and adheres to DGCA airspace safety regulations. Transforms traditional farming into high-efficiency precision agriculture.',
      requiredSkills: [
        'Agricultural Drone Piloting',
        'Safe Drone Maneuvering & Battery Handling',
        'Smartphone Navigation & App Usage',
        'Problem Solving & Troubleshooting',
      ],
      requiredQualifications: [
        'Class 10 pass with valid Indian Passport or voter ID',
        'DGCA-approved Remote Pilot Certificate (RPC) for Small/Medium category drones',
      ],
      salaryRange: '₹2,40,000 - ₹4,80,000 per annum (plus seasonal spraying acre-based incentives)',
      demandLevel: 'high',
      growthOutlook: 'Exponential (Subsidized heavily under Kisan Drone Scheme and Namo Drone Didi)',
      firstSteps: [
        'Enroll in a DGCA-authorized Remote Pilot Training Organization (RPTO) for 5-day drone pilot training.',
        'Pass the DGCA online theory exam and complete practical night/day flight tests.',
        'Learn agricultural spraying equipment calibration, micron nozzle maintenance, and chemical safety.',
        'Partner with local Farmer Producer Organizations (FPOs) or agritech startups (e.g., DeHaat, Garuda).',
      ],
      educationPaths: [
        'Class 10/12 → DGCA Certified RPTO Remote Pilot License Course (5 to 7 Days)',
        'Class 10 → 2-Year ITI in Drone Technician Trade',
        'Polytechnic Diploma in Agriculture / Mechanical Engineering',
      ],
      relatedCareers: [
        'soil-testing-specialist',
        'organic-farming-supervisor',
        'electric-vehicle-technician',
      ],
      sourceUrl: 'https://digitalsky.dgca.gov.in',
    },
    {
      title: 'Soil Testing & Nutrient Management Specialist',
      slug: 'soil-testing-specialist',
      category: 'agriculture',
      description:
        'Collects composite soil samples across farm plots, performs laboratory chemical assays for macro and micro nutrients, and issues Soil Health Cards to farmers. Interprets chemical deficiencies and recommends customized organic compost and fertilizer dosages to lower farming costs. Operates mini-soil testing labs at village farmer service centers.',
      requiredSkills: [
        'Soil Sample Testing & Chemistry',
        'Science & Physics Fundamentals',
        'Data Interpretation & Record Maintenance',
        'Customer Communication & Service',
      ],
      requiredQualifications: [
        'Class 12 with Science (Chemistry/Agriculture) OR BSc in Agriculture/Chemistry',
        'Certification in Soil Testing and Nutrient Management from Krishi Vigyan Kendra (KVK)',
      ],
      salaryRange: '₹1,80,000 - ₹3,20,000 per annum',
      demandLevel: 'medium',
      growthOutlook: 'High (Government subsidies to establish village-level Soil Testing Laboratories)',
      firstSteps: [
        'Complete short-term practical training at your nearest Krishi Vigyan Kendra (KVK).',
        'Learn the operation of spectrophotometers, colorimeters, and digital pH meters.',
        'Understand government Soil Health Card portal guidelines and sample registration protocols.',
        'Apply for subsidized mini-lab setup grants under the National Mission for Sustainable Agriculture.',
      ],
      educationPaths: [
        'Class 12 (Science/Agriculture) → KVK 3-Month Certified Soil Testing Technician',
        'BSc Agriculture / Chemistry (3-4 Years)',
        'Diploma in Agriculture (2 Years)',
      ],
      relatedCareers: [
        'agritech-drone-pilot',
        'organic-farming-supervisor',
        'agri-produce-aggregator',
      ],
      sourceUrl: 'https://soilhealth.dac.gov.in',
    },
    {
      title: 'Organic Farming & Greenhouse Supervisor',
      slug: 'organic-farming-supervisor',
      category: 'agriculture',
      description:
        'Oversees certified organic crop production, greenhouse polyhouse operations, drip fertigation schedules, and organic compost preparation. Manages pest control using bio-pesticides, neem decoctions, and pheromone traps while maintaining meticulous NPOP organic certification records. Coordinates harvesting and cold-chain packaging for urban premium markets.',
      requiredSkills: [
        'Drip Irrigation & Fertigation Setup',
        'Food Hygiene & Safe Packaging',
        'Environmental & Ecological Awareness',
        'Team Collaboration & Trust Building',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'Vocational certificate in Organic Farming / Horticulture OR extensive hands-on farming experience',
      ],
      salaryRange: '₹1,80,000 - ₹3,60,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'Very High (Expanding urban consumer demand for residue-free organic fruits & vegetables)',
      firstSteps: [
        'Learn organic certification norms under Jaivik Bharat and NPOP standards.',
        'Master the construction and maintenance of vermicompost beds, jeevamrit, and bio-fertilizers.',
        'Gain experience managing polyhouse humidity, misting cycles, and automated drip controllers.',
        'Network with organic farmer cooperatives and direct-to-consumer agri-brands.',
      ],
      educationPaths: [
        'Class 10/12 → Certificate in Organic Agriculture (IGNOU / KVK, 6 Months)',
        'Class 12 → Diploma in Horticulture / Organic Farming (1-2 Years)',
        'BSc in Agriculture / Horticulture (4 Years)',
      ],
      relatedCareers: [
        'soil-testing-specialist',
        'agritech-drone-pilot',
        'agri-produce-aggregator',
      ],
      sourceUrl: 'https://jaivikbharat.fssai.gov.in',
    },

    // 5. Environmental & Sustainability
    {
      title: 'Solar PV Rooftop Technician',
      slug: 'solar-pv-rooftop-technician',
      category: 'environment',
      description:
        'Installs, connects, tests, and maintains rooftop solar photovoltaic panels, grid-tie inverters, and battery storage systems for homes, schools, and tubewells. Performs structural mechanical fastening, DC string wiring, electrical earthing, and lightning arrestor installations safely. Diagnoses power drops and conducts periodic panel cleaning and maintenance.',
      requiredSkills: [
        'Solar PV Array Mounting & Structure Fixing',
        'Solar Panel Testing & Multimeter Operation',
        'Domestic Electrical Wiring & Safety',
        'Problem Solving & Troubleshooting',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'ITI in Electrician / Wireman OR Surya Mitra certification from National Institute of Solar Energy (NISE)',
      ],
      salaryRange: '₹2,00,000 - ₹3,80,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'Very High (Driven by PM Surya Ghar Muft Bijli Yojana targeting 10 million solar rooftops)',
      firstSteps: [
        'Enroll in the government-sponsored 600-hour Surya Mitra Skill Development Program.',
        'Practice crimping MC4 solar connectors, setting tilt angles with inclinometers, and testing with multimeters.',
        'Learn roof structural load evaluation and electrical safety protocols at heights.',
        'Register as an empanelled installer with state DISCOM solar rooftop vendor portals.',
      ],
      educationPaths: [
        'Class 10 → 2-Year ITI Electrician Trade → NISE Surya Mitra Certification',
        'Class 10 → 3-Year Polytechnic Diploma in Electrical Engineering',
        'Class 12 (Science) → BVoc in Renewable Energy Management (3 Years)',
      ],
      relatedCareers: [
        'certified-electrician',
        'biogas-plant-manager',
        'electric-vehicle-technician',
      ],
      sourceUrl: 'https://pmsuryaghar.gov.in',
    },
    {
      title: 'Rainwater Harvesting & Watershed Technician',
      slug: 'rainwater-watershed-technician',
      category: 'environment',
      description:
        'Designs, constructs, and maintains rooftop rainwater harvesting filters, borewell recharge pits, and village check-dams under conservation schemes. Calculates catchment runoff volumes, selects appropriate gravel-sand-charcoal filtration media, and prevents aquifer contamination. Plays a pivotal role in drought mitigation and groundwater rejuvenation.',
      requiredSkills: [
        'Plumbing & Pipe Fitting',
        'Environmental & Ecological Awareness',
        'Foundational Mathematics & Calculations',
        'Problem Solving & Troubleshooting',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'ITI in Plumber / Civil Draughtsman OR vocational training in watershed management',
      ],
      salaryRange: '₹1,80,000 - ₹3,00,000 per annum',
      demandLevel: 'medium',
      growthOutlook: 'High (Mandatory rainwater harvesting norms and Jal Jeevan Mission projects across states)',
      firstSteps: [
        'Learn rooftop runoff sizing calculations and groundwater recharge trench dimensions.',
        'Practice plumbing pipe fitting, dual-chamber filter installation, and desilting mechanics.',
        'Study Jal Shakti Abhiyan and Mahatma Gandhi NREGS watershed intervention guidelines.',
        'Collaborate with gram panchayats and grassroots rural water conservation NGOs.',
      ],
      educationPaths: [
        'Class 10 → 1-Year ITI in Plumber Trade',
        'Class 10 → 3-Year Polytechnic Diploma in Civil Engineering',
        'Certificate course in Watershed Management (IGNOU / State Water Academy)',
      ],
      relatedCareers: [
        'solar-pv-rooftop-technician',
        'biogas-plant-manager',
        'gram-sevak-panchayat-assistant',
      ],
      sourceUrl: 'https://jalshakti.gov.in',
    },
    {
      title: 'Biogas Plant & Bio-Waste Manager',
      slug: 'biogas-plant-manager',
      category: 'environment',
      description:
        'Operates and maintains community and household Gobar-Dhan biogas digesters converting cattle dung and crop residues into clean cooking gas and bio-slurry fertilizer. Monitors anaerobic digestion parameters including pH, temperature, gas pressure, and moisture content. Distributes enriched organic slurry to local farms and manages gas piping safety.',
      requiredSkills: [
        'Environmental & Ecological Awareness',
        'Plumbing & Pipe Fitting',
        'Problem Solving & Troubleshooting',
        'Team Collaboration & Trust Building',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'Vocational training in Biogas Technology / Rural Waste Management from KVIC or MNRE',
      ],
      salaryRange: '₹1,60,000 - ₹2,80,000 per annum',
      demandLevel: 'medium',
      growthOutlook: 'High (Accelerated by GOBARdhan initiative under Swachh Bharat Mission Grameen)',
      firstSteps: [
        'Learn fixed-dome (Deenabandhu) and floating-drum biogas digester construction blueprints.',
        'Understand slurry dilution ratios, digester feedstock mixing, and gas pipe leak detection.',
        'Complete short-term technician training at a KVIC Biogas Training Center.',
        'Coordinate with local gaushalas, dairy clusters, and panchayat sanitation committees.',
      ],
      educationPaths: [
        'Class 10/12 → MNRE / KVIC Certified Biogas Technician (1 to 3 Months)',
        'Polytechnic Diploma in Agricultural / Environmental / Mechanical Engineering',
      ],
      relatedCareers: [
        'solar-pv-rooftop-technician',
        'organic-farming-supervisor',
        'gram-sevak-panchayat-assistant',
      ],
      sourceUrl: 'https://sbm.gov.in/gobardhan',
    },

    // 6. Skilled Trades & Technical
    {
      title: 'Certified Residential & Commercial Electrician',
      slug: 'certified-electrician',
      category: 'trades',
      description:
        'Installs, maintains, and repairs electrical power cables, distribution boxes, lighting, fans, and industrial machinery across homes, shops, and agricultural borewells. Reads wiring schematics, tests continuity with multimeters, ensures proper grounding, and resolves short circuits promptly. Adheres strictly to Bureau of Indian Standards (BIS) safety codes.',
      requiredSkills: [
        'Domestic Electrical Wiring & Safety',
        'Solar Panel Testing & Multimeter Operation',
        'Problem Solving & Troubleshooting',
        'Customer Communication & Service',
      ],
      requiredQualifications: [
        'Class 10 pass',
        '2-Year ITI Electrician or Wireman trade certificate with State Electrical Licensing Board wireman permit',
      ],
      salaryRange: '₹1,80,000 - ₹3,60,000 per annum (higher for independent contractors)',
      demandLevel: 'high',
      growthOutlook: 'Very High (Universal household electrification and rising electrical appliance ownership)',
      firstSteps: [
        'Enroll in the 2-year NCVT/SCVT Electrician trade at a recognized Industrial Training Institute (ITI).',
        'Pass the All India Trade Test (AITT) and complete 1 year of National Apprenticeship (NAPS).',
        'Apply for an Electrical Wireman / Contractor License from the state licensing authority.',
        'Build a trusted local network serving residential builds, pump repair, and shop installations.',
      ],
      educationPaths: [
        'Class 10 → 2-Year ITI Electrician Trade → Apprenticeship (NAPS)',
        'Class 10 → 3-Year Polytechnic Diploma in Electrical Engineering',
      ],
      relatedCareers: [
        'solar-pv-rooftop-technician',
        'electric-vehicle-technician',
        'industrial-fitter-welder',
      ],
      sourceUrl: 'https://dgt.gov.in',
    },
    {
      title: 'Industrial Fitter & Arc Welder',
      slug: 'industrial-fitter-welder',
      category: 'trades',
      description:
        'Fabricates, cuts, shapes, fits, and welds steel structural components, agricultural implements, gates, and industrial machine frames. Operates metal saws, drill presses, angle grinders, and oxy-acetylene cutting torches alongside shielded metal arc welding (SMAW) equipment. Inspects joint alignments to ensure high mechanical strength and structural safety.',
      requiredSkills: [
        'MIG & Manual Metal Arc Welding',
        'Problem Solving & Troubleshooting',
        'Science & Physics Fundamentals',
        'Time Management & Punctuality',
      ],
      requiredQualifications: [
        'Class 8 or Class 10 pass',
        'ITI in Welder (1 Year) or Fitter (2 Years) trade certified by NCVT',
      ],
      salaryRange: '₹1,80,000 - ₹3,40,000 per annum (international Gulf opportunities offer 2-3x)',
      demandLevel: 'high',
      growthOutlook: 'High (Continuous demand across manufacturing plants, railways, and rural fabrication shops)',
      firstSteps: [
        'Join an ITI Welder or Fitter trade and master different welding positions (1G, 2G, 3G).',
        'Learn technical engineering drawing symbols, tolerance measurements with vernier calipers, and grinding safety.',
        'Complete apprenticeship in heavy industries (BHEL, Railways, L&T, or local structural fabricators).',
        'Obtain 6G pipe welding qualification for premium industrial and overseas employment.',
      ],
      educationPaths: [
        'Class 8/10 → 1-Year ITI Welder Trade',
        'Class 10 → 2-Year ITI Fitter Trade',
        'Class 10 → 3-Year Polytechnic Diploma in Mechanical Engineering',
      ],
      relatedCareers: [
        'certified-electrician',
        'cnc-machine-operator',
        'electric-vehicle-technician',
      ],
      sourceUrl: 'https://dgt.gov.in',
    },
    {
      title: 'Electric Two-Wheeler / Automotive Technician',
      slug: 'electric-vehicle-technician',
      category: 'trades',
      description:
        'Diagnoses, tunes, and repairs electric two-wheelers, e-rickshaws, and conventional motorbikes in semi-urban and rural centers. Troubleshoots brushless DC (BLDC) hub motors, throttle controllers, regenerative braking systems, and battery management systems (BMS). Ensures battery cell balancing and electrical harness integrity for passenger safety.',
      requiredSkills: [
        'Two-Wheeler / Electric Vehicle Servicing',
        'Solar Panel Testing & Multimeter Operation',
        'Problem Solving & Troubleshooting',
        'Customer Communication & Service',
      ],
      requiredQualifications: [
        'Class 10 pass',
        'ITI in Mechanic Motor Vehicle (MMV) / Mechanic Diesel OR specialized certificate in EV Technology',
      ],
      salaryRange: '₹2,00,000 - ₹3,80,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'Exponential (Rapid transition of e-rickshaws and delivery two-wheelers to electric powertrains)',
      firstSteps: [
        'Complete ITI Mechanic Motor Vehicle or an accredited automotive technician diploma.',
        'Undergo specialized short-term hands-on training on EV batteries, motor controllers, and BMS diagnosis.',
        'Apprentice at an authorized EV dealership or multi-brand two-wheeler service center.',
        'Establish an independent EV diagnostic and battery repair workshop.',
      ],
      educationPaths: [
        'Class 10 → 2-Year ITI in Mechanic Motor Vehicle Trade',
        'Class 10/12 → ASDC (Automotive Skills Development Council) Certified EV Technician Course',
        'Class 10 → 3-Year Polytechnic Diploma in Automobile Engineering',
      ],
      relatedCareers: [
        'certified-electrician',
        'solar-pv-rooftop-technician',
        'industrial-fitter-welder',
      ],
      sourceUrl: 'https://asdc.org.in',
    },

    // 7. Business & Entrepreneurship
    {
      title: 'Common Service Center (CSC) Digital Entrepreneur',
      slug: 'csc-digital-entrepreneur',
      category: 'business',
      description:
        'Operates a Village Level Entrepreneur (VLE) center offering essential government-to-citizen (G2C) and business-to-consumer (B2C) digital services. Delivers Aadhaar updates, PAN applications, passport registrations, farmer PM-KISAN KYC, utility bill payments, and micro-ATM cash withdrawals. Acts as the primary digital and financial lifeline of the village community.',
      requiredSkills: [
        'Smartphone Navigation & App Usage',
        'Basic Computer Operations',
        'Customer Communication & Service',
        'Financial Literacy & Bookkeeping',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass from a recognized board',
        'Valid Telecentre Entrepreneur Course (TEC) certification from CSC Academy',
      ],
      salaryRange: '₹1,80,000 - ₹4,20,000 per annum (commission and transaction fee based)',
      demandLevel: 'high',
      growthOutlook: 'High (Over 500,000 functional CSCs in India expanding into telemedicine, logistics, and insurance)',
      firstSteps: [
        'Enroll in and pass the Telecentre Entrepreneur Course (TEC) online examination.',
        'Secure commercial shop space, a desktop PC, biometrics scanner (fingerprint/iris), webcam, and printer.',
        'Apply for VLE registration on the official CSC portal with gram pradhan authorization.',
        'Complete Banking Correspondent (BC) certification to add micro-ATM withdrawal facilities.',
      ],
      educationPaths: [
        'Class 10/12 → CSC TEC Certification → IIBF BC/BF Examination',
        'Graduation in Commerce / Computer Applications (BCom / BCA)',
      ],
      relatedCareers: [
        'banking-correspondent-mitra',
        'data-entry-verification-operator',
        'digital-skills-tutor',
      ],
      sourceUrl: 'https://register.csc.gov.in',
    },
    {
      title: 'Village Kirana & Rural Retail Modernizer',
      slug: 'rural-retail-modernizer',
      category: 'business',
      description:
        'Modernizes rural grocery stores by implementing digital POS billing, QR-code UPI payment systems, structured shelf merchandising, and fast-moving FMCG inventory control. Establishes direct supply tie-ups with wholesale distributors and B2B e-commerce platforms to improve profit margins. Offers home delivery and seasonal festive bundles to village patrons.',
      requiredSkills: [
        'Financial Literacy & Bookkeeping',
        'Customer Communication & Service',
        'Inventory Barcode Scanning & Stock Counting',
        'Smartphone Navigation & App Usage',
      ],
      requiredQualifications: [
        'Class 10 pass',
        'Basic business numeracy and familiarity with mobile accounting apps (Vyapar, Khatabook, OkCredit)',
      ],
      salaryRange: '₹2,00,000 - ₹4,50,000 per annum (business net operating profit)',
      demandLevel: 'high',
      growthOutlook: 'High (Surge in rural consumer aspirations and adoption of digital retail systems)',
      firstSteps: [
        'Transition manual bahi-khata ledger bookkeeping to a mobile accounting application.',
        'Install a dynamic Soundbox UPI terminal to accept zero-fee instant QR payments.',
        'Reorganize store floor plan using transparent glass shelves and clear category signages.',
        'Explore credit schemes like PM MUDRA Yojana (Shishu/Kishore loans) for store working capital.',
      ],
      educationPaths: [
        'Class 10/12 → RSETI 1-Month General Entrepreneurship Training (Free)',
        'Class 12 → BBA or BCom in Retail & Supply Chain Management',
      ],
      relatedCareers: [
        'csc-digital-entrepreneur',
        'agri-produce-aggregator',
        'junior-tally-gst-accountant',
      ],
      sourceUrl: 'https://mudra.org.in',
    },
    {
      title: 'Agri-Produce Aggregator & FPO Coordinator',
      slug: 'agri-produce-aggregator',
      category: 'business',
      description:
        'Coordinates harvest aggregation, quality grading, moisture testing, and bulk transportation for member farmers inside Farmer Producer Organizations (FPOs). Negotiates directly with large mandi traders, food processors, and supermarket chains to eliminate middlemen and secure remunerative prices. Manages seed, fertilizer, and farm machinery rental services for shareholders.',
      requiredSkills: [
        'Financial Literacy & Bookkeeping',
        'Team Collaboration & Trust Building',
        'Data Interpretation & Record Maintenance',
        'Customer Communication & Service',
      ],
      requiredQualifications: [
        'Class 12 or graduate in Agriculture, Rural Management, Commerce, or Economics',
        'Prior association with rural producer groups or agricultural value chains',
      ],
      salaryRange: '₹2,16,000 - ₹4,20,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'Very High (Government push to form 10,000 new FPOs backed by NABARD and SFAC)',
      firstSteps: [
        'Understand FPO legal structures, share capital rules, and compliance with the Companies Act.',
        'Participate in capacity building workshops conducted by NABARD or state livelihood missions.',
        'Learn post-harvest commodity grading and e-NAM (National Agriculture Market) online bidding.',
        'Apply for Chief Executive Officer (CEO) or Accountant positions in registered FPOs.',
      ],
      educationPaths: [
        'Graduation (BSc Agriculture / BBA / BCom / BVoc in Agri-Business)',
        'Class 12 → Diploma in Cooperative Management or Rural Development',
      ],
      relatedCareers: [
        'organic-farming-supervisor',
        'rural-retail-modernizer',
        'banking-correspondent-mitra',
      ],
      sourceUrl: 'https://sfacindia.com',
    },

    // 8. Creative Arts, Design & Media
    {
      title: 'Vernacular Content Creator & Mobile Video Editor',
      slug: 'vernacular-content-creator',
      category: 'creative',
      description:
        'Researches, shoots, edits, and publishes high-retention informative video stories in regional languages (Hindi, Bhojpuri, Tamil, Bengali, etc.) for YouTube, Instagram, and local media. Documents rural grassroots innovations, agricultural best practices, cultural folklore, and educational tutorials using accessible mobile editing apps. Monetizes through digital ad revenue, affiliate marketing, and brand sponsorships.',
      requiredSkills: [
        'Smartphone Navigation & App Usage',
        'Graphic Design (Canva & Photoshop Basics)',
        'Vernacular Language Fluency & Writing',
        'Presentation & Public Speaking',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'Proficiency in smartphone video editing apps (VN, CapCut, Kinemaster) and storytelling',
      ],
      salaryRange: '₹1,50,000 - ₹4,00,000 per annum (ad revenue, sponsorships, and client editing projects)',
      demandLevel: 'high',
      growthOutlook: 'Very High (Explosive consumption of localized vernacular video content across Bharat)',
      firstSteps: [
        'Learn visual framing, natural lighting, clean audio recording with lapel microphones, and pacing.',
        'Produce and post 30 short-form educational or cultural reels in your regional mother tongue.',
        'Learn YouTube Studio analytics, thumbnail design on Canva, and SEO keyword tagging.',
        'Offer freelance video creation services to local shops, schools, wedding organizers, and NGOs.',
      ],
      educationPaths: [
        'Class 12 → BA in Journalism & Mass Communication (BJMC, 3 Years)',
        'Class 10/12 → Self-directed learning + NSDC Media & Entertainment Sector Skill Council courses',
      ],
      relatedCareers: [
        'graphic-designer-print-specialist',
        'traditional-handicrafts-curator',
        'digital-skills-tutor',
      ],
      sourceUrl: 'https://mescindia.org',
    },
    {
      title: 'Graphic Designer & Print Media Specialist',
      slug: 'graphic-designer-print-specialist',
      category: 'creative',
      description:
        'Designs promotional vinyl banners, wedding invitation cards, visiting cards, institutional magazines, and digital social media creatives for rural and semi-urban clients. Operates large-format digital flex printing machines, paper cutters, and binding equipment at print studios. Balances traditional aesthetics with contemporary typography and color theory.',
      requiredSkills: [
        'Graphic Design (Canva & Photoshop Basics)',
        'Basic Computer Operations',
        'Customer Communication & Service',
        'Time Management & Punctuality',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'Certificate or Diploma in Graphic Design & Desktop Publishing (DTP)',
      ],
      salaryRange: '₹1,80,000 - ₹3,20,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'High (Constant demand during festive seasons, local elections, weddings, and business launches)',
      firstSteps: [
        'Master CorelDRAW, Adobe Photoshop, and PageMaker / Illustrator fundamentals.',
        'Learn color spaces (RGB vs CMYK), vector printing resolution, and flex banner finishing.',
        'Create a showcase catalog featuring wedding cards, shop flex hoardings, and school booklets.',
        'Join an established flex print house or start an independent design-and-print kiosk.',
      ],
      educationPaths: [
        'Class 10/12 → 6-Month Diploma in Desktop Publishing (DTP)',
        'Class 12 → Bachelor of Fine Arts (BFA) or Diploma in Commercial Arts (3-4 Years)',
      ],
      relatedCareers: [
        'vernacular-content-creator',
        'junior-frontend-web-developer',
        'traditional-handicrafts-curator',
      ],
      sourceUrl: 'https://mescindia.org',
    },
    {
      title: 'Traditional Handicrafts & E-commerce Seller',
      slug: 'traditional-handicrafts-curator',
      category: 'creative',
      description:
        'Crafts or curates authentic rural artisanal goods (pottery, handloom textiles, wood carving, terracotta, jute items) and lists them on national e-commerce portals like ONDC, Amazon Karigar, and Tribes India. Photographs crafts professionally, writes detailed heritage narratives, and manages safe packaging and courier dispatch. Preserves age-old cultural craft traditions while expanding artisan earnings.',
      requiredSkills: [
        'Food Hygiene & Safe Packaging',
        'Customer Communication & Service',
        'Graphic Design (Canva & Photoshop Basics)',
        'Financial Literacy & Bookkeeping',
      ],
      requiredQualifications: [
        'Class 8 or Class 10 pass',
        'Traditional artisanal lineage or certification from Handicrafts and Carpet Sector Skill Council (HCSSC)',
      ],
      salaryRange: '₹1,80,000 - ₹3,80,000 per annum',
      demandLevel: 'medium',
      growthOutlook: 'High (Backed by PM Vishwakarma Yojana and global demand for handmade sustainable crafts)',
      firstSteps: [
        'Register as an artisan on the Ministry of Textiles Pehchan portal to obtain an Artisan Identity Card.',
        'Apply for subsidized toolkits and credit under the PM Vishwakarma Yojana.',
        'Learn catalog photography, product dimensioning, and listing on ONDC and e-commerce platforms.',
        'Participate in national craft expos (Surajkund, SARAS fairs) and artisan cooperative clusters.',
      ],
      educationPaths: [
        'Class 10/12 → National Institute of Fashion Technology (NIFT) Craft Design Diploma',
        'Apprenticeship under Master Craftsmen (Guru-Shishya Parampara) + PM Vishwakarma training',
      ],
      relatedCareers: [
        'vernacular-content-creator',
        'rural-retail-modernizer',
        'homestay-eco-tourism-guide',
      ],
      sourceUrl: 'https://handicrafts.nic.in',
    },

    // 9. Hospitality & Tourism
    {
      title: 'Rural Homestay Host & Eco-Tourism Guide',
      slug: 'homestay-eco-tourism-guide',
      category: 'hospitality',
      description:
        'Hosts domestic and international travelers in authentic village homestays, providing home-cooked regional cuisine, folk music evenings, and guided cultural village walks. Leads guided trekking tours through nearby forests, river sanctuaries, and historical heritage monuments while sharing local oral histories. Promotes zero-waste eco-tourism principles that protect delicate rural ecosystems.',
      requiredSkills: [
        'Customer Communication & Service',
        'English Reading & Conversational Basics',
        'Active Listening & Empathy',
        'Environmental & Ecological Awareness',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'Regional tour guide license from State Tourism Board OR Ministry of Tourism Incredible India Tourist Facilitator (IITF) certification',
      ],
      salaryRange: '₹2,00,000 - ₹4,50,000 per annum (seasonal hospitality revenue and guiding fees)',
      demandLevel: 'high',
      growthOutlook: 'High (Surging domestic interest in authentic rural tourism, agri-tourism, and birdwatching trails)',
      firstSteps: [
        'Complete the Ministry of Tourism online Incredible India Tourist Facilitator (IITF) program.',
        'Upgrade homestay guest rooms with clean private washrooms, solar hot water, and authentic decor.',
        'Register your property on state tourism homestay portals and platforms like Airbnb and MakeMyTrip.',
        'Curate unique experiential itineraries: organic farming tours, pottery workshops, and heritage walks.',
      ],
      educationPaths: [
        'Class 12 → Incredible India Tourist Facilitator (IITF) Certification (Ministry of Tourism)',
        'Class 12 → Diploma / Degree in Travel & Tourism Management (1 to 3 Years)',
      ],
      relatedCareers: [
        'food-production-cook-assistant',
        'front-office-travel-coordinator',
        'traditional-handicrafts-curator',
      ],
      sourceUrl: 'https://tourism.gov.in',
    },
    {
      title: 'Food Production & Commercial Cook Assistant',
      slug: 'food-production-cook-assistant',
      category: 'hospitality',
      description:
        'Prepares ingredients, cuts vegetables, marinates meats, and cooks regional and Indian dishes in highway dhabas, heritage resorts, and institutional catering canteens. Maintains immaculate kitchen sanitation, food refrigeration standards, and personal hygiene in compliance with FSSAI regulations. Manages raw grocery stock replenishment and kitchen prep schedules.',
      requiredSkills: [
        'Food Hygiene & Safe Packaging',
        'Time Management & Punctuality',
        'Team Collaboration & Trust Building',
        'Problem Solving & Troubleshooting',
      ],
      requiredQualifications: [
        'Class 8 or Class 10 pass',
        'Certificate in Food Production / Culinary Arts from an Institute of Hotel Management (IHM) or Hunar Se Rozgar Tak (HSRT) program',
      ],
      salaryRange: '₹1,50,000 - ₹2,80,000 per annum (includes accommodation and staff meals at most resorts)',
      demandLevel: 'high',
      growthOutlook: 'High (Rapidly growing hospitality, highway dining corridors, and wedding catering sectors)',
      firstSteps: [
        'Complete the free 8-week Hunar Se Rozgar Tak (HSRT) Food Production course at a nearby IHM.',
        'Master knife cuts, mother gravies, tandoor firing, and food temperature control.',
        'Earn an FSSAI Food Safety Training and Certification (FoSTaC) food handler badge.',
        'Apprentice at a banquet catering team or regional heritage resort kitchen.',
      ],
      educationPaths: [
        'Class 10/12 → Hunar Se Rozgar Tak (HSRT) Cook Course (8 Weeks, Free with stipend)',
        'Class 10 → 1.5-Year Diploma in Food Production (IHM / State Board of Technical Education)',
      ],
      relatedCareers: [
        'homestay-eco-tourism-guide',
        'front-office-travel-coordinator',
        'food-processing-machine-operator',
      ],
      sourceUrl: 'https://thims.gov.in',
    },
    {
      title: 'Front Office Associate & Travel Coordinator',
      slug: 'front-office-travel-coordinator',
      category: 'hospitality',
      description:
        'Welcomes hotel guests warmly, manages check-in/check-out procedures, operates Property Management Software (PMS), and issues room keys at regional hotels and retreats. Handles telephone reservations, guest inquiries, room billing, and coordinates airport/railway taxi transfers. Resolves guest complaints courteously to earn stellar customer reviews.',
      requiredSkills: [
        'Customer Communication & Service',
        'English Reading & Conversational Basics',
        'Basic Computer Operations',
        'Active Listening & Empathy',
      ],
      requiredQualifications: [
        'Class 12 pass in any stream',
        'Certificate or Diploma in Hotel Management / Front Office Operations',
      ],
      salaryRange: '₹1,60,000 - ₹3,00,000 per annum',
      demandLevel: 'medium',
      growthOutlook: 'High (Expansion of branded hotel chains and spiritual tourism corridors across Tier-2/3 pilgrimage cities)',
      firstSteps: [
        'Build fluent spoken communication in English and your regional language.',
        'Learn hotel front-desk reservation software and guest folio management basics.',
        'Complete the HSRT Front Office Assistant 8-week certification at a government IHM.',
        'Intern at a boutique resort, pilgrimage guest house, or highway motel front desk.',
      ],
      educationPaths: [
        'Class 12 → Hunar Se Rozgar Tak Front Office Assistant (8 Weeks)',
        'Class 12 → 1.5-Year Diploma in Front Office Operations (IHM)',
        'Graduation → BHM (Bachelor of Hotel Management, 3-4 Years)',
      ],
      relatedCareers: [
        'homestay-eco-tourism-guide',
        'food-production-cook-assistant',
        'banking-correspondent-mitra',
      ],
      sourceUrl: 'https://tourism.gov.in',
    },

    // 10. Banking, Finance & Accounting
    {
      title: 'Banking Correspondent (Bank Mitra)',
      slug: 'banking-correspondent-mitra',
      category: 'finance',
      description:
        'Operates a rural customer service point (CSP) on behalf of public and private sector banks using micro-ATM biometric POS machines. Opens Pradhan Mantri Jan Dhan Yojana (PMJDY) savings accounts, processes Aadhaar-enabled biometric cash withdrawals and deposits, and facilitates Direct Benefit Transfer (DBT) subsidies. Enrolls villagers in micro-insurance (PMJJBY, PMSBY) and pension schemes (Atal Pension Yojana).',
      requiredSkills: [
        'Financial Literacy & Bookkeeping',
        'Customer Communication & Service',
        'Smartphone Navigation & App Usage',
        'Team Collaboration & Trust Building',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'IIBF (Indian Institute of Banking and Finance) Business Correspondent / Business Facilitator certificate',
      ],
      salaryRange: '₹1,80,000 - ₹3,60,000 per annum (bank fixed stipend plus transaction commissions)',
      demandLevel: 'high',
      growthOutlook: 'High (Over 1.5 million BC outlets active under National Financial Inclusion mission)',
      firstSteps: [
        'Pass the mandatory IIBF Business Correspondent examination.',
        'Obtain a Police Clearance Certificate (PCC) and an endorsement letter from the local bank branch manager.',
        'Secure micro-ATM hardware (fingerprint scanner, thermal printer, mini-tablet).',
        'Conduct regular financial literacy camps in village wards to educate elders on DBT entitlements.',
      ],
      educationPaths: [
        'Class 10/12 → IIBF BC/BF Certification Exam',
        'Class 12 → RSETI 13-Day Banking Correspondent Training Course (Free)',
      ],
      relatedCareers: [
        'csc-digital-entrepreneur',
        'microfinance-loan-officer',
        'junior-tally-gst-accountant',
      ],
      sourceUrl: 'https://iibf.org.in',
    },
    {
      title: 'Junior Tally & GST Accountant',
      slug: 'junior-tally-gst-accountant',
      category: 'finance',
      description:
        'Maintains digital daily cash books, vendor purchase registers, customer invoices, and bank reconciliations in Tally Prime for local businesses, agricultural traders, and contractors. Generates e-Way bills, calculates monthly GST liabilities, and assists chartered accountants with GSTR-1, GSTR-3B, and TDS returns. Ensures compliance with commercial tax norms.',
      requiredSkills: [
        'Tally Prime & GST Accounting',
        'Financial Literacy & Bookkeeping',
        'Basic Computer Operations',
        'Data Interpretation & Record Maintenance',
      ],
      requiredQualifications: [
        'Class 12 in Commerce (preferred) OR Graduate (BCom/BBA/BA)',
        'Tally Professional / Tally Essential Certification or equivalent diploma in computer accounting',
      ],
      salaryRange: '₹1,80,000 - ₹3,40,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'High (Stringent digital invoicing and GST compliance across semi-urban trade centers)',
      firstSteps: [
        'Master double-entry accounting fundamentals (debit/credit rules, balance sheet classification).',
        'Complete official Tally Prime certification covering inventory management and GST taxation.',
        'Learn the GST portal interface for e-Way bill generation and challan payments.',
        'Apprentice with a local Tax Advocate or Chartered Accountant firm to handle live books.',
      ],
      educationPaths: [
        'Class 12 (Commerce) → Tally Prime Certified Professional (3 Months)',
        'Class 12 → BCom (Bachelor of Commerce, 3 Years)',
        'Class 10/12 → ITI in Stenography & Secretarial Assistant or COPA',
      ],
      relatedCareers: [
        'banking-correspondent-mitra',
        'microfinance-loan-officer',
        'data-entry-verification-operator',
      ],
      sourceUrl: 'https://tallyeducation.com',
    },
    {
      title: 'Microfinance Loan Officer & Field Agent',
      slug: 'microfinance-loan-officer',
      category: 'finance',
      description:
        'Visits village neighborhoods to organize Joint Liability Groups (JLGs) of women entrepreneurs seeking microcredit for dairy, tailoring, or retail ventures. Conducts cash flow appraisals of applicant households, explains repayment installments transparently, and disburses credit. Conducts weekly/monthly group collection meetings while fostering responsible financial behavior.',
      requiredSkills: [
        'Financial Literacy & Bookkeeping',
        'Customer Communication & Service',
        'Active Listening & Empathy',
        'Two-Wheeler / Electric Vehicle Servicing',
      ],
      requiredQualifications: [
        'Class 12 pass or graduate in any stream',
        'Valid two-wheeler driving license and willingness to travel extensively within rural clusters',
      ],
      salaryRange: '₹1,80,000 - ₹3,20,000 per annum (plus fuel allowance and performance bonuses)',
      demandLevel: 'high',
      growthOutlook: 'High (Microfinance institutions expanding rapidly across unbanked rural districts)',
      firstSteps: [
        'Acquire a valid two-wheeler driving license and basic smartphone data entry skills.',
        'Understand Joint Liability Group (JLG) peer-guarantee lending methodology and RBI microfinance guidelines.',
        'Apply for Field Credit Officer (FCO) walk-in drives held by MFIs (Bandhan, Spandana, Satin, Fusion).',
        'Build strong rapport with local self-help group leaders and panchayat ward members.',
      ],
      educationPaths: [
        'Class 12 / Graduate in any discipline (BA/BCom/BSc)',
        'Certificate course in Microfinance Operations (IIBF / MFIN)',
      ],
      relatedCareers: [
        'banking-correspondent-mitra',
        'shg-community-mobilizer',
        'junior-tally-gst-accountant',
      ],
      sourceUrl: 'https://mfinindia.org',
    },

    // 11. Community Services & Social Work
    {
      title: 'Village Development & Panchayat Assistant (Gram Sevak)',
      slug: 'gram-sevak-panchayat-assistant',
      category: 'community',
      description:
        'Assists the Gram Panchayat Secretary and Pradhan in planning, executing, and monitoring village infrastructure works (paved roads, street lights, piped drinking water, school toilets). Maintains panchayat asset registers, updates the e-GramSwaraj portal, and helps conduct transparent Gram Sabha meetings. Assists villagers in registering grievances and accessing housing and sanitation grants.',
      requiredSkills: [
        'Civic Governance & Citizen Rights',
        'Basic Computer Operations',
        'Vernacular Language Fluency & Writing',
        'Team Collaboration & Trust Building',
      ],
      requiredQualifications: [
        'Class 12 pass from a recognized board',
        'CCC (Course on Computer Concepts) certificate from NIELIT',
      ],
      salaryRange: '₹1,44,000 - ₹2,80,000 per annum',
      demandLevel: 'medium',
      growthOutlook: 'Moderate (Dedicated Panchayat Sahayak recruitment in state rural development departments)',
      firstSteps: [
        'Obtain NIELIT CCC computer certification with high typing accuracy.',
        'Study the e-GramSwaraj and Meri Panchayat government portals to understand village development planning (GPDP).',
        'Monitor district magistrate notifications for Panchayat Sahayak / Gram Rozgar Sevak vacancies.',
        'Participate actively in local Gram Sabha sessions to understand village budgeting and auditing.',
      ],
      educationPaths: [
        'Class 12 → NIELIT CCC Certificate → State Panchayat Department Competitive Selection',
        'Graduation in Social Work (BSW) / Rural Development',
      ],
      relatedCareers: [
        'shg-community-mobilizer',
        'child-welfare-community-worker',
        'rainwater-watershed-technician',
      ],
      sourceUrl: 'https://egramswaraj.gov.in',
    },
    {
      title: 'Self-Help Group (SHG) Facilitator & Mobilizer',
      slug: 'shg-community-mobilizer',
      category: 'community',
      description:
        'Mobilizes rural women into cohesive Self-Help Groups (SHGs) and Village Organizations under the National Rural Livelihoods Mission (DAY-NRLM / Aajeevika). Trains members in maintaining group savings ledgers, setting internal lending interest rates, and opening bank accounts. Helps groups access bank credit linkage (Cash Credit Limits) and launch micro-enterprises like flour mills, spice grinding, and poultry.',
      requiredSkills: [
        'Team Collaboration & Trust Building',
        'Financial Literacy & Bookkeeping',
        'Active Listening & Empathy',
        'Presentation & Public Speaking',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'Active association with women self-help groups or community institutions',
      ],
      salaryRange: '₹1,44,000 - ₹2,60,000 per annum (NRLM community cadre honorarium and incentive)',
      demandLevel: 'high',
      growthOutlook: 'High (Empowerment of over 90 million rural women under DAY-NRLM Lakhpati Didi initiative)',
      firstSteps: [
        'Join or facilitate an SHG in your village to master Panchasutra rules (regular meetings, savings, lending, repayment, bookkeeping).',
        'Participate in cluster-level resource person (CRP) training organized by the State Rural Livelihoods Mission (SRLM).',
        'Learn to use LokOS, the government mobile app for SHG digital ledger digitisation.',
        'Help group members formulate business plans to benefit from the Lakhpati Didi initiative.',
      ],
      educationPaths: [
        'Class 10/12 → SRLM Certified Community Resource Person (CRP) Modules',
        'Graduation in Sociology / Social Work / Rural Management',
      ],
      relatedCareers: [
        'microfinance-loan-officer',
        'gram-sevak-panchayat-assistant',
        'anganwadi-early-educator',
      ],
      sourceUrl: 'https://aajeevika.gov.in',
    },
    {
      title: 'Child Welfare & Community Social Worker',
      slug: 'child-welfare-community-worker',
      category: 'community',
      description:
        'Works with grassroots NGOs and district child protection units to ensure child rights, prevent child labor, and eliminate school dropouts in vulnerable communities. Conducts family counseling sessions, assists orphans and single-parent households in securing government foster pensions (Mission Vatsalya), and coordinates with local police child-friendly units. Champions education and dignity for every child.',
      requiredSkills: [
        'Active Listening & Empathy',
        'Conflict Resolution & Mediation',
        'Civic Governance & Citizen Rights',
        'Presentation & Public Speaking',
      ],
      requiredQualifications: [
        'Class 12 or Bachelor of Social Work (BSW) / BA in Sociology or Psychology',
        'Demonstrated commitment to child protection or youth welfare',
      ],
      salaryRange: '₹1,80,000 - ₹3,20,000 per annum',
      demandLevel: 'medium',
      growthOutlook: 'High (Expansion of Mission Vatsalya and non-profit child safety helplines 1098 across districts)',
      firstSteps: [
        'Study the Juvenile Justice (JJ) Act, POCSO Act, and Right to Education (RTE) guidelines.',
        'Volunteer with local child rights non-profits (Childline, Pratham, Bachpan Bachao Andolan).',
        'Learn empathetic counseling approaches for distressed children and guardian reconciliation.',
        'Apply for project coordinator or field investigator posts in District Child Protection Units (DCPU).',
      ],
      educationPaths: [
        'Class 12 → Bachelor of Social Work (BSW, 3 Years)',
        'Graduation (Any) → Master of Social Work (MSW, 2 Years)',
      ],
      relatedCareers: [
        'primary-school-teacher',
        'gram-sevak-panchayat-assistant',
        'shg-community-mobilizer',
      ],
      sourceUrl: 'https://wcd.nic.in/mission-vatsalya',
    },

    // 12. Logistics, Manufacturing & Industry
    {
      title: 'Warehouse Operations & Inventory Associate',
      slug: 'warehouse-inventory-associate',
      category: 'manufacturing',
      description:
        'Receives bulk shipments, unloads cargo pallets, verifies manifests, and stores goods in designated shelving bins inside e-commerce fulfillment hubs and cold storages. Uses handheld barcode scanner terminals to pick customer order batches and packs parcels with protective bubble wrapping and shipping labels. Conducts routine cycle inventory counts to avoid stock variances.',
      requiredSkills: [
        'Inventory Barcode Scanning & Stock Counting',
        'Time Management & Punctuality',
        'Problem Solving & Troubleshooting',
        'Team Collaboration & Trust Building',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'Vocational training or prior warehouse material handling experience is advantageous',
      ],
      salaryRange: '₹1,80,000 - ₹3,00,000 per annum (plus overtime and night shift allowances)',
      demandLevel: 'high',
      growthOutlook: 'Very High (Proliferation of regional fulfillment hubs by Amazon, Flipkart, Delhivery, and Blinkit)',
      firstSteps: [
        'Familiarize yourself with warehouse storage zoning, SKU naming conventions, and FIFO inventory methods.',
        'Learn pallet jack operation, manual lifting posture safety, and RF barcode scanner usage.',
        'Complete short-term logistics certification through the Logistics Sector Skill Council (LSC).',
        'Apply to nearby highway logistics parks and express courier transit hubs.',
      ],
      educationPaths: [
        'Class 10/12 → LSC Warehouse Associate Certification (2 Months)',
        'Class 12 → BVoc in Supply Chain & Logistics Operations (3 Years)',
      ],
      relatedCareers: [
        'food-processing-machine-operator',
        'data-entry-verification-operator',
        'cnc-machine-operator',
      ],
      sourceUrl: 'https://lsc-india.com',
    },
    {
      title: 'Food Processing & Packaging Machine Operator',
      slug: 'food-processing-machine-operator',
      category: 'manufacturing',
      description:
        'Operates automated sorting, cleaning, drying, grinding, and nitrogen-flushed pouch packaging machinery at agro-processing plants (flour mills, spice units, fruit pulping, dairy). Regulates line temperatures, sealing bar pressures, and filling weights while performing hourly quality tests. Adheres strictly to FSSAI clean-room gowning and sanitization protocols.',
      requiredSkills: [
        'Food Hygiene & Safe Packaging',
        'Problem Solving & Troubleshooting',
        'Time Management & Punctuality',
        'Science & Physics Fundamentals',
      ],
      requiredQualifications: [
        'Class 10 or Class 12 pass',
        'ITI in Food Production / Instrument Mechanic OR PMKVY Food Processing Technician certificate',
      ],
      salaryRange: '₹1,80,000 - ₹3,20,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'High (Government PM Formalisation of Micro Food Processing Enterprises scheme PMFME)',
      firstSteps: [
        'Learn the principles of aseptic packaging, vacuum sealing, and moisture barrier film integrity.',
        'Obtain a Food Safety Supervisor certificate under FSSAI FoSTaC guidelines.',
        'Learn pneumatic sealer adjustments, date code printer programming, and preventive greasing.',
        'Apply to regional agro-industrial estates, dairy cooperatives (Amul, Mother Dairy), or spice factories.',
      ],
      educationPaths: [
        'Class 10 → 1-Year ITI Food Processing Trade',
        'Class 10/12 → FICSI (Food Industry Capacity & Skill Initiative) Certified Operator Course',
        'Class 10 → 3-Year Polytechnic Diploma in Food Technology',
      ],
      relatedCareers: [
        'warehouse-inventory-associate',
        'organic-farming-supervisor',
        'cnc-machine-operator',
      ],
      sourceUrl: 'https://ficsi.in',
    },
    {
      title: 'CNC Machine Operator & Quality Inspector',
      slug: 'cnc-machine-operator',
      category: 'manufacturing',
      description:
        'Loads metal workpieces, inputs G-code and M-code programs, and operates Computer Numerical Control (CNC) turning and milling centers in auto-component and machinery factories. Calibrates tool offsets, monitors coolant flows, and checks finished parts using vernier calipers, micrometers, and height gauges. Maintains precision dimensions within tight micron tolerances.',
      requiredSkills: [
        'CNC Machine Workholding',
        'Foundational Mathematics & Calculations',
        'Problem Solving & Troubleshooting',
        'Time Management & Punctuality',
      ],
      requiredQualifications: [
        'Class 10 pass',
        'ITI in Machinist / Turner / Tool & Die Maker OR Polytechnic Diploma in Mechanical Engineering',
      ],
      salaryRange: '₹2,00,000 - ₹3,80,000 per annum',
      demandLevel: 'high',
      growthOutlook: 'High (Make in India manufacturing expansion and defense/aerospace supply chains)',
      firstSteps: [
        'Enroll in ITI Machinist or Turner trade and learn G-code and M-code CNC programming.',
        'Practice precision workpiece clamping, dial indicator alignment, and digital caliper measurements.',
        'Undergo industrial training in an automotive or industrial machinery manufacturing facility.',
        'Learn Quality Control (QC) inspection recording, 5S practices, and CMM inspection basics.',
      ],
      educationPaths: [
        'Class 10 → 2-Year ITI Machinist / Turner Trade',
        'Class 10 → 3-Year Polytechnic Diploma in Mechanical Engineering',
        'Class 12 (Science) → BVoc in CNC Machining & Precision Manufacturing',
      ],
      relatedCareers: [
        'industrial-fitter-welder',
        'warehouse-inventory-associate',
        'food-processing-machine-operator',
      ],
      sourceUrl: 'https://dgt.gov.in',
    },
  ];

  for (const c of careersData) {
    const career = await prisma.career.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        category: c.category,
        description: c.description,
        requiredSkills: JSON.stringify(c.requiredSkills),
        requiredQualifications: JSON.stringify(c.requiredQualifications),
        salaryRange: c.salaryRange,
        demandLevel: c.demandLevel,
        growthOutlook: c.growthOutlook,
        firstSteps: JSON.stringify(c.firstSteps),
        educationPaths: JSON.stringify(c.educationPaths),
        relatedCareers: JSON.stringify(c.relatedCareers),
        isSampleData: true,
        sourceUrl: c.sourceUrl,
      },
      create: {
        title: c.title,
        slug: c.slug,
        category: c.category,
        description: c.description,
        requiredSkills: JSON.stringify(c.requiredSkills),
        requiredQualifications: JSON.stringify(c.requiredQualifications),
        salaryRange: c.salaryRange,
        demandLevel: c.demandLevel,
        growthOutlook: c.growthOutlook,
        firstSteps: JSON.stringify(c.firstSteps),
        educationPaths: JSON.stringify(c.educationPaths),
        relatedCareers: JSON.stringify(c.relatedCareers),
        isSampleData: true,
        sourceUrl: c.sourceUrl,
      },
    });

    // Link skills via CareerSkill
    for (const skillName of c.requiredSkills) {
      const skillId = skillRecordMap.get(skillName);
      if (skillId) {
        await prisma.careerSkill.upsert({
          where: {
            careerId_skillId: {
              careerId: career.id,
              skillId: skillId,
            },
          },
          update: { importance: 'required' },
          create: {
            careerId: career.id,
            skillId: skillId,
            importance: 'required',
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${careersData.length} careers across all 12 categories.`);

  // ============================================
  // 3. DEMO ORGANIZATIONS (9 organizations across 4 types)
  // ============================================
  console.log('🏢 Seeding Organizations...');
  const orgsData = [
    {
      id: 'org-pratham',
      name: 'Pratham Education Foundation',
      type: 'ngo',
      description:
        'One of India’s largest non-governmental organizations dedicated to improving quality of education and youth vocational skilling across rural communities.',
      expertise: JSON.stringify(['Foundational Literacy', 'Vocational Skilling', 'Youth Placement', 'Rural Research']),
      location: 'New Delhi & Pan-India',
      serviceArea: 'Pan-India (22 States)',
      contactUrl: 'https://pratham.org/contact',
      website: 'https://pratham.org',
      verified: true,
      isSampleData: true,
    },
    {
      id: 'org-barefoot',
      name: 'Barefoot College Tilonia',
      type: 'ngo',
      description:
        'Pioneering grassroots institution empowering rural women as "Solar Mamas", rainwater harvesting engineers, and community artisans through non-formal practical training.',
      expertise: JSON.stringify(['Solar Electrification', 'Rainwater Harvesting', 'Handicrafts', 'Women Empowerment']),
      location: 'Ajmer, Rajasthan',
      serviceArea: 'National & Global Rural South',
      contactUrl: 'https://barefootcollege.org/contact',
      website: 'https://barefootcollege.org',
      verified: true,
      isSampleData: true,
    },
    {
      id: 'org-agastya',
      name: 'Agastya International Foundation',
      type: 'ngo',
      description:
        'Transformational educational trust sparking hands-on science and innovation among rural children and teachers through Mobile Science Labs and eco-campus centers.',
      expertise: JSON.stringify(['Hands-on STEM Education', 'Mobile Science Labs', 'Teacher Training', 'Creative Learning']),
      location: 'Kuppam, Andhra Pradesh',
      serviceArea: 'Pan-India (20+ States)',
      contactUrl: 'https://agastya.org/contact',
      website: 'https://agastya.org',
      verified: true,
      isSampleData: true,
    },
    {
      id: 'org-bharat-mentors',
      name: 'Bharat Rural Youth Mentorship Collective',
      type: 'mentor',
      description:
        'A dedicated network of alumni, industry professionals, and civil service volunteers providing 1-on-1 virtual and in-person career navigation to rural scholars.',
      expertise: JSON.stringify(['1-on-1 Career Coaching', 'Mock Interviews', 'Scholarship Navigation', 'Resume Prep']),
      location: 'Bengaluru & Varanasi',
      serviceArea: 'Uttar Pradesh, Bihar, Madhya Pradesh, Rajasthan',
      contactUrl: 'https://nextlearning.example.org/mentors',
      website: 'https://nextlearning.example.org',
      verified: true,
      isSampleData: true,
    },
    {
      id: 'org-stem-mentors',
      name: 'Vigyan Jyoti Rural STEM Mentors Hub',
      type: 'mentor',
      description:
        'Peer mentorship network connecting rural schoolgirls and college students with women scientists, engineers, and technologists across Indian research institutions.',
      expertise: JSON.stringify(['STEM Mentorship for Girls', 'Research Opportunities', 'Higher Education Guidance']),
      location: 'Hyderabad, Telangana',
      serviceArea: 'Pan-India',
      contactUrl: 'https://vigyanjyoti.example.org',
      website: 'https://vigyanjyoti.example.org',
      verified: true,
      isSampleData: true,
    },
    {
      id: 'org-nsdc-hub',
      name: 'National Skill Development Corporation (NSDC) Partner Network',
      type: 'training_provider',
      description:
        'Public-private partnership promoting skill development through accredited training centers offering standardized qualification pack (QP-NOS) courses across trades.',
      expertise: JSON.stringify(['Skill Certification', 'Apprenticeships', 'PMKVY Implementation', 'Industry Partnerships']),
      location: 'New Delhi & District Centers',
      serviceArea: 'All 700+ Districts in India',
      contactUrl: 'https://nsdcindia.org/contact',
      website: 'https://nsdcindia.org',
      verified: true,
      isSampleData: true,
    },
    {
      id: 'org-rseti-varanasi',
      name: 'Rural Self Employment Training Institute (RSETI) Varanasi Chapter',
      type: 'training_provider',
      description:
        'Lead bank-managed residential training institute providing free hands-on entrepreneurship and skilled trades courses with guaranteed bank credit linkage for rural youth.',
      expertise: JSON.stringify(['Entrepreneurship Training', 'Dairy & Poultry', 'Solar Technician', 'Electrician Work', 'Mudra Loans']),
      location: 'Varanasi, Uttar Pradesh',
      serviceArea: 'Eastern Uttar Pradesh',
      contactUrl: 'https://rseti.org/varanasi',
      website: 'https://rseti.org',
      verified: true,
      isSampleData: true,
    },
    {
      id: 'org-tcit',
      name: 'Tata Community Initiatives Trust (TCIT)',
      type: 'employer',
      description:
        'Social enterprise arm of Tata Group fostering rural livelihoods, technical apprenticeships, and direct recruitment drives across manufacturing, logistics, and hospitality.',
      expertise: JSON.stringify(['Apprenticeships', 'Industrial Training', 'Skill Academies', 'Direct Placement']),
      location: 'Mumbai, Maharashtra',
      serviceArea: 'Pan-India',
      contactUrl: 'https://tatatrusts.org/livelihoods',
      website: 'https://tatatrusts.org',
      verified: true,
      isSampleData: true,
    },
    {
      id: 'org-dehaat',
      name: 'DeHaat Agritech Farmer Livelihoods Hub',
      type: 'employer',
      description:
        'Rapidly expanding agricultural technology ecosystem offering village employment for drone pilots, soil lab operators, agronomists, and micro-hub logistics leads.',
      expertise: JSON.stringify(['Agritech Employment', 'Drone Spraying Services', 'Input Supply Chains', 'Farmer Advisory']),
      location: 'Patna, Bihar & Gurugram, Haryana',
      serviceArea: 'Bihar, UP, MP, West Bengal, Odisha, Maharashtra',
      contactUrl: 'https://agrevolution.in/careers',
      website: 'https://agrevolution.in',
      verified: true,
      isSampleData: true,
    },
  ];

  for (const org of orgsData) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: org,
      create: org,
    });
  }
  console.log(`✅ Seeded ${orgsData.length} organizations.`);

  // ============================================
  // 4. DEMO OPPORTUNITIES (18 opportunities across 7 categories)
  // ============================================
  console.log('🎯 Seeding Opportunities...');
  const opportunitiesData = [
    // Scholarship (3)
    {
      id: 'opp-pm-yasasvi',
      title: 'PM-YASASVI Post-Matric Scholarship for OBC / EBC / DNT Students',
      category: 'scholarship',
      provider: 'Ministry of Social Justice & Empowerment, Govt of India',
      description:
        'Financial scholarship scheme covering tuition fees, hostel allowance, and book grants for meritorious students belonging to OBC, EBC, and DNT categories studying in Class 9 through Post-Graduation.',
      eligibleLevels: JSON.stringify(['class_9', 'class_10', 'class_11', 'class_12', 'undergraduate', 'postgraduate']),
      eligibilityRules: JSON.stringify([
        { field: 'familyIncomeMax', value: 250000, description: 'Annual family income must not exceed ₹2.5 Lakhs' },
        { field: 'category', value: ['OBC', 'EBC', 'DNT'], description: 'Valid category certificate required' },
      ]),
      location: 'Pan-India / All States',
      skills: JSON.stringify(['Foundational Mathematics & Calculations', 'Vernacular Language Fluency & Writing']),
      openDate: new Date('2026-07-01'),
      closeDate: new Date('2026-11-30'),
      requiredDocuments: JSON.stringify(['Aadhaar Card', 'Income Certificate', 'Category Certificate', 'Previous Year Marksheet', 'Bank Passbook']),
      applicationUrl: 'https://scholarships.gov.in',
      sourceUrl: 'https://socialjustice.gov.in/schemes/pm-yasasvi',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-begum-hazrat-mahal',
      title: 'Begum Hazrat Mahal National Scholarship for Meritorious Girls',
      category: 'scholarship',
      provider: 'Maulana Azad Education Foundation, Ministry of Minority Affairs',
      description:
        'Direct cash transfer scholarship for meritorious girl students from notified minority communities studying in Classes 9 to 12. Provides ₹5,000 to ₹6,000 annually to support academic retention.',
      eligibleLevels: JSON.stringify(['class_9', 'class_10', 'class_11', 'class_12']),
      eligibilityRules: JSON.stringify([
        { field: 'gender', value: 'female', description: 'Girl students only' },
        { field: 'minimumMarks', value: 50, description: 'At least 50% aggregate in qualifying examination' },
        { field: 'familyIncomeMax', value: 200000, description: 'Family income under ₹2.0 Lakhs per annum' },
      ]),
      location: 'Pan-India',
      skills: JSON.stringify(['English Reading & Conversational Basics', 'Foundational Mathematics & Calculations']),
      openDate: new Date('2026-08-01'),
      closeDate: new Date('2026-12-15'),
      requiredDocuments: JSON.stringify(['Marksheet', 'Income Certificate', 'Minority Community Self-Declaration', 'Bank Account Details']),
      applicationUrl: 'https://scholarships.gov.in',
      sourceUrl: 'https://maef.nic.in',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-vidyadhan-rural',
      title: 'Vidyadhan Rural College Scholarship Program',
      category: 'scholarship',
      provider: 'Sarojini Damodaran Foundation',
      description:
        'Sponsors bright rural students through their 2-year higher secondary (+2) and degree courses. In addition to financial sponsorship, students receive holistic mentorship, soft skills training, and study devices.',
      eligibleLevels: JSON.stringify(['class_10', 'class_11', 'class_12', 'undergraduate']),
      eligibilityRules: JSON.stringify([
        { field: 'minimumMarks', value: 85, description: '85% or equivalent in Class 10 Board exam' },
        { field: 'familyIncomeMax', value: 200000, description: 'Annual household income below ₹2 Lakhs' },
      ]),
      location: 'UP, Bihar, Kerala, Karnataka, Maharashtra, Odisha',
      skills: JSON.stringify(['Active Listening & Empathy', 'English Reading & Conversational Basics']),
      openDate: new Date('2026-05-01'),
      closeDate: new Date('2026-07-31'),
      requiredDocuments: JSON.stringify(['Class 10 Marksheet', 'Ration Card / Income Certificate', 'Passport Photograph']),
      applicationUrl: 'https://vidyadhan.org/apply',
      sourceUrl: 'https://vidyadhan.org',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },

    // Scheme (3)
    {
      id: 'opp-pm-vishwakarma',
      title: 'PM Vishwakarma Scheme - Traditional Artisan Toolkit & Skilling Grant',
      category: 'scheme',
      provider: 'Ministry of Micro, Small & Medium Enterprises (MSME)',
      description:
        'Comprehensive support package for 18 traditional artisan trades (carpenters, blacksmiths, potters, cobblers, tailors). Offers 5-7 days basic skilling with ₹500/day stipend, a ₹15,000 digital toolkit voucher, and collateral-free enterprise credit up to ₹3 Lakhs at 5% interest.',
      eligibleLevels: JSON.stringify(['class_8', 'class_9', 'class_10', 'vocational_iti', 'open_school']),
      eligibilityRules: JSON.stringify([
        { field: 'ageMin', value: 18, description: 'Minimum age 18 years' },
        { field: 'occupation', value: 'Traditional artisan or craftsperson', description: 'Practicing one of the 18 nominated trades' },
      ]),
      location: 'Pan-India',
      skills: JSON.stringify(['MIG & Manual Metal Arc Welding', 'Plumbing & Pipe Fitting', 'Domestic Electrical Wiring & Safety']),
      openDate: new Date('2026-01-01'),
      closeDate: new Date('2027-03-31'),
      requiredDocuments: JSON.stringify(['Aadhaar Card', 'Mobile Linked Bank Account', 'Ration Card']),
      applicationUrl: 'https://pmvishwakarma.gov.in',
      sourceUrl: 'https://msme.gov.in/pm-vishwakarma',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-pm-surya-ghar-skilling',
      title: 'PM Surya Ghar - Rooftop Solar Technician Certified Skilling Program',
      category: 'scheme',
      provider: 'Ministry of New and Renewable Energy (MNRE) & Skill Council for Green Jobs',
      description:
        'Special training drive to certify 100,000 youth as Surya Mitra technicians to install and maintain 10 million household rooftop solar systems. Includes hands-on rooftop safety, structure alignment, inverter wiring, and net-metering protocols with placement support.',
      eligibleLevels: JSON.stringify(['class_10', 'class_12', 'vocational_iti', 'polytechnic_diploma']),
      eligibilityRules: JSON.stringify([
        { field: 'education', value: 'Class 10 or ITI pass', description: 'Class 10 or ITI in electrical/wireman trade' },
      ]),
      location: 'Pan-India / District ITIs',
      skills: JSON.stringify(['Solar PV Array Mounting & Structure Fixing', 'Solar Panel Testing & Multimeter Operation', 'Domestic Electrical Wiring & Safety']),
      openDate: new Date('2026-02-01'),
      closeDate: new Date('2026-12-31'),
      requiredDocuments: JSON.stringify(['Aadhaar Card', 'Class 10 / ITI Marksheet', 'Two Passport Photographs']),
      applicationUrl: 'https://pmsuryaghar.gov.in',
      sourceUrl: 'https://mnre.gov.in',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-pmkvy-4-skilling',
      title: 'PMKVY 4.0 - Short Term Skill Training with NSDC Certification',
      category: 'scheme',
      provider: 'Ministry of Skill Development & Entrepreneurship (MSDE)',
      description:
        'Free industry-aligned short term technical courses (200-400 hours) across emerging job roles like Drone Technician, EV Servicing, Healthcare Assistant, and Web Development. Trainees receive free uniforms, course materials, and post-placement tracking.',
      eligibleLevels: JSON.stringify(['class_8', 'class_9', 'class_10', 'class_12', 'vocational_iti', 'undergraduate']),
      eligibilityRules: JSON.stringify([
        { field: 'ageMin', value: 15, description: 'Age between 15 to 45 years' },
        { field: 'citizenship', value: 'Indian citizen', description: 'Resident of India' },
      ]),
      location: 'Pradhan Mantri Kaushal Kendras (PMKK) across all districts',
      skills: JSON.stringify(['Two-Wheeler / Electric Vehicle Servicing', 'Agricultural Drone Piloting', 'Frontend Web Development (HTML/CSS/JS)']),
      openDate: new Date('2026-01-15'),
      closeDate: new Date('2026-11-30'),
      requiredDocuments: JSON.stringify(['Aadhaar Card', 'Educational Certificate', 'Bank Account Passbook']),
      applicationUrl: 'https://skillindiadigital.gov.in',
      sourceUrl: 'https://pmkvyofficial.org',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },

    // Apprenticeship (3)
    {
      id: 'opp-naps-discom-apprentice',
      title: 'NAPS National Apprenticeship - State Power Distribution Hubs',
      category: 'apprenticeship',
      provider: 'State Electricity Distribution Companies (UPPCL / SBPDCL / MSEDCL) & NAPS',
      description:
        '1-year paid apprenticeship for ITI Electricians and Wiremen. Apprentices work directly under senior sub-station engineers maintaining 11kV lines, repairing transformer burnouts, and connecting smart meters. Includes a monthly government-subsidized stipend of ₹8,000 - ₹10,500.',
      eligibleLevels: JSON.stringify(['vocational_iti', 'polytechnic_diploma']),
      eligibilityRules: JSON.stringify([
        { field: 'qualification', value: 'ITI Electrician/Wireman pass', description: 'NCVT or SCVT affiliated ITI certificate' },
      ]),
      location: 'Uttar Pradesh, Bihar, Maharashtra, Rajasthan, MP',
      skills: JSON.stringify(['Domestic Electrical Wiring & Safety', 'Problem Solving & Troubleshooting', 'Solar Panel Testing & Multimeter Operation']),
      openDate: new Date('2026-04-01'),
      closeDate: new Date('2026-06-30'),
      requiredDocuments: JSON.stringify(['NAPS Portal Registration Number', 'ITI Consolidated Marksheet', 'Aadhaar Card', 'Police Verification']),
      applicationUrl: 'https://apprenticeshipindia.gov.in',
      sourceUrl: 'https://dgt.gov.in/apprenticeship-training',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-railway-apprentice',
      title: 'Indian Railways Trade Apprenticeship Drive (Fitter, Welder, Machinist)',
      category: 'apprenticeship',
      provider: 'Railway Recruitment Cell (Northern & North-Eastern Railways)',
      description:
        'Act Apprentice training opportunities across locomotive carriage and wagon workshops. Receive hands-on exposure to high-pressure pneumatic braking systems, bogey assembly, and submerged arc welding. National Apprenticeship Certificate (NAC) grants preferential marks in Level-1 railway track maintainer recruitments.',
      eligibleLevels: JSON.stringify(['class_10', 'vocational_iti']),
      eligibilityRules: JSON.stringify([
        { field: 'qualification', value: 'Class 10 (50% min) + ITI', description: 'Class 10 with 50% plus valid ITI in Fitter/Welder/Machinist' },
        { field: 'ageRange', value: '15-24 years', description: 'Age relaxations applicable as per norms' },
      ]),
      location: 'Varanasi, Gorakhpur, Lucknow, Patna, Jhansi, Jamalpur',
      skills: JSON.stringify(['MIG & Manual Metal Arc Welding', 'CNC Machine Workholding', 'Time Management & Punctuality']),
      openDate: new Date('2026-06-15'),
      closeDate: new Date('2026-08-15'),
      requiredDocuments: JSON.stringify(['Class 10 Certificate', 'ITI Trade Certificate', 'Community / Caste Certificate', 'Medical Fitness Certificate']),
      applicationUrl: 'https://rrcnr.org',
      sourceUrl: 'https://indianrailways.gov.in',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-mahindra-agritech-apprentice',
      title: 'Mahindra Rural Agritech & Tractor Service Apprentice',
      category: 'apprenticeship',
      provider: 'Mahindra & Mahindra Farm Equipment Sector',
      description:
        '12-month structured workshop and on-field apprenticeship diagnosing modern tractor hydraulics, CRDi diesel fuel injectors, electronic dashboard sensors, and rotavator gearboxes across rural dealership workshops. Includes monthly stipend of ₹9,500 plus subsidized canteen facilities.',
      eligibleLevels: JSON.stringify(['class_10', 'vocational_iti', 'polytechnic_diploma']),
      eligibilityRules: JSON.stringify([
        { field: 'trade', value: 'Mechanic Motor Vehicle / Diesel / Tractor Mechanic', description: 'ITI pass in automotive trades' },
      ]),
      location: 'Punjab, Haryana, UP, MP, Gujarat, Karnataka',
      skills: JSON.stringify(['Two-Wheeler / Electric Vehicle Servicing', 'Problem Solving & Troubleshooting', 'Customer Communication & Service']),
      openDate: new Date('2026-03-01'),
      closeDate: new Date('2026-07-31'),
      requiredDocuments: JSON.stringify(['ITI Marksheet', 'Aadhaar Card', 'Driving License (preferred)']),
      applicationUrl: 'https://mahindra.com/careers/apprenticeships',
      sourceUrl: 'https://mahindra.com',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },

    // Internship (3)
    {
      id: 'opp-bhashini-intern',
      title: 'Digital India Bhashini Vernacular Language Annotation Internship',
      category: 'internship',
      provider: 'Ministry of Electronics & Information Technology (MeitY) & IIT Madras',
      description:
        'Remote / regional internship validating speech recordings, transcribing vernacular audio clips, and annotating local language dialect sentences to train India’s national AI translation engine. Interns earn performance-based milestone stipends of ₹6,000 - ₹12,000 per month.',
      eligibleLevels: JSON.stringify(['class_12', 'undergraduate', 'postgraduate']),
      eligibilityRules: JSON.stringify([
        { field: 'language', value: 'Fluent in regional language and English', description: 'Ability to read and type accurately in regional language' },
        { field: 'hardware', value: 'Android smartphone or laptop', description: 'Consistent 4G internet connection' },
      ]),
      location: 'Remote / Work from Anywhere in India',
      skills: JSON.stringify(['Vernacular Language Fluency & Writing', 'English Reading & Conversational Basics', 'Smartphone Navigation & App Usage']),
      openDate: new Date('2026-03-01'),
      closeDate: new Date('2026-08-31'),
      requiredDocuments: JSON.stringify(['College ID / Class 12 Certificate', 'Aadhaar Card']),
      applicationUrl: 'https://bhashini.gov.in/internships',
      sourceUrl: 'https://bhashini.gov.in',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-nabard-fellow-intern',
      title: 'NABARD Rural Livelihoods & FPO Field Research Internship',
      category: 'internship',
      provider: 'National Bank for Agriculture and Rural Development (NABARD)',
      description:
        '3-month immersive summer internship for college graduates to live in rural blocks, conduct baseline surveys of Farmer Producer Organizations (FPOs) and Self-Help Groups, and recommend digitization roadmaps. Offers ₹15,000 monthly stipend plus field travel reimbursement.',
      eligibleLevels: JSON.stringify(['undergraduate', 'postgraduate']),
      eligibilityRules: JSON.stringify([
        { field: 'course', value: 'Agriculture, Commerce, Economics, Rural Development', description: 'Enrolled in 2nd/3rd year of undergraduate or master degree' },
      ]),
      location: 'District NABARD Offices (Pan-India)',
      skills: JSON.stringify(['Data Interpretation & Record Maintenance', 'Financial Literacy & Bookkeeping', 'Team Collaboration & Trust Building']),
      openDate: new Date('2026-02-15'),
      closeDate: new Date('2026-04-30'),
      requiredDocuments: JSON.stringify(['College Recommendation Letter', 'Detailed Resume', 'Marksheet']),
      applicationUrl: 'https://nabard.org/careers',
      sourceUrl: 'https://nabard.org',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-agnext-field-intern',
      title: 'AgNext Commodity Quality Assessment Field Intern',
      category: 'internship',
      provider: 'AgNext Technologies Pvt Ltd',
      description:
        'Hands-on field internship operating AI-powered spectrochemical grain scanners at agricultural mandis. Assist agricultural traders and farmers in instantly analyzing grain moisture, protein, and broken percentage. Monthly stipend of ₹12,000.',
      eligibleLevels: JSON.stringify(['class_12', 'vocational_iti', 'polytechnic_diploma', 'undergraduate']),
      eligibilityRules: JSON.stringify([
        { field: 'techFamiliarity', value: 'Comfortable with Android devices', description: 'Willingness to visit local agricultural wholesale grain markets' },
      ]),
      location: 'Punjab, UP, MP, Rajasthan Mandis',
      skills: JSON.stringify(['Soil Sample Testing & Chemistry', 'Smartphone Navigation & App Usage', 'Customer Communication & Service']),
      openDate: new Date('2026-05-01'),
      closeDate: new Date('2026-09-30'),
      requiredDocuments: JSON.stringify(['Resume', 'Aadhaar Card']),
      applicationUrl: 'https://agnext.com/careers',
      sourceUrl: 'https://agnext.com',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },

    // Mentorship (2)
    {
      id: 'opp-nextlearning-youth-circle',
      title: 'NextLearning Bharat Rural Youth Mentorship Circle',
      category: 'mentorship',
      provider: 'Bharat Rural Youth Mentorship Collective & NextLearning Platform',
      description:
        '6-month cohort matching rural first-generation learners with industry professionals and college mentors. Includes weekly 45-minute audio calls, guidance on choosing college degrees or vocational trades, resume building, and scholarship application feedback.',
      eligibleLevels: JSON.stringify(['class_9', 'class_10', 'class_11', 'class_12', 'vocational_iti', 'undergraduate']),
      eligibilityRules: JSON.stringify([
        { field: 'commitment', value: '2 hours per week', description: 'Dedication to complete scheduled mentorship calls and exercises' },
      ]),
      location: 'Pan-India (Virtual / Dial-in Audio Circles)',
      skills: JSON.stringify(['Active Listening & Empathy', 'Presentation & Public Speaking', 'Adaptability & Continuous Learning']),
      openDate: new Date('2026-01-01'),
      closeDate: new Date('2026-12-31'),
      requiredDocuments: JSON.stringify(['Student ID / NextLearning Profile']),
      applicationUrl: 'https://nextlearning.example.org/mentorship-apply',
      sourceUrl: 'https://nextlearning.example.org',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-women-stem-mentor',
      title: 'Women in Rural STEM Peer Mentorship Network',
      category: 'mentorship',
      provider: 'Vigyan Jyoti Rural STEM Mentors Hub',
      description:
        'Dedicated mentorship initiative designed to inspire and guide girls from rural government schools pursuing science, mathematics, coding, and engineering. Connects scholars with women researchers from IITs, IISc, and ISRO.',
      eligibleLevels: JSON.stringify(['class_9', 'class_10', 'class_11', 'class_12', 'polytechnic_diploma']),
      eligibilityRules: JSON.stringify([
        { field: 'gender', value: 'female', description: 'Open to girls and young women' },
        { field: 'stream', value: 'Science or Mathematics', description: 'Curiosity or active study in STEM disciplines' },
      ]),
      location: 'Pan-India',
      skills: JSON.stringify(['Science & Physics Fundamentals', 'Foundational Mathematics & Calculations']),
      openDate: new Date('2026-02-01'),
      closeDate: new Date('2026-11-30'),
      requiredDocuments: JSON.stringify(['School Bonafide Certificate']),
      applicationUrl: 'https://vigyanjyoti.example.org/apply',
      sourceUrl: 'https://dst.gov.in',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },

    // Training (2)
    {
      id: 'opp-ddugky-skilling',
      title: 'DDU-GKY Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
      category: 'training',
      provider: 'Ministry of Rural Development (MoRD)',
      description:
        'Placement-linked residential skill development program for poor rural youth between 15 and 35 years. Provides 100% free lodging, boarding, modern computer labs, uniforms, and guaranteed post-training placement in organized corporate sectors.',
      eligibleLevels: JSON.stringify(['class_8', 'class_10', 'class_12', 'vocational_iti']),
      eligibilityRules: JSON.stringify([
        { field: 'category', value: 'BPL / MGNREGS card holder families', description: 'Rural poor youth identification' },
        { field: 'age', value: '15-35 years (up to 45 for women/PWD)', description: 'Age criteria' },
      ]),
      location: 'Residential Centers across all Indian States',
      skills: JSON.stringify(['Customer Communication & Service', 'Inventory Barcode Scanning & Stock Counting', 'Basic Computer Operations']),
      openDate: new Date('2026-01-01'),
      closeDate: new Date('2026-12-31'),
      requiredDocuments: JSON.stringify(['Aadhaar Card', 'Ration Card / BPL Proof', 'Class 10/12 Marksheet']),
      applicationUrl: 'https://ddugky.gov.in',
      sourceUrl: 'https://rural.nic.in',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-rseti-poultry-dairy',
      title: 'RSETI Rural Self Employment Training - Commercial Dairy & Poultry',
      category: 'training',
      provider: 'Rural Self Employment Training Institute (RSETI) Varanasi Chapter',
      description:
        '10-day intensive residential bootcamp covering silage preparation, cattle breed selection, disease vaccination, veterinary first aid, and automated milk testing. Graduates receive a formal training certificate and pre-approved Mudra / KCC loan facilitation.',
      eligibleLevels: JSON.stringify(['class_8', 'class_10', 'class_12', 'open_school']),
      eligibilityRules: JSON.stringify([
        { field: 'interest', value: 'Desire to start self-employment enterprise', description: 'Resident of rural district' },
      ]),
      location: 'Varanasi, UP',
      skills: JSON.stringify(['Financial Literacy & Bookkeeping', 'Environmental & Ecological Awareness', 'Team Collaboration & Trust Building']),
      openDate: new Date('2026-03-01'),
      closeDate: new Date('2026-10-31'),
      requiredDocuments: JSON.stringify(['Aadhaar Card', 'Village Pradhan Residence Certificate', 'Passport Photos']),
      applicationUrl: 'https://rseti.org/varanasi/apply',
      sourceUrl: 'https://rseti.org',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },

    // Employment (2)
    {
      id: 'opp-india-post-gds',
      title: 'India Post Gramin Dak Sevak (GDS) Branch Postmaster Assistant',
      category: 'employment',
      provider: 'Department of Posts, Ministry of Communications',
      description:
        'Recruitment for Gramin Dak Sevaks (Branch Postmasters and Assistant Branch Postmasters) at rural branch post offices. Responsibilities include handling postal mail dispatch, managing IPPB savings deposits, executing DBT cash payouts, and selling postal life insurance.',
      eligibleLevels: JSON.stringify(['class_10']),
      eligibilityRules: JSON.stringify([
        { field: 'qualification', value: 'Class 10 pass with Mathematics & English', description: 'Merit list compiled automatically from Class 10 marks' },
        { field: 'language', value: 'Local vernacular language studied up to Class 10', description: 'Must have studied regional language as a compulsory subject' },
      ]),
      location: 'Pan-India Rural Branch Post Offices',
      skills: JSON.stringify(['Foundational Mathematics & Calculations', 'Vernacular Language Fluency & Writing', 'Basic Computer Operations']),
      openDate: new Date('2026-05-15'),
      closeDate: new Date('2026-06-30'),
      requiredDocuments: JSON.stringify(['Class 10 Marksheet', 'Computer Training Certificate (60 days min)', 'Aadhaar Card']),
      applicationUrl: 'https://indiapostgdsonline.gov.in',
      sourceUrl: 'https://indiapost.gov.in',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
    {
      id: 'opp-spandana-loan-officer',
      title: 'Spandana Sphoorty Rural Field Credit Officer Walk-in Drive',
      category: 'employment',
      provider: 'Spandana Sphoorty Financial Limited',
      description:
        'Immediate hiring of energetic field executives to manage microfinance group loan operations across eastern UP blocks. Package includes fixed monthly salary of ₹16,000 - ₹20,000, monthly fuel reimbursements, health insurance, and attractive quarterly collection incentives.',
      eligibleLevels: JSON.stringify(['class_12', 'vocational_iti', 'undergraduate']),
      eligibilityRules: JSON.stringify([
        { field: 'license', value: 'Valid two-wheeler driving license', description: 'Must own or have access to a two-wheeler' },
        { field: 'age', value: '20-28 years', description: 'Freshers and experienced both welcome' },
      ]),
      location: 'Varanasi, Mirzapur, Jaunpur, Ghazipur (UP)',
      skills: JSON.stringify(['Financial Literacy & Bookkeeping', 'Customer Communication & Service', 'Two-Wheeler / Electric Vehicle Servicing']),
      openDate: new Date('2026-04-01'),
      closeDate: new Date('2026-09-30'),
      requiredDocuments: JSON.stringify(['Updated Resume', 'Class 12 / Degree Marksheet', 'Driving License', 'Aadhaar Card']),
      applicationUrl: 'https://spandanasphoorty.com/careers',
      sourceUrl: 'https://spandanasphoorty.com',
      lastVerified: new Date(),
      verificationStatus: 'sample',
      isSampleData: true,
    },
  ];

  for (const opp of opportunitiesData) {
    await prisma.opportunity.upsert({
      where: { id: opp.id },
      update: opp,
      create: opp,
    });
  }
  console.log(`✅ Seeded ${opportunitiesData.length} opportunities.`);

  // ============================================
  // 5. DEMO LEARNING RESOURCES (11 resources)
  // ============================================
  console.log('📚 Seeding Learning Resources...');
  const resourcesData = [
    {
      id: 'res-diksha-basic-electricity',
      title: 'DIKSHA: Foundational Principles of Electric Current & Circuit Safety (Class 10 Science)',
      description:
        'Interactive NCERT digital textbook unit explaining electric charge, Ohm’s law, series vs parallel circuits, Joule’s heating effect, and domestic wiring earthing safety with bilingual Hindi-English diagrams.',
      provider: 'NCERT / DIKSHA National Portal',
      resourceType: 'course',
      url: 'https://diksha.gov.in/ncert/class-10-science-electricity',
      language: 'hi',
      educationLevel: JSON.stringify(['class_9', 'class_10', 'vocational_iti']),
      subjects: JSON.stringify(['Physics', 'Science', 'Trades']),
      skills: JSON.stringify(['Science & Physics Fundamentals', 'Domestic Electrical Wiring & Safety']),
      duration: '4 hours',
      difficulty: 'beginner',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-swayam-solar-basics',
      title: 'SWAYAM / NPTEL: Solar Photovoltaic Energy Fundamentals & Sizing',
      description:
        'Free video lecture series by IIT professors on solar irradiance, PV module physics, maximum power point tracking (MPPT), battery charge controllers, and off-grid vs on-grid rooftop system design.',
      provider: 'SWAYAM / NPTEL (Ministry of Education)',
      resourceType: 'course',
      url: 'https://swayam.gov.in/course/solar-pv-energy',
      language: 'en',
      educationLevel: JSON.stringify(['class_11', 'class_12', 'vocational_iti', 'polytechnic_diploma', 'undergraduate']),
      subjects: JSON.stringify(['Physics', 'Renewable Energy', 'Engineering']),
      skills: JSON.stringify(['Solar PV Array Mounting & Structure Fixing', 'Solar Panel Testing & Multimeter Operation']),
      duration: '12 hours',
      difficulty: 'intermediate',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-skill-india-multimeter',
      title: 'Skill India Digital: How to Use a Digital Multimeter for Troubleshooting',
      description:
        'Step-by-step practical video demonstration showing how to test DC voltage, AC mains, continuity buzzers, diode drops, and component resistance without damaging test leads or circuit boards.',
      provider: 'Skill India Digital Hub (NSDC)',
      resourceType: 'video',
      url: 'https://skillindiadigital.gov.in/video/multimeter-guide',
      language: 'hi',
      educationLevel: JSON.stringify(['class_8', 'class_10', 'vocational_iti']),
      subjects: JSON.stringify(['Practical Electronics', 'Trades']),
      skills: JSON.stringify(['Solar Panel Testing & Multimeter Operation', 'Problem Solving & Troubleshooting']),
      duration: '25 minutes',
      difficulty: 'beginner',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-khan-algebra-arithmetic',
      title: 'Khan Academy India: Practical Arithmetic & Financial Math for Daily Business',
      description:
        'Master percentages, simple interest, profit and loss calculations, unitary method, and ratio-proportions with interactive practice drills translated into Hindi and Hinglish.',
      provider: 'Khan Academy India',
      resourceType: 'activity',
      url: 'https://hi.khanacademy.org/math/commercial-arithmetic',
      language: 'hi',
      educationLevel: JSON.stringify(['class_8', 'class_9', 'class_10', 'vocational_iti']),
      subjects: JSON.stringify(['Mathematics', 'Commerce']),
      skills: JSON.stringify(['Foundational Mathematics & Calculations', 'Financial Literacy & Bookkeeping']),
      duration: '6 hours',
      difficulty: 'beginner',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-diksha-agriculture-soil',
      title: 'DIKSHA: Soil Health Management & Vermicomposting Practical Guide',
      description:
        'Illustrated farmer-friendly guide on preparing earthworm pits, testing soil texture with water bottles, identifying nitrogen and zinc deficiencies, and producing rich organic compost.',
      provider: 'ICAR / Krishi Vigyan Kendra Portal',
      resourceType: 'article',
      url: 'https://diksha.gov.in/icar/soil-health-vermicomposting',
      language: 'hi',
      educationLevel: JSON.stringify(['class_8', 'class_10', 'vocational_iti', 'open_school']),
      subjects: JSON.stringify(['Agriculture', 'Biology', 'Environment']),
      skills: JSON.stringify(['Soil Sample Testing & Chemistry', 'Environmental & Ecological Awareness']),
      duration: '45 minutes',
      difficulty: 'beginner',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-spoken-tutorial-python',
      title: 'Spoken Tutorial IIT Bombay: Python Programming for Beginners in Hindi',
      description:
        'Audio-video screencast tutorial teaching programming logic, variables, loops, lists, and functions using open-source Python. Designed specifically for students without prior coding experience.',
      provider: 'IIT Bombay / Spoken Tutorial Project',
      resourceType: 'course',
      url: 'https://spoken-tutorial.org/tutorial-search/?search_foss=Python-3.4.3&search_language=Hindi',
      language: 'hi',
      educationLevel: JSON.stringify(['class_10', 'class_11', 'class_12', 'undergraduate']),
      subjects: JSON.stringify(['Computer Science', 'Coding']),
      skills: JSON.stringify(['Frontend Web Development (HTML/CSS/JS)', 'Problem Solving & Troubleshooting']),
      duration: '8 hours',
      difficulty: 'beginner',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-ncvet-ev-servicing',
      title: 'NCVET: Electric Two-Wheeler Battery Disassembly & Safety Protocols',
      description:
        'Comprehensive technical safety video outlining high-voltage disconnect procedures, insulated glove ratings, thermal runaway containment, and lithium cell pack diagnostics.',
      provider: 'Automotive Skills Development Council (ASDC)',
      resourceType: 'video',
      url: 'https://asdc.org.in/learning/ev-battery-safety',
      language: 'en',
      educationLevel: JSON.stringify(['class_10', 'vocational_iti', 'polytechnic_diploma']),
      subjects: JSON.stringify(['Automobile', 'Electrical Engineering']),
      skills: JSON.stringify(['Two-Wheeler / Electric Vehicle Servicing', 'Domestic Electrical Wiring & Safety']),
      duration: '35 minutes',
      difficulty: 'intermediate',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-nasscom-digital-skills',
      title: 'FutureSkills Prime: Essential Cybersecurity & Online Digital Safety for Youth',
      description:
        'Interactive module on recognizing phishing scams, protecting OTPs, verifying secure HTTPS sites, safeguarding UPI transactions, and securing social media accounts.',
      provider: 'NASSCOM / MeitY FutureSkills Prime',
      resourceType: 'quiz',
      url: 'https://futureskillsprime.in/course/cybersecurity-basics',
      language: 'en',
      educationLevel: JSON.stringify(['class_9', 'class_10', 'class_11', 'class_12', 'undergraduate']),
      subjects: JSON.stringify(['Digital Literacy', 'Computer Science']),
      skills: JSON.stringify(['Smartphone Navigation & App Usage', 'Basic Computer Operations']),
      duration: '1.5 hours',
      difficulty: 'beginner',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-nios-english-communication',
      title: 'NIOS Open School: Spoken English & Workplace Communication Handbook',
      description:
        'Self-instructional language guide for conversational confidence in customer service, job interviews, phone inquiries, and writing simple workplace email correspondence.',
      provider: 'National Institute of Open Schooling (NIOS)',
      resourceType: 'article',
      url: 'https://nios.ac.in/secondary-courses/english-communication.aspx',
      language: 'en',
      educationLevel: JSON.stringify(['class_10', 'class_12', 'vocational_iti']),
      subjects: JSON.stringify(['English', 'Communication']),
      skills: JSON.stringify(['English Reading & Conversational Basics', 'Customer Communication & Service']),
      duration: '5 hours',
      difficulty: 'beginner',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-ignou-microfinance',
      title: 'IGNOU: Fundamentals of Rural Microfinance & Self-Help Group Accounting',
      description:
        'Open educational study unit explaining the dynamics of rural credit, SHG ledger keeping, loan passbooks, repayment calculations, and community empowerment models.',
      provider: 'Indira Gandhi National Open University (IGNOU eGyanKosh)',
      resourceType: 'article',
      url: 'https://egyankosh.ac.in/handle/123456789/rural-microfinance',
      language: 'hi',
      educationLevel: JSON.stringify(['class_12', 'undergraduate']),
      subjects: JSON.stringify(['Commerce', 'Economics', 'Social Work']),
      skills: JSON.stringify(['Financial Literacy & Bookkeeping', 'Team Collaboration & Trust Building']),
      duration: '3 hours',
      difficulty: 'intermediate',
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: 'res-pratham-health-hygiene',
      title: 'Pratham Open Learning: Community Health, First Aid & Vitals Assessment',
      description:
        'Hands-on pictorial training guide for village healthcare volunteers explaining blood pressure measurement, clinical thermometer reading, burn management, and fever triage.',
      provider: 'Pratham Education Foundation',
      resourceType: 'activity',
      url: 'https://pratham.org/open-learning/health-first-aid',
      language: 'hi',
      educationLevel: JSON.stringify(['class_9', 'class_10', 'class_12']),
      subjects: JSON.stringify(['Healthcare', 'Biology']),
      skills: JSON.stringify(['Patient Vital Signs Monitoring', 'Medical Equipment Sanitization & First Aid']),
      duration: '2.5 hours',
      difficulty: 'beginner',
      isSampleData: true,
      verifiedAt: new Date(),
    },
  ];

  for (const res of resourcesData) {
    await prisma.learningResource.upsert({
      where: { id: res.id },
      update: res,
      create: res,
    });
  }
  console.log(`✅ Seeded ${resourcesData.length} learning resources.`);

  // ============================================
  // 6. DEMO USERS (Student & Facilitator)
  // ============================================
  console.log('👤 Seeding Demo Users...');

  // Password hash for 'demo1234' (standard bcrypt format $2b$10$...)
  const DEMO_PASSWORD_HASH = '$2b$10$3euPFOt1xJgA5m.Yj6YpcuY0fF2Qc2o5eYk8Fv8O/i0/v9Q5b8qGu';

  // Facilitator User: demo@teacher.com
  const facilitatorUser = await prisma.user.upsert({
    where: { email: 'demo@teacher.com' },
    update: {
      name: 'G. Sai Kavya',
      phone: '+919876543211',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.FACILITATOR,
      language: 'hi',
    },
    create: {
      name: 'G. Sai Kavya',
      email: 'demo@teacher.com',
      phone: '+919876543211',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.FACILITATOR,
      language: 'hi',
    },
  });

  const facilitatorProfile = await prisma.facilitatorProfile.upsert({
    where: { userId: facilitatorUser.id },
    update: {
      displayName: 'G. Sai Kavya',
      organization: 'Pratham Rural Career Guidance Center, Anantapur',
      expertise: JSON.stringify([
        'Career Counseling',
        'Vocational Guidance & ITI',
        'Scholarship Navigation',
        'STEM Mentorship for Girls',
      ]),
      state: 'Andhra Pradesh',
      district: 'Anantapur',
      verifiedAt: new Date(),
    },
    create: {
      userId: facilitatorUser.id,
      displayName: 'G. Sai Kavya',
      organization: 'Pratham Rural Career Guidance Center, Anantapur',
      expertise: JSON.stringify([
        'Career Counseling',
        'Vocational Guidance & ITI',
        'Scholarship Navigation',
        'STEM Mentorship for Girls',
      ]),
      state: 'Andhra Pradesh',
      district: 'Anantapur',
      verifiedAt: new Date(),
    },
  });
  console.log(`✅ Facilitator created: ${facilitatorUser.email} (Profile ID: ${facilitatorProfile.id})`);

  // Student User: demo@student.com
  const studentUser = await prisma.user.upsert({
    where: { email: 'demo@student.com' },
    update: {
      name: 'Demo Student',
      phone: '+919876543210',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.STUDENT,
      language: 'en',
    },
    create: {
      name: 'Demo Student',
      email: 'demo@student.com',
      phone: '+919876543210',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.STUDENT,
      language: 'en',
    },
  });

  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {
      displayName: 'Demo Student',
      educationLevel: 'class_10',
      state: 'West Bengal',
      district: 'Kolkata',
      interests: JSON.stringify(['technology', 'clean_energy', 'trades']),
      hobbies: JSON.stringify(['tinkering', 'gardening', 'reading']),
      favoriteSubjects: JSON.stringify(['Mathematics', 'Physics', 'Computer Science']),
      skills: JSON.stringify([
        'Basic Computer Operations',
        'Smartphone Navigation & App Usage',
        'Domestic Electrical Wiring & Safety',
      ]),
      careerAspirations: JSON.stringify(['Solar PV Rooftop Technician', 'Junior Frontend Web Developer']),
      learningStyle: 'visual',
      careerPreference: 'vocational',
      availableHours: 10,
      deviceAccess: 'smartphone',
      onboardingCompleted: true,
    },
    create: {
      userId: studentUser.id,
      displayName: 'Soumyadip Chattopadhyay',
      educationLevel: 'class_10',
      state: 'West Bengal',
      district: 'Kolkata',
      interests: JSON.stringify(['technology', 'clean_energy', 'trades']),
      hobbies: JSON.stringify(['tinkering', 'gardening', 'reading']),
      favoriteSubjects: JSON.stringify(['Mathematics', 'Physics', 'Computer Science']),
      skills: JSON.stringify([
        'Basic Computer Operations',
        'Smartphone Navigation & App Usage',
        'Domestic Electrical Wiring & Safety',
      ]),
      careerAspirations: JSON.stringify(['Solar PV Rooftop Technician', 'Junior Frontend Web Developer']),
      learningStyle: 'visual',
      careerPreference: 'vocational',
      availableHours: 10,
      deviceAccess: 'smartphone',
      onboardingCompleted: true,
    },
  });
  console.log(`✅ Student created: ${studentUser.email} (Profile ID: ${studentProfile.id})`);

  // ============================================
  // 7. ASSIGN FACILITATOR TO STUDENT
  // ============================================
  console.log('🤝 Assigning Facilitator to Student...');
  await prisma.facilitatorStudentAssignment.upsert({
    where: {
      facilitatorId_studentId: {
        facilitatorId: facilitatorProfile.id,
        studentId: studentProfile.id,
      },
    },
    update: {
      notes:
        'Orientation meeting completed on 12th Oct. Soumyadip shows high aptitude for solar electrical systems and practical circuit repair. Assigned to PM Surya Ghar track.',
    },
    create: {
      facilitatorId: facilitatorProfile.id,
      studentId: studentProfile.id,
      notes:
        'Orientation meeting completed on 12th Oct. Soumyadip shows high aptitude for solar electrical systems and practical circuit repair. Assigned to PM Surya Ghar track.',
    },
  });
  console.log('✅ Assigned G. Sai Kavya to Soumyadip Chattopadhyay.');

  // ============================================
  // 8. DEMO LEARNING ROADMAP FOR STUDENT
  // ============================================
  console.log('🗺️ Seeding Demo Learning Roadmap for Student...');
  const roadmapId = 'roadmap-soumyadip-solar-1';
  const solarCareer = await prisma.career.findUnique({
    where: { slug: 'solar-pv-rooftop-technician' },
  });

  const roadmap = await prisma.learningRoadmap.upsert({
    where: { id: roadmapId },
    update: {
      studentId: studentProfile.id,
      careerTitle: 'Solar PV Rooftop Technician & Installer',
      description:
        'A comprehensive vocational roadmap tailored for Soumyadip to achieve certified Surya Mitra status, master solar array mounting, inverter setup, and safety compliance under PM Surya Ghar Yojana.',
      status: 'active',
    },
    create: {
      id: roadmapId,
      studentId: studentProfile.id,
      careerTitle: 'Solar PV Rooftop Technician & Installer',
      description:
        'A comprehensive vocational roadmap tailored for Soumyadip to achieve certified Surya Mitra status, master solar array mounting, inverter setup, and safety compliance under PM Surya Ghar Yojana.',
      status: 'active',
    },
  });

  const roadmapSteps = [
    {
      id: 'step-solar-1',
      order: 1,
      title: 'Foundations of DC Electricity & Circuit Safety',
      description: 'Understand voltage, current, resistance, Ohm’s law, and domestic wiring shock hazards.',
      type: 'learn',
      status: 'completed',
      duration: '4 hours',
      careerId: solarCareer?.id,
      resourceId: 'res-diksha-basic-electricity',
      completedAt: new Date('2026-10-10'),
    },
    {
      id: 'step-solar-2',
      order: 2,
      title: 'Multimeter Diagnostics & Electrical Testing',
      description: 'Hands-on practice measuring voltage, short-circuit current, continuity, and resistance safely.',
      type: 'practice',
      status: 'in_progress',
      duration: '2 hours',
      careerId: solarCareer?.id,
      resourceId: 'res-skill-india-multimeter',
      completedAt: null,
    },
    {
      id: 'step-solar-3',
      order: 3,
      title: 'Solar Photovoltaic Cell Physics & Module Sizing',
      description: 'Learn how solar cells generate DC power from sunlight, tilt angles, and seasonal shading factors.',
      type: 'learn',
      status: 'pending',
      duration: '8 hours',
      careerId: solarCareer?.id,
      resourceId: 'res-swayam-solar-basics',
      completedAt: null,
    },
    {
      id: 'step-solar-4',
      order: 4,
      title: 'Rooftop Array Mounting & Mechanical Rail Installation',
      description: 'Practice attaching aluminum clamps, lightning arrestors, and weather-sealed cable conduits.',
      type: 'practice',
      status: 'pending',
      duration: '6 hours',
      careerId: solarCareer?.id,
      resourceId: null,
      completedAt: null,
    },
    {
      id: 'step-solar-5',
      order: 5,
      title: 'Inverters, Battery Storage & Grid Synchronization',
      description: 'Wiring hybrid string inverters, battery charge controllers, and bidirectional net-meters.',
      type: 'learn',
      status: 'pending',
      duration: '5 hours',
      careerId: solarCareer?.id,
      resourceId: null,
      completedAt: null,
    },
    {
      id: 'step-solar-6',
      order: 6,
      title: 'Surya Mitra Practice Mock Exam & Safety Certification',
      description: 'Comprehensive 50-question mock assessment testing BIS electrical codes, earthing, and safety gear.',
      type: 'exam',
      status: 'pending',
      duration: '1.5 hours',
      careerId: solarCareer?.id,
      resourceId: null,
      completedAt: null,
    },
  ];

  for (const step of roadmapSteps) {
    await prisma.roadmapStep.upsert({
      where: { id: step.id },
      update: {
        roadmapId: roadmap.id,
        order: step.order,
        title: step.title,
        description: step.description,
        type: step.type,
        status: step.status,
        duration: step.duration,
        careerId: step.careerId,
        resourceId: step.resourceId,
        completedAt: step.completedAt,
      },
      create: {
        id: step.id,
        roadmapId: roadmap.id,
        order: step.order,
        title: step.title,
        description: step.description,
        type: step.type,
        status: step.status,
        duration: step.duration,
        careerId: step.careerId,
        resourceId: step.resourceId,
        completedAt: step.completedAt,
      },
    });
  }
  console.log(`✅ Seeded Roadmap with ${roadmapSteps.length} progressive steps.`);

  // ============================================
  // 9. STUDENT SAVED OPPORTUNITY & APPLICATION RECORD
  // ============================================
  console.log('📌 Linking Saved Opportunity and Application for Student...');
  const targetOppId = 'opp-pm-surya-ghar-skilling';

  await prisma.savedOpportunity.upsert({
    where: {
      studentId_opportunityId: {
        studentId: studentProfile.id,
        opportunityId: targetOppId,
      },
    },
    update: {
      notes: 'Recommended by G. Sai Kavya during career orientation.',
    },
    create: {
      studentId: studentProfile.id,
      opportunityId: targetOppId,
      notes: 'Recommended by G. Sai Kavya during career orientation.',
    },
  });

  await prisma.applicationRecord.upsert({
    where: {
      studentId_opportunityId: {
        studentId: studentProfile.id,
        opportunityId: targetOppId,
      },
    },
    update: {
      status: 'checking_eligibility',
      notes: 'Collecting Class 10 marksheet and Aadhaar card copies.',
      nextAction: 'Visit Kolkata ITI nodal center for document verification on Saturday.',
      statusHistory: JSON.stringify([
        { status: 'interested', date: '2026-10-12', note: 'Discovered scheme via NextLearning matching' },
        { status: 'checking_eligibility', date: '2026-10-14', note: 'Verified Class 10 eligibility with facilitator' },
      ]),
    },
    create: {
      studentId: studentProfile.id,
      opportunityId: targetOppId,
      status: 'checking_eligibility',
      notes: 'Collecting Class 10 marksheet and Aadhaar card copies.',
      nextAction: 'Visit Kolkata ITI nodal center for document verification on Saturday.',
      statusHistory: JSON.stringify([
        { status: 'interested', date: '2026-10-12', note: 'Discovered scheme via NextLearning matching' },
        { status: 'checking_eligibility', date: '2026-10-14', note: 'Verified Class 10 eligibility with facilitator' },
      ]),
    },
  });

  // Facilitator recommendation
  await prisma.facilitatorRecommendation.create({
    data: {
      facilitatorId: facilitatorProfile.id,
      studentId: studentProfile.id,
      type: 'opportunity',
      referenceId: targetOppId,
      message: 'Soumyadip, please look into this PM Surya Ghar skilling batch. Applications close in November.',
      isRead: false,
    },
  }).catch(() => {
    // Non-blocking in case of re-seed
  });

  // Student progress event
  await prisma.studentProgress.create({
    data: {
      studentId: studentProfile.id,
      eventType: 'onboarding_completed',
      eventData: JSON.stringify({ completionDate: new Date(), track: 'vocational' }),
    },
  }).catch(() => {
    // Non-blocking in case of re-seed
  });

  // Seed extended content (additional vocational courses, facilitator training modules, diverse students under G. Sai Kavya, and authentic DIKSHA records)
  await seedExtendedContent();

  // Seed 30 additional high-impact career paths across all 12 categories
  await seed30NewCareers();

  // Seed individual student credentials and facilitator accounts
  await seedStudentAndFacilitatorCredentials();

  // Seed 20 additional comprehensive training modules authored by G. Sai Kavya
  await seed20KavyaModules();

  // ============================================
  // FINAL SUMMARY
  // ============================================
  const counts = {
    skills: await prisma.skill.count(),
    careers: await prisma.career.count(),
    careerSkills: await prisma.careerSkill.count(),
    organizations: await prisma.organization.count(),
    opportunities: await prisma.opportunity.count(),
    resources: await prisma.learningResource.count(),
    users: await prisma.user.count(),
    roadmaps: await prisma.learningRoadmap.count(),
    roadmapSteps: await prisma.roadmapStep.count(),
    trainingModules: await prisma.trainingModule.count(),
    moduleLessons: await prisma.moduleLesson.count(),
  };

  console.log('\n========================================================');
  console.log('🎉 NEXTLEARNING SEED COMPLETED SUCCESSFULLY!');
  console.log('========================================================');
  console.log(`📊 Total Skills Seeded:            ${counts.skills}`);
  console.log(`💼 Total Careers Seeded:           ${counts.careers} (across 12 categories)`);
  console.log(`🔗 Career-Skill Relationships:     ${counts.careerSkills}`);
  console.log(`🏢 Organizations Seeded:           ${counts.organizations}`);
  console.log(`🎯 Opportunities Seeded:           ${counts.opportunities}`);
  console.log(`📝 Total Training Modules:         ${counts.trainingModules} (${counts.moduleLessons} lessons)`);
  console.log(`📚 Learning Resources Seeded:      ${counts.resources}`);
  console.log(`👥 Users Seeded:                   ${counts.users}`);
  console.log(`🗺️ Learning Roadmaps Seeded:       ${counts.roadmaps} (${counts.roadmapSteps} total steps)`);
  console.log('--------------------------------------------------------');
  console.log('🔑 Demo Student Credentials:');
  console.log('   Email: demo@student.com | Password: demo1234');
  console.log('🔑 Demo Facilitator Credentials:');
  console.log('   Email: demo@teacher.com | Password: demo1234');
  console.log('========================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error executing NextLearning seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
