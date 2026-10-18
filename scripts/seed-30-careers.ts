import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const NEW_30_CAREERS = [
  // 1. Technology
  {
    title: "AI Prompt Specialist & Vernacular Data Annotator",
    slug: "ai-prompt-data-annotator",
    category: "technology",
    description:
      "Design, evaluate, and fine-tune prompts for generative artificial intelligence models while curating high-quality training datasets in regional Indian languages (Hindi, Telugu, Tamil, Marathi, Bengali).",
    requiredSkills: JSON.stringify([
      "Generative AI Prompt Engineering",
      "Vernacular Language Translation & Grammar",
      "Data Annotation & RLHF Feedback",
      "Basic Python & API Testing",
      "Attention to Detail & Fact-Checking",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass or Bachelor's in any discipline",
      "Strong fluency in at least one Indian vernacular language",
      "Basic digital literacy and computer proficiency",
    ]),
    salaryRange: "₹25,000 - ₹55,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Complete free beginner prompt engineering tutorials on Kaggle or DeepLearning.AI",
      "Practice creating multilingual datasets in Indian languages using spreadsheets",
      "Register on crowdsourced AI annotation platforms like Appen, Toloka, and OneForma",
      "Build a portfolio showcasing 10 vernacular LLM test benchmarks",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 → Certificate in AI Prompting & Data Analysis (3 months)",
      "BCA / BSc Computer Science / BA Linguistics → Junior AI Specialist",
    ]),
    relatedCareers: JSON.stringify([
      "junior-frontend-web-developer",
      "vernacular-content-creator",
      "data-entry-verification-operator",
    ]),
    isSampleData: true,
  },
  {
    title: "Junior Cybersecurity & SOC Analyst",
    slug: "cyber-security-soc-assistant",
    category: "technology",
    description:
      "Monitor enterprise networks, investigate security alerts, safeguard digital banking systems, and protect organizations against phishing, ransomware, and cyber threats.",
    requiredSkills: JSON.stringify([
      "Network Fundamentals (TCP/IP, Firewalls, DNS)",
      "Log Analysis & Incident Triage (SIEM Basics)",
      "Linux Command Line Administration",
      "Vulnerability Scanning & Wireshark",
      "Cyber Law & IT Act Compliance",
    ]),
    requiredQualifications: JSON.stringify([
      "Polytechnic Diploma in CS/IT or BCA / B.Tech",
      "Certifications: CompTIA Security+ or Certified Ethical Hacker (CEH) associate level",
    ]),
    salaryRange: "₹28,000 - ₹65,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Practice cybersecurity fundamentals on TryHackMe and Cisco Skills For All",
      "Set up a virtual home lab using VirtualBox with Kali Linux and Ubuntu",
      "Learn Wireshark packet capture analysis on home Wi-Fi",
      "Apply for entry-level Security Operations Center (SOC) L1 trainee openings",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 (Science) → Polytechnic Diploma in Information Security → SOC Analyst",
      "BCA / BSc IT → Global Cyber Certification → Cyber Incident Responder",
    ]),
    relatedCareers: JSON.stringify([
      "hardware-network-technician",
      "junior-frontend-web-developer",
    ]),
    isSampleData: true,
  },
  {
    title: "Mobile Application Developer (Flutter & Android)",
    slug: "mobile-app-flutter-developer",
    category: "technology",
    description:
      "Build fast, offline-first native and cross-platform mobile apps for smartphones used by millions of rural and urban citizens across agriculture, fintech, and education.",
    requiredSkills: JSON.stringify([
      "Dart & Flutter Framework",
      "RESTful API Integration & JSON Parsing",
      "Offline SQLite Storage & Caching",
      "Material Design 3 & Responsive UI",
      "Google Play Console Deployment",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass with passion for programming or BCA / B.Tech / Diploma",
      "Portfolio of at least 2 functional Android APKs published or hosted on GitHub",
    ]),
    salaryRange: "₹25,000 - ₹60,000/month",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Learn Dart programming fundamentals using official flutter.dev documentation",
      "Build your first mobile calculator and vernacular news feed app",
      "Implement SQLite offline database storage for low-connectivity zones",
      "Publish your APK to GitHub Releases and apply for remote junior roles on Internshala",
    ]),
    educationPaths: JSON.stringify([
      "Polytechnic Diploma in Computer Engineering → Junior App Developer",
      "Self-taught coding + GitHub Portfolio → Freelance App Contractor",
    ]),
    relatedCareers: JSON.stringify([
      "junior-frontend-web-developer",
      "ui-ux-product-designer",
    ]),
    isSampleData: true,
  },
  {
    title: "Advanced Smartphone & Tablet Repair Specialist",
    slug: "smartphone-hardware-repair-technician",
    category: "technology",
    description:
      "Diagnose motherboard short-circuits, micro-solder chips, replace AMOLED displays, and flash operating systems for modern smartphones and tablets.",
    requiredSkills: JSON.stringify([
      "Micro-Soldering & Hot Air Rework Station",
      "Multimeter SMD Diagnostics & Schematic Reading",
      "Touch Glass Laminating & OCA Machine Operation",
      "Android/iOS Firmware Flashing & FRP Unlocking",
      "Customer Service & Spare Parts Sourcing",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass",
      "Skill India or private mobile hardware repair diploma (3-6 months)",
    ]),
    salaryRange: "₹20,000 - ₹45,000/month",
    demandLevel: "very_high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Enroll in a hands-on mobile repair training course at your district headquarters",
      "Practice desoldering and SMD component replacement on scrap smartphone boards",
      "Learn to read schematic diagrams using ZXW or Borneo Schematics software",
      "Open a local repair service counter or partner with authorized brand service hubs",
    ]),
    educationPaths: JSON.stringify([
      "Class 10 → PMKVY Mobile Phone Hardware Repair Technician Course (3 months) → Service Shop",
    ]),
    relatedCareers: JSON.stringify([
      "hardware-network-technician",
      "certified-electrician",
    ]),
    isSampleData: true,
  },

  // 2. Healthcare & Allied Health
  {
    title: "Telemedicine & Rural Health Coordinator",
    slug: "telemedicine-health-coordinator",
    category: "healthcare",
    description:
      "Operate e-Sanjeevani digital dispensary kiosks, record patient vitals via connected diagnostic sensors, and facilitate video consultations between village patients and city specialist doctors.",
    requiredSkills: JSON.stringify([
      "Digital Diagnostic Kiosk & Sensor Operation",
      "Patient Vitals Recording (BP, SpO2, ECG, Glucose)",
      "Medical Terminology & Prescription Translation",
      "e-Sanjeevani Teleconsultation Software",
      "Compassionate Patient Care & Counseling",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass (Science preferred) or GDA certificate",
      "Basic digital proficiency and vernacular fluency",
    ]),
    salaryRange: "₹18,000 - ₹35,000/month",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Complete General Duty Assistant (GDA) NSQF Level 4 training",
      "Learn how to operate Bluetooth-enabled telemedicine diagnostic kits",
      "Gain clinical shadowing experience at a Primary Health Centre (PHC)",
      "Partner with CSC Health Kiosks or Apollo TeleHealth rural clinics",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 (PCB) → Diploma in Health & Sanitary Inspector → Telemedicine Officer",
    ]),
    relatedCareers: JSON.stringify([
      "general-duty-assistant",
      "emergency-medical-technician",
    ]),
    isSampleData: true,
  },
  {
    title: "Dialysis Unit Clinical Assistant",
    slug: "dialysis-technician-assistant",
    category: "healthcare",
    description:
      "Prepare hemodialysis machines, monitor dialyzer dialysate flow rates, and provide vital care for patients undergoing life-saving renal treatments under the Pradhan Mantri National Dialysis Programme.",
    requiredSkills: JSON.stringify([
      "Hemodialysis Machine Priming & Operation",
      "Vascular Access & Fistula Care",
      "Sterilization Protocols & Infection Control",
      "Patient Vital Signs Monitoring During Dialysis",
      "Biomedical Waste Segregation",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 (Science with Biology/Chemistry)",
      "Diploma in Dialysis Technology (DDT) (2 years)",
    ]),
    salaryRange: "₹22,000 - ₹48,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Enroll in state paramedical board approved Diploma in Dialysis Technology",
      "Complete 500 hours of clinical internship in a multi-specialty nephrology ward",
      "Master dialyzer reprocessing and water treatment (RO plant) checks",
      "Apply for district hospital dialysis centers under PMNDP scheme",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 (PCB) → Diploma in Dialysis Technology (DDT) → Dialysis Technologist",
    ]),
    relatedCareers: JSON.stringify([
      "general-duty-assistant",
      "pharmacy-assistant",
    ]),
    isSampleData: true,
  },
  {
    title: "Optometry & Eyecare Dispensing Technician",
    slug: "optical-dispensing-assistant",
    category: "healthcare",
    description:
      "Conduct visual acuity screenings, perform auto-refraction tests, measure pupillary distance, and fit prescription corrective eyeglasses in community vision centers.",
    requiredSkills: JSON.stringify([
      "Snellen Chart & Auto-Refractometer Operation",
      "Lensometer Power Measurement",
      "Eyeglass Frame Fitting & Lens Edging",
      "Cataract & Glaucoma Early Screening",
      "Customer Communication & Inventory Control",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass (Science) or Diploma in Ophthalmic Assistance",
    ]),
    salaryRange: "₹18,000 - ₹38,000/month",
    demandLevel: "high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Complete a 1-year or 2-year Diploma in Ophthalmic Technique or Vision Technician course",
      "Intern at an eye hospital (like Aravind Eye Care or Sankara Nethralaya)",
      "Learn optical lens cutting and frame alignment tools",
      "Apply to optical retail chains (Lenskart, Titan Eyeplus) or rural vision centers",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 (Science) → Diploma in Ophthalmic Technology → Certified Optometrist Assistant",
    ]),
    relatedCareers: JSON.stringify([
      "pharmacy-assistant",
      "general-duty-assistant",
    ]),
    isSampleData: true,
  },
  {
    title: "Ayush & Herbal Wellness Practitioner",
    slug: "ayurvedic-wellness-therapist",
    category: "healthcare",
    description:
      "Administer classical Ayurvedic therapies (Panchakarma, Abhyanga, Shirodhara), prepare herbal decoctions, and promote holistic preventive healthcare under the Ministry of Ayush.",
    requiredSkills: JSON.stringify([
      "Panchakarma & Ayurvedic Massage Techniques",
      "Herbal Medicine Preparation & Storage",
      "Hygiene & Sanitation of Therapy Chambers",
      "Yoga Asanas & Basic Breathwork Guidance",
      "Patient History Documentation",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass",
      "Panchakarma Therapist Certificate (NSQF Level 4, 6 months to 1 year)",
    ]),
    salaryRange: "₹16,000 - ₹35,000/month",
    demandLevel: "high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Enroll in an approved government Ayush training institute or State Ayurvedic college",
      "Learn classical massage strokes, pressure points, and medicated oil properties",
      "Shadow senior practitioners at a certified Ayurvedic wellness retreat or hospital",
      "Register with the Healthcare Sector Skill Council as a Certified Panchakarma Technician",
    ]),
    educationPaths: JSON.stringify([
      "Class 10/12 → Panchakarma Therapy Certificate (1 year) → Ayurvedic Hospital Therapist",
    ]),
    relatedCareers: JSON.stringify([
      "general-duty-assistant",
      "homestay-eco-tourism-guide",
    ]),
    isSampleData: true,
  },

  // 3. Education & Training
  {
    title: "School STEM & Robotics Lab Trainer",
    slug: "stem-robotics-lab-instructor",
    category: "education",
    description:
      "Guide school students through hands-on Atal Tinkering Lab (ATL) projects using Arduino, 3D printing, sensors, scratch programming, and science DIY kits.",
    requiredSkills: JSON.stringify([
      "Arduino & Microcontroller Prototyping",
      "Block-Based Coding (Scratch, Blockly, Python)",
      "3D Printer Operation & Slicing Software",
      "Electronics Circuit Breadboarding",
      "Child Mentorship & Creative Science Teaching",
    ]),
    requiredQualifications: JSON.stringify([
      "Polytechnic Diploma in Electronics/CS or BSc Physics/Maths/B.Tech",
      "Passion for maker culture and experiential science education",
    ]),
    salaryRange: "₹22,000 - ₹45,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Build 5 hands-on Arduino and sensor projects (ultrasonic distance, smart lighting)",
      "Learn basic 3D modeling using free Tinkercad software",
      "Review the NITI Aayog Atal Innovation Mission (AIM) curriculum",
      "Apply to STEM education companies managing ATL labs in private and Jawahar Navodaya schools",
    ]),
    educationPaths: JSON.stringify([
      "Polytechnic Diploma in Electronics → Atal Tinkering Lab Coordinator",
      "BSc Electronics/IT → EdTech STEM Specialist",
    ]),
    relatedCareers: JSON.stringify([
      "digital-skills-tutor",
      "primary-school-teacher",
    ]),
    isSampleData: true,
  },
  {
    title: "Inclusive Learning & Special Needs Assistant",
    slug: "special-needs-inclusive-educator",
    category: "education",
    description:
      "Support children with diverse physical, sensory, and learning needs (autism, dyslexia, hearing impairment) in mainstream and inclusive school classrooms.",
    requiredSkills: JSON.stringify([
      "Individualized Education Plan (IEP) Implementation",
      "Basic Indian Sign Language (ISL) or Braille",
      "Patience, Empathy & Behavioral De-escalation",
      "Assistive Learning Software & Tactile Tools",
      "Parent Counseling & Collaboration",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass + Diploma in Special Education (D.Ed. Spl.Ed.) accredited by Rehabilitation Council of India (RCI)",
    ]),
    salaryRange: "₹20,000 - ₹42,000/month",
    demandLevel: "high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Enroll in an RCI-approved Diploma in Special Education (Mental Retardation / Autism / Hearing)",
      "Learn basic conversational Indian Sign Language via online modules from ISLRTC",
      "Complete a teaching internship at an inclusive school or NGO center",
      "Apply for Samagra Shiksha Special Educator appointments in government schools",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 → D.Ed. Special Education (2 years) → Inclusive Classroom Shadow Teacher",
    ]),
    relatedCareers: JSON.stringify([
      "primary-school-teacher",
      "anganwadi-early-educator",
    ]),
    isSampleData: true,
  },
  {
    title: "Skill India Vocational Trade Instructor",
    slug: "vocational-skill-center-trainer",
    category: "education",
    description:
      "Train youth in NSQF-aligned job roles (solar, plumbing, tailoring, electrical, digital literacy) at Pradhan Mantri Kaushal Kendras (PMKK) and industrial institutes.",
    requiredSkills: JSON.stringify([
      "NSQF Curriculum Delivery & Lesson Planning",
      "Practical Workshop Tool Demonstration",
      "Student Formative Assessment & Grading",
      "Industry Apprenticeship Coordination",
      "Bilingual Instruction (Vernacular + English)",
    ]),
    requiredQualifications: JSON.stringify([
      "ITI Certificate with 3 years industry experience OR Polytechnic Diploma with 2 years experience",
      "Craft Instructor Training Scheme (CITS) qualification preferred",
    ]),
    salaryRange: "₹24,000 - ₹50,000/month",
    demandLevel: "high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Clear the All India Common Entrance Test for CITS (Craft Instructor Training Scheme)",
      "Complete the 1-year instructor training program at a National Skill Training Institute (NSTI)",
      "Get certified as a Trainer by the relevant Sector Skill Council (SSC)",
      "Apply to government ITIs, polytechnics, and NSDC training partner academies",
    ]),
    educationPaths: JSON.stringify([
      "ITI / Diploma → CITS Instructor Training (1 year) → Government / Private ITI Instructor",
    ]),
    relatedCareers: JSON.stringify([
      "certified-electrician",
      "digital-skills-tutor",
    ]),
    isSampleData: true,
  },

  // 4. Agriculture & Agritech
  {
    title: "Smart Polyhouse & Hydroponics Grower",
    slug: "polyhouse-hydroponics-grower",
    category: "agriculture",
    description:
      "Manage climate-controlled greenhouse polyhouses and soil-less hydroponic systems to produce high-value exotic vegetables, strawberries, and flowers year-round.",
    requiredSkills: JSON.stringify([
      "Nutrient Film Technique (NFT) & Hydroponics Mixes",
      "Automated Drip Irrigation & Fogger Control",
      "EC & pH Water Quality Monitoring",
      "Greenhouse Temperature & Humidity Management",
      "Biological Pest Control & Harvest Packaging",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass",
      "Short-term vocational certificate in Protected Cultivation / Hydroponics (1-3 months)",
    ]),
    salaryRange: "₹20,000 - ₹50,000/month",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Attend a training program at your nearest Krishi Vigyan Kendra (KVK) on protected cultivation",
      "Build a low-cost DIY hydroponic pipe system with 20 leafy vegetable plants",
      "Learn government subsidies available under Mission for Integrated Development of Horticulture (MIDH)",
      "Partner with urban restaurants or supermarket aggregators for recurring weekly vegetable supplies",
    ]),
    educationPaths: JSON.stringify([
      "Class 10/12 → Hydroponics Certification (KVK / ICAR) → High-Tech Farm Manager / Owner",
    ]),
    relatedCareers: JSON.stringify([
      "organic-farming-supervisor",
      "agri-produce-aggregator",
    ]),
    isSampleData: true,
  },
  {
    title: "Veterinary Field Assistant & Artificial Inseminator",
    slug: "veterinary-dairy-assistant",
    category: "agriculture",
    description:
      "Deliver doorstep livestock care, administer cattle vaccinations, perform artificial insemination, and monitor animal nutrition for rural dairy farmers under the Rashtriya Gokul Mission.",
    requiredSkills: JSON.stringify([
      "Livestock Artificial Insemination (AI) Protocols",
      "Liquid Nitrogen Semen Straw Handling",
      "Animal First Aid & Subcutaneous Injections",
      "FMD & Brucellosis Vaccination Administration",
      "Dairy Feed Rationing & Mineral Supplements",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass (Biology preferred)",
      "Certificate or Diploma in Veterinary Pharmacy / Animal Husbandry (1 to 2 years)",
    ]),
    salaryRange: "₹18,000 - ₹40,000/month",
    demandLevel: "very_high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Enroll in state animal husbandry department certified Maitri / AI Technician course",
      "Shadow a veterinary doctor during village cattle health camps",
      "Master cold-chain maintenance of liquid nitrogen cryogenic canisters",
      "Partner with dairy cooperatives (Amul, Nandini, Mother Dairy) or livestock departments",
    ]),
    educationPaths: JSON.stringify([
      "Class 10/12 → Animal Husbandry Diploma (2 years) → Government Livestock Inspector",
    ]),
    relatedCareers: JSON.stringify([
      "organic-farming-supervisor",
      "agritech-drone-pilot",
    ]),
    isSampleData: true,
  },
  {
    title: "Commercial Aquaculture & Biofloc Fish Farming Specialist",
    slug: "fisheries-aquaculture-technician",
    category: "agriculture",
    description:
      "Manage freshwater fish ponds and advanced zero-water-exchange Biofloc tanks for intensive breeding of Rohu, Catla, Tilapia, and freshwater prawns under the Pradhan Mantri Matsya Sampada Yojana.",
    requiredSkills: JSON.stringify([
      "Biofloc Tank Water Probiotics & C:N Ratio Balancing",
      "Dissolved Oxygen (DO) Aeration & Testing",
      "Fingerling Stocking & Feed Conversion Ratio (FCR)",
      "Fish Disease Diagnostics & Treatment",
      "Cold-Storage Harvesting & Wholesale Marketing",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass",
      "Biofloc Aquaculture Training Certificate (ICAR-CIFA / NFDB, 1 month)",
    ]),
    salaryRange: "₹22,000 - ₹55,000/month",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Complete Biofloc fish farming practical training at a state fisheries training center",
      "Learn water test parameters: Ammonia, Nitrate, Nitrite, and pH",
      "Explore PMMSY subsidies (up to 40-60% subsidy for women and SC/ST farmers)",
      "Set up a 10,000-liter test circular tarpaulin tank with high-density Tilapia seeds",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 (Science) → Bachelor of Fisheries Science (BFSc) OR Diploma in Aquaculture",
    ]),
    relatedCareers: JSON.stringify([
      "organic-farming-supervisor",
      "agri-produce-aggregator",
    ]),
    isSampleData: true,
  },

  // 5. Environmental & Sustainability
  {
    title: "EV Fast-Charging Infrastructure Specialist",
    slug: "ev-charging-station-operator",
    category: "environment",
    description:
      "Install, commission, inspect, and service public and commercial DC fast chargers (CCS2, Bharat DC-001) for electric cars, buses, and commercial fleets.",
    requiredSkills: JSON.stringify([
      "AC/DC High-Voltage Electrical Connection",
      "OCPP Protocol & Charger Cloud Networking",
      "Earth Pit Testing & Surge Protection",
      "EVSE Preventative Maintenance",
      "Safety Disconnect Protocols & NFPA Compliance",
    ]),
    requiredQualifications: JSON.stringify([
      "ITI Electrician / Wireman or Polytechnic Diploma in Electrical Engineering",
      "Valid state electrical wireman license",
    ]),
    salaryRange: "₹22,000 - ₹48,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Master three-phase AC distribution and DC rectifier circuits",
      "Learn OCPP (Open Charge Point Protocol) networking fundamentals",
      "Complete ASDC or Skill Council for Green Jobs EVSE certification",
      "Apply to charge point operators like Tata Power EV, Statiq, Jio-bp, and Ather Grid",
    ]),
    educationPaths: JSON.stringify([
      "ITI Electrician → EV Infrastructure Certification (3 months) → EVSE Service Engineer",
    ]),
    relatedCareers: JSON.stringify([
      "electric-vehicle-technician",
      "solar-pv-rooftop-technician",
    ]),
    isSampleData: true,
  },
  {
    title: "Waste Management & Circular Economy Supervisor",
    slug: "waste-recycling-circular-economy-manager",
    category: "environment",
    description:
      "Coordinate municipal solid waste segregation, manage plastic baling and shredding units, and oversee organic waste composting plants under the Swachh Bharat Mission (Grameen & Urban).",
    requiredSkills: JSON.stringify([
      "Dry & Wet Waste Segregation Protocols",
      "Plastic Polymer Identification (PET, HDPE, LDPE)",
      "Hydraulic Baling & Shredder Operation",
      "Aerobic Composting & Leachate Treatment",
      "Extended Producer Responsibility (EPR) Portals",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass or Diploma in Environmental Sciences / Health Inspector",
    ]),
    salaryRange: "₹18,000 - ₹38,000/month",
    demandLevel: "high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Learn plastic recycling classifications and municipal waste segregation norms",
      "Shadow operations at a local Material Recovery Facility (MRF)",
      "Register on Central Pollution Control Board (CPCB) EPR waste portal",
      "Apply for supervisor roles with municipal corporations or recycling social enterprises",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 → Diploma in Health & Sanitary Inspector (1-2 years) → Waste Plant Supervisor",
    ]),
    relatedCareers: JSON.stringify([
      "biogas-plant-manager",
      "rainwater-watershed-technician",
    ]),
    isSampleData: true,
  },
  {
    title: "Community Forest & Wildlife Conservation Officer",
    slug: "forest-wildlife-patrol-guard",
    category: "environment",
    description:
      "Patrol reserved forests and wildlife corridors, prevent illegal poaching and timber logging, manage forest fire prevention trenches, and promote eco-development with tribal van-samitis.",
    requiredSkills: JSON.stringify([
      "GPS Navigation, Compass & Topo Sheet Reading",
      "Wildlife Tracking & Pugmark / Camera Trap Deployment",
      "Wildfire Line Cutting & Firefighting Basics",
      "Forest Conservation Act & Wildlife Protection Act",
      "Community Dialogue with Forest Dwellers",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass with physical fitness standards (walking endurance)",
    ]),
    salaryRange: "₹20,000 - ₹42,000/month",
    demandLevel: "steady",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Prepare for state forest department Forest Guard physical test (25 km walk for male, 14 km for female)",
      "Learn wildlife identification and GPS navigation apps (like QGIS or OsmAnd)",
      "Volunteer with local wildlife conservation groups or Van Suraksha Samitis",
      "Appear for the State Staff Selection Commission Forest Guard recruitment exam",
    ]),
    educationPaths: JSON.stringify([
      "Class 10/12 → State Forest Guard Selection → Forester / Forest Range Officer promotion",
    ]),
    relatedCareers: JSON.stringify([
      "homestay-eco-tourism-guide",
      "rainwater-watershed-technician",
    ]),
    isSampleData: true,
  },

  // 6. Skilled Trades & Technical
  {
    title: "Sanitary Systems & Jal Jeevan Piping Specialist",
    slug: "plumbing-jal-jeevan-technician",
    category: "trades",
    description:
      "Install and maintain potable water distribution pipelines, domestic water meters, submersible pumps, and sanitary fixtures under the flagship Jal Jeevan Mission.",
    requiredSkills: JSON.stringify([
      "CPVC, UPVC & GI Pipe Cutting, Threading & Solvent Welding",
      "Submersible Pump & Pressure Tank Connection",
      "Domestic Water Meter Installation & Leak Testing",
      "Sanitary Fixture & Drainage Slope Alignment",
      "Water Contamination Testing (Chlorine & Coliform)",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 8 or Class 10 pass",
      "ITI Plumber trade certificate or PMKVY Plumber General Level 4 certification",
    ]),
    salaryRange: "₹18,000 - ₹38,000/month",
    demandLevel: "very_high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Complete a 1-year ITI Plumber course or 3-month Skill India Plumbing course",
      "Practice pipe threading, valve joints, and leak detection on simulated plumbing walls",
      "Get registered on the Jal Jeevan Mission village maintenance register (Panchayat Nal Jal Yojana)",
      "Take up independent plumbing repair contracts across nearby residential communities",
    ]),
    educationPaths: JSON.stringify([
      "Class 8/10 → ITI Plumber → Licensed Municipal Plumber / Contractor",
    ]),
    relatedCareers: JSON.stringify([
      "certified-electrician",
      "industrial-fitter-welder",
    ]),
    isSampleData: true,
  },
  {
    title: "PM-KUSUM Solar Pump & Drip Irrigation Installer",
    slug: "solar-pump-micro-irrigation-technician",
    category: "trades",
    description:
      "Install solar-powered agricultural pumps (DC & AC surface/submersible), solar tracking frames, and integrated automated micro-drip irrigation networks under PM-KUSUM.",
    requiredSkills: JSON.stringify([
      "Solar Water Pump Controller (VFD) Calibration",
      "Solar Panel Structure Ground Anchoring & Orientation",
      "Drip Irrigation Lateral Pipe & Emitter Setup",
      "Borewell Submersible Motor Cable Splicing",
      "Lightning Arrestor & Deep Ground Earthing",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 pass + ITI (Electrician, Wireman, or Fitter)",
    ]),
    salaryRange: "₹20,000 - ₹45,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Master solar pump controller parameters and VFD (Variable Frequency Drive) settings",
      "Learn micro-irrigation layout design from companies like Jain Irrigation or Netafim",
      "Shadow solar EPC pump installation teams in rural farm clusters",
      "Register as a certified service partner with PM-KUSUM empanelled solar pump vendors",
    ]),
    educationPaths: JSON.stringify([
      "ITI Electrician/Fitter → Solar Pumping Systems Certificate → Agritech Field Engineer",
    ]),
    relatedCareers: JSON.stringify([
      "solar-pv-rooftop-technician",
      "agritech-drone-pilot",
    ]),
    isSampleData: true,
  },
  {
    title: "HVAC & Cold Storage Refrigeration Mechanic",
    slug: "commercial-ac-refrigeration-mechanic",
    category: "trades",
    description:
      "Install, charge eco-friendly refrigerants (R32, R410A, R290), and troubleshoot compressors for commercial cooling units, agricultural cold stores, and milk chilling plants.",
    requiredSkills: JSON.stringify([
      "Copper Tube Brazing & Swaging Techniques",
      "Refrigeration Cycle Diagnostics & Manifold Gauges",
      "Vacuum Pump Dehydration & Refrigerant Charging",
      "Inverter AC PCB Electronics & Sensor Testing",
      "Cold Chain Temperature Data Loggers",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 pass + ITI Refrigeration & Air Conditioning (RAC) trade (2 years)",
    ]),
    salaryRange: "₹22,000 - ₹50,000/month",
    demandLevel: "very_high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Complete 2-year ITI Mechanic (RAC) course",
      "Master safety protocols for flammable green refrigerants (R32, R290)",
      "Intern with major cooling brands (Voltas, Daikin, Blue Star) or cold storage plants",
      "Set up your own residential/commercial air conditioning sales and service venture",
    ]),
    educationPaths: JSON.stringify([
      "Class 10 → ITI RAC → Master Technician / Commercial Cold Chain Contractor",
    ]),
    relatedCareers: JSON.stringify([
      "certified-electrician",
      "industrial-fitter-welder",
    ]),
    isSampleData: true,
  },

  // 7. Business & Entrepreneurship
  {
    title: "Hyperlocal E-Commerce & Social Media Growth Specialist",
    slug: "digital-marketing-growth-specialist",
    category: "business",
    description:
      "Help local town businesses, retail shops, handicraft artisans, and schools run hyper-targeted Meta/Google ads, manage WhatsApp Business catalogs, and boost sales.",
    requiredSkills: JSON.stringify([
      "Meta Ads Manager & Location-Targeted Campaigns",
      "WhatsApp Business API & Automated Catalog Setup",
      "Google My Business (Maps) Local SEO",
      "Short-Form Video Production & Creative Copywriting",
      "ROI Tracking & Sales Conversion Analytics",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass or Bachelor's in any stream",
      "Google Digital Garage or Meta Certified Associate credential",
    ]),
    salaryRange: "₹22,000 - ₹55,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Complete Google's free Fundamentals of Digital Marketing course",
      "Set up Google Business profiles for 3 local shops in your neighborhood to rank on Maps",
      "Run a ₹500 test advertisement on Instagram for a local shop and track new customers",
      "Package your services into monthly retainer packages (₹5,000 - ₹15,000/client)",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 → Digital Marketing Professional Certificate → Freelance Agency Owner",
    ]),
    relatedCareers: JSON.stringify([
      "vernacular-content-creator",
      "csc-digital-entrepreneur",
    ]),
    isSampleData: true,
  },
  {
    title: "E-Commerce Logistics Hub & Last-Mile Delivery Franchisee",
    slug: "rural-logistics-delivery-franchisee",
    category: "business",
    description:
      "Manage a pin-code parcel distribution center, supervise delivery executives, coordinate reverse pickups, and ensure same-day parcel delivery in semi-urban and rural clusters.",
    requiredSkills: JSON.stringify([
      "Logistics Management Software & Scanner Systems",
      "Route Optimization & Fleet Dispatch",
      "Cash on Delivery (COD) Reconciliation & Cash Management",
      "Delivery Team Recruitment & Performance Tracking",
      "Pincode Inbound/Outbound Inventory Audits",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 or Graduate in any stream with basic commercial knowledge",
    ]),
    salaryRange: "₹25,000 - ₹60,000/month",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Work 3 months as an associate at an express logistics hub (Delhivery, Shadowfax, Ekart)",
      "Learn COD cash security protocols and dispatch management apps",
      "Apply for a rural delivery franchise with a small warehouse space (300-500 sq ft)",
      "Build a team of 4-8 local youth with two-wheelers for fast last-mile delivery",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 / Degree → Logistics Apprenticeship → Franchise Operator / Hub Manager",
    ]),
    relatedCareers: JSON.stringify([
      "warehouse-inventory-associate",
      "rural-retail-modernizer",
    ]),
    isSampleData: true,
  },
  {
    title: "Farmer Producer Organization (FPO) Chief Executive",
    slug: "fpo-manager-agribusiness",
    category: "business",
    description:
      "Lead business operations for a collective of 500+ smallholder farmers, negotiating bulk input procurement (seeds/fertilizers), organizing sorting/grading, and securing direct corporate buyer contracts.",
    requiredSkills: JSON.stringify([
      "Agricultural Value Chain & Commodity Pricing",
      "e-NAM (National Agriculture Market) Portal Trading",
      "Business Plan Preparation & Bank Credit Proposals",
      "Statutory Compliance under Companies Act / Cooperatives",
      "Farmer Mobilization & Governance Management",
    ]),
    requiredQualifications: JSON.stringify([
      "BSc Agriculture, BBA, BCom, or Rural Management / Agribusiness Diploma",
    ]),
    salaryRange: "₹28,000 - ₹65,000/month",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Learn FPO formation guidelines issued by SFAC and NABARD",
      "Understand bulk post-harvest quality standards for grains, pulses, and oilseeds",
      "Shadow the CEO of an established FPO in your district for 2 months",
      "Apply for FPO CEO positions funded by government cluster promotion agencies",
    ]),
    educationPaths: JSON.stringify([
      "BSc Agri / BCom → Post Graduate Diploma in Agribusiness (PGDABM) → FPO Chief Executive",
    ]),
    relatedCareers: JSON.stringify([
      "agri-produce-aggregator",
      "gram-sevak-panchayat-assistant",
    ]),
    isSampleData: true,
  },

  // 8. Creative Arts, Design & Media
  {
    title: "Digital Video Editor & Reel Animator",
    slug: "video-editor-motion-graphics-artist",
    category: "creative",
    description:
      "Edit high-retention video reels, YouTube documentaries, promotional brand films, and wedding cinema using modern editing software and motion graphics.",
    requiredSkills: JSON.stringify([
      "Adobe Premiere Pro / DaVinci Resolve / Final Cut",
      "Short-Form Video Pacing & Sound Design",
      "Color Grading & Audio Noise Removal",
      "Keyframe Motion Graphics & Kinetic Typography",
      "Thumbnail & Hook Creation for Social Algorithms",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass",
      "Portfolio or showreel of at least 5 edited video clips",
    ]),
    salaryRange: "₹20,000 - ₹55,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Download DaVinci Resolve (free) or CapCut / Premiere Pro on your computer",
      "Study YouTube editing breakdown tutorials on pacing, J-cuts, and B-roll usage",
      "Re-edit open-source footage and assemble a 60-second video editing showreel",
      "Reach out to emerging creators, NGOs, and businesses on Instagram and YouTube",
    ]),
    educationPaths: JSON.stringify([
      "Self-Taught Portfolio / Diploma in Video Editing & Animation → Senior Video Editor",
    ]),
    relatedCareers: JSON.stringify([
      "vernacular-content-creator",
      "graphic-designer-print-specialist",
    ]),
    isSampleData: true,
  },
  {
    title: "Junior UI/UX & Mobile App Product Designer",
    slug: "ui-ux-product-designer",
    category: "creative",
    description:
      "Design user-friendly mobile and web interfaces, wireframes, and design systems for next-billion digital users using Figma and user research methodologies.",
    requiredSkills: JSON.stringify([
      "Figma Component Libraries & Auto-Layout",
      "User Journey Mapping & Wireframing",
      "Typography, Color Theory & Accessibility (WCAG)",
      "Prototyping & Micro-Interactions",
      "Usability Testing with Vernacular Users",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass or Bachelor's in Design, Arts, or Computer Science",
      "Figma portfolio with at least 2 complete mobile app case studies",
    ]),
    salaryRange: "₹25,000 - ₹65,000/month",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Learn Figma through free YouTube design tutorials and the Figma Community",
      "Redesign a popular Indian app (like IRCTC or Kisan Suvidha) to be simpler and cleaner",
      "Publish your case studies on Behance and LinkedIn",
      "Apply for junior UI/UX designer internships at tech startups and digital agencies",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 → B.Des / BCA / Self-Taught Figma Mastery → Product Designer",
    ]),
    relatedCareers: JSON.stringify([
      "junior-frontend-web-developer",
      "graphic-designer-print-specialist",
    ]),
    isSampleData: true,
  },
  {
    title: "Regional Audio Storyteller & Voiceover Artist",
    slug: "vernacular-audio-podcast-producer",
    category: "creative",
    description:
      "Record professional voiceovers for e-learning courses, government public health announcements, regional audiobooks (Kuku FM, Pocket FM), and radio advertisements.",
    requiredSkills: JSON.stringify([
      "Clear Diction, Voice Modulation & Tone Control",
      "Microphone Technique & Home Acoustic Treatment",
      "Audio Editing & Mastering (Audacity / Reaper)",
      "Expressive Vernacular Storytelling",
      "Script Adaptation & Dialect Neutralization",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass with excellent mother tongue spoken clarity",
    ]),
    salaryRange: "₹18,000 - ₹45,000/month",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Set up a USB condenser microphone with a basic pop filter in a quiet room",
      "Record 3 voiceover demos in your mother tongue (storytelling, commercial, educational)",
      "Learn free Audacity audio cleanup (noise reduction, equalization, compression)",
      "Submit voice samples to audio platforms (Kuku FM, Pocket FM, Audible) and dubbing studios",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 (Arts/Literature) → Voice Modulation Workshop → Full-Time Voice Artist",
    ]),
    relatedCareers: JSON.stringify([
      "vernacular-content-creator",
      "video-editor-motion-graphics-artist",
    ]),
    isSampleData: true,
  },

  // 9. Hospitality & Tourism
  {
    title: "Cultural Heritage & Temple Tourism Experience Guide",
    slug: "heritage-tour-experience-curator",
    category: "hospitality",
    description:
      "Curate experiential storytelling tours of ancient temples, historical monuments, local handicraft villages, and food walks for domestic and international travelers.",
    requiredSkills: JSON.stringify([
      "Indian Art, Architecture & Historical Storytelling",
      "English & Vernacular Multilingual Fluency",
      "Tour Group Logistics & Safety Management",
      "Hospitality Etiquette & Cultural Sensitivities",
      "First Aid & Emergency Response",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass or Graduation in History, Tourism, or Arts",
      "Regional Level Guide license from Ministry of Tourism preferred",
    ]),
    salaryRange: "₹20,000 - ₹45,000/month",
    demandLevel: "high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Study the history, architectural iconography, and folklore of key monuments in your region",
      "Clear the Ministry of Tourism Incredible India Tourist Facilitator (IITF) online certification",
      "Practice narrating 15-minute engaging heritage stories in English and Hindi",
      "List curated walking tours on travel platforms (TripAdvisor, MakeMyTrip, Airbnb Experiences)",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 → Bachelor of Tourism Studies (BTS) / IITF Certification → Certified Heritage Guide",
    ]),
    relatedCareers: JSON.stringify([
      "homestay-eco-tourism-guide",
      "front-office-travel-coordinator",
    ]),
    isSampleData: true,
  },
  {
    title: "Artisanal Bakery & Confectionery Specialist",
    slug: "bakery-pastry-entrepreneur",
    category: "hospitality",
    description:
      "Bake customized celebratory cakes, artisan sourdough breads, cookies, and local regional baked delicacies using modern commercial convection ovens.",
    requiredSkills: JSON.stringify([
      "Dough Fermentation & Pastry Chemistry",
      "Cake Decorating, Fondant & Whipped Cream Art",
      "Food Safety & FSSAI Hygiene Standards",
      "Commercial Deck & Convection Oven Operation",
      "Costing, Inventory & Social Media Cake Marketing",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 10 or Class 12 pass",
      "Diploma or certificate in Bakery & Confectionery (6 months to 1 year)",
    ]),
    salaryRange: "₹18,000 - ₹45,000/month",
    demandLevel: "very_high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Enroll in an accredited baking and pastry diploma at an Institute of Hotel Management (IHM)",
      "Master yeast bread proofing, sponge cake textures, and chocolate tempering",
      "Obtain an FSSAI basic food safety registration certificate",
      "Start a home baking micro-brand taking custom birthday cake orders via Instagram and WhatsApp",
    ]),
    educationPaths: JSON.stringify([
      "Class 10/12 → Certificate in Bakery & Confectionery (IHM) → Bakery Entrepreneur",
    ]),
    relatedCareers: JSON.stringify([
      "food-production-cook-assistant",
      "food-processing-machine-operator",
    ]),
    isSampleData: true,
  },

  // 10. Banking, Finance & Accounting
  {
    title: "NISM Certified Financial & Mutual Fund Advisor",
    slug: "mutual-fund-insurance-advisor",
    category: "finance",
    description:
      "Educate rural and semi-urban households on financial planning, micro-SIP investments, health insurance policies, and post office saving schemes under SEBI guidelines.",
    requiredSkills: JSON.stringify([
      "Mutual Fund Schemes & Risk Profiling (NISM Series V-A)",
      "Term Life & Health Insurance Underwriting Basics",
      "Financial Goal Setting & Systematic Investment Plans (SIP)",
      "Digital KYC & CAMS/KFintech Onboarding",
      "Patient Investor Education & Ethics",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass (minimum age 18)",
      "Clearance of NISM Series V-A: Mutual Fund Distributors Certification Exam",
    ]),
    salaryRange: "₹20,000 - ₹50,000+/month (base + trail commissions)",
    demandLevel: "high",
    growthOutlook: "rapidly_growing",
    firstSteps: JSON.stringify([
      "Study the NISM Series V-A Mutual Fund Distributor workbook",
      "Register and pass the NISM exam at an authorized NSE/BSE test center",
      "Obtain your AMFI Registration Number (ARN)",
      "Partner with digital distributor platforms (BSE StAR MF, Zerodha Coin, Groww) to onboard clients",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 / Commerce Degree → NISM V-A Certification → Independent Financial Advisor",
    ]),
    relatedCareers: JSON.stringify([
      "junior-tally-gst-accountant",
      "banking-correspondent-mitra",
    ]),
    isSampleData: true,
  },
  {
    title: "Digital KYC & Credit Verification Specialist",
    slug: "fintech-kyc-loan-verifier",
    category: "finance",
    description:
      "Verify identity documents, conduct video KYC (V-KYC), check land records/CIBIL credit scores, and perform field residence verifications for fintech lenders, banks, and NBFCs.",
    requiredSkills: JSON.stringify([
      "Video KYC (V-KYC) Compliance & Facial Match Verification",
      "Document Fraud Detection (Aadhaar, PAN, Bank Statements)",
      "Credit Bureau Report (CIBIL/Equifax) Interpretation",
      "Mobile Geotagged Field Verification Apps",
      "Customer Data Privacy & RBI Regulations",
    ]),
    requiredQualifications: JSON.stringify([
      "Class 12 pass or Bachelor's in any discipline",
      "Good communication skills and detail orientation",
    ]),
    salaryRange: "₹18,000 - ₹35,000/month",
    demandLevel: "high",
    growthOutlook: "steady",
    firstSteps: JSON.stringify([
      "Learn RBI Master Direction on Know Your Customer (KYC)",
      "Understand how banks and fintechs evaluate debt-to-income ratios and credit scores",
      "Practice using digital document scanning and OCR verification apps",
      "Apply to third-party verification agencies (BPOs) and NBFC field offices",
    ]),
    educationPaths: JSON.stringify([
      "Class 12 → Banking Operations Training → Fintech Credit Verification Officer",
    ]),
    relatedCareers: JSON.stringify([
      "banking-correspondent-mitra",
      "microfinance-loan-officer",
    ]),
    isSampleData: true,
  },
];

export async function seed30NewCareers() {
  console.log(`🚀 Seeding ${NEW_30_CAREERS.length} NEW high-impact careers into NextLearning...`);

  let count = 0;
  for (const career of NEW_30_CAREERS) {
    await prisma.career.upsert({
      where: { slug: career.slug },
      update: career,
      create: career,
    });
    count++;
  }

  const total = await prisma.career.count();
  console.log(`✅ Successfully seeded ${count} new careers! Total careers in database: ${total}`);
}

if (require.main === module) {
  seed30NewCareers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error seeding new careers:", err);
      process.exit(1);
    });
}
