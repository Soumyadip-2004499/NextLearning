import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface LessonData {
  order: number;
  title: string;
  content: string;
  resourceUrl?: string;
  duration: string;
  activityType: "lesson" | "quiz" | "activity" | "practical" | "interactive" | "self_study" | "assignment";
}

export interface TrainingModuleData {
  id: string;
  title: string;
  description: string;
  targetLevel: string;
  objectives: string[];
  status: "published" | "draft" | "archived";
  accessType: "free" | "paid";
  estimatedDuration: string;
  lessons: LessonData[];
}

export const KAVYA_20_MODULES: TrainingModuleData[] = [
  // 1. Electric Vehicle (EV)
  {
    id: "mod-kavya-ev-servicing",
    title: "Electric Vehicle (EV) 2-Wheeler Servicing & Battery Diagnostics",
    description:
      "A comprehensive vocational training program preparing rural and semi-urban youth for certified EV technician roles, focusing on BLDC hub motors, lithium-ion battery management systems (BMS), and regenerative braking controllers.",
    targetLevel: "Class 10 / ITI Motor Mechanic",
    objectives: [
      "Diagnose BLDC motor controller wiring and Hall effect sensors using digital multimeters",
      "Safely test and cell-balance 48V-72V lithium-ion NMC/LFP battery packs",
      "Apply for ASDC Electric Vehicle Service Technician Level 4 certification on Skill India Digital",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "5 hours",
    lessons: [
      {
        order: 1,
        title: "BLDC Hub Motor Architecture, Hall Sensors & Throttle Wiring",
        content:
          "Master the inner workings of brushless DC motors, 3-phase stator coils, Hall sensor 60/120 degree timing tests, and troubleshooting faulty throttle potentiometers.",
        resourceUrl: "https://skillindiadigital.gov.in/courses/ev-mechanic",
        duration: "45 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Lithium-Ion Battery Pack BMS, Thermal Runaway & Cell Balancing",
        content:
          "Hands-on guide to testing Battery Management System (BMS) over-voltage/under-voltage cutoffs, balancing individual cylindrical 21700/18650 cells, and fire safety protocols.",
        resourceUrl: "https://asdc.org.in/ev-safety-protocols",
        duration: "60 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "ASDC Level 4 EV Technician Certification Mock Assessment",
        content:
          "Practice diagnostic scenarios: tracing wiring harness short circuits, calculating regenerative braking efficiency, and passing official ASDC exam modules.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "45 mins",
        activityType: "quiz",
      },
    ],
  },

  // 2. Smart Irrigation & Solar Pumps
  {
    id: "mod-kavya-smart-irrigation-kusum",
    title: "Smart Drip Irrigation, IoT Soil Sensors & PM-KUSUM Solar Pumps",
    description:
      "Learn modern micro-irrigation systems, soil moisture tensiometer probes, solar water pumping under PM-KUSUM Component-B, and state water conservation subsidies.",
    targetLevel: "Class 10 - Class 12 (Agriculture/Vocational)",
    objectives: [
      "Calculate hydraulic head and sizing for 3HP-7.5HP solar submersible pumps",
      "Install automated solenoid valves linked to digital soil moisture probes",
      "Guide farmer producer organizations (FPOs) through PM-KUSUM subsidy documentation",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4.5 hours",
    lessons: [
      {
        order: 1,
        title: "PM-KUSUM Solar Pump Sizing & DC Solar Drive Configuration",
        content:
          "Sizing solar panel wattage arrays for borehole depths, configuring Variable Frequency Drives (VFDs), and installing DC lightning arresters.",
        resourceUrl: "https://pmkusum.mnre.gov.in",
        duration: "50 mins",
        activityType: "video" as any,
      },
      {
        order: 2,
        title: "Installing Venturi Fertilizer Injectors & Sand Filtration Systems",
        content:
          "Step-by-step installation of fertigation units, disc filter flushing routines, and pressure compensating (PC) drip emitter line layouts.",
        resourceUrl: "https://agricoop.nic.in",
        duration: "55 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "IoT Soil Moisture Tensiometers & Micro-Irrigation Maintenance",
        content:
          "Connecting low-cost capacitive soil sensors to wireless telemetry units to automate daily watering schedules and prevent root zone waterlogging.",
        resourceUrl: "https://diksha.gov.in",
        duration: "40 mins",
        activityType: "lesson",
      },
    ],
  },

  // 3. Healthcare Assistant (GDA)
  {
    id: "mod-kavya-gda-healthcare",
    title: "General Duty Healthcare Assistant (GDA) & Hospital Protocols",
    description:
      "Equipping entry-level healthcare workers with vital patient monitoring skills, aseptic hospital hygiene, biomedical waste handling, and emergency first response.",
    targetLevel: "Class 10 / Class 12 Pass",
    objectives: [
      "Accurately record patient vital signs (BP, pulse, SpO2, and temperature)",
      "Execute strict infection control and Biomedical Waste Management (BMW) color protocols",
      "Assist nursing staff during emergency patient transport and basic life support",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "6 hours",
    lessons: [
      {
        order: 1,
        title: "Vital Signs Measurement & Digital Diagnostics",
        content:
          "Operating digital and aneroid sphygmomanometers, fingertip pulse oximeters, digital thermometers, and recording readings in hospital bed charts.",
        resourceUrl: "https://swayam.gov.in",
        duration: "50 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Hospital Aseptic Techniques & Color-Coded Bio-Medical Waste Bags",
        content:
          "Mastering yellow, red, blue, and white puncture-proof waste segregation bins under Central Pollution Control Board (CPCB) medical guidelines.",
        resourceUrl: "https://nhm.gov.in",
        duration: "45 mins",
        activityType: "interactive",
      },
      {
        order: 3,
        title: "Patient Bedside Care, Mobility & Emergency Stretcher Handling",
        content:
          "Ergonomic lifting techniques, bed sore prevention positioning for bedridden patients, and rapid response trolley liaison in civil hospitals.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "55 mins",
        activityType: "practical",
      },
    ],
  },

  // 4. Tally Prime & GST Accounting
  {
    id: "mod-kavya-tally-gst-accounting",
    title: "Tally Prime, GST Filing & MSME Digital Bookkeeping",
    description:
      "Hands-on accounting course for rural commerce students, covering Tally Prime double-entry bookkeeping, CGST/SGST/IGST calculations, E-Way bills, and GSTR-1 summaries.",
    targetLevel: "Class 12 Commerce / Arts / Graduates",
    objectives: [
      "Create ledgers, cost centers, and inventory stock groups in Tally Prime",
      "Generate GST-compliant tax invoices with appropriate HSN/SAC codes",
      "Reconcile purchase registers with GSTR-2B and prepare GSTR-3B monthly drafts",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "6.5 hours",
    lessons: [
      {
        order: 1,
        title: "Tally Prime Company Setup & Voucher Entry (Sales, Purchase, Payment)",
        content:
          "Setting up charts of accounts, creating customer and vendor ledgers, and recording daily debit/credit vouchers with inventory details.",
        resourceUrl: "https://tallysolutions.com",
        duration: "60 mins",
        activityType: "interactive",
      },
      {
        order: 2,
        title: "GST Invoicing, HSN Code Mapping & E-Way Bill Generation",
        content:
          "Configuring 5%, 12%, 18%, and 28% GST tax slabs, setting up interstate IGST rules, and generating instant E-Way bills for consignments over ₹50,000.",
        resourceUrl: "https://gst.gov.in",
        duration: "60 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Bank Reconciliation Statement (BRS) & Financial Year-End Closing",
        content:
          "Auto-reconciling bank statements with cash books, adjusting unpresented cheques, and generating trial balances for local MSMEs.",
        resourceUrl: "https://swayam.gov.in",
        duration: "50 mins",
        activityType: "quiz",
      },
    ],
  },

  // 5. AI Data Annotation
  {
    id: "mod-kavya-ai-data-annotation",
    title: "AI Data Annotation, Prompting & Regional Language Voice Quality",
    description:
      "Preparing rural youth for remote digital work in artificial intelligence: image bounding-box labeling, multilingual text classification, and Telugu/Hindi speech transcription.",
    targetLevel: "Class 12 Pass / Basic Computer Literacy",
    objectives: [
      "Label computer vision datasets using bounding boxes, polygons, and keypoints",
      "Transcribe and annotate vernacular regional audio for speech recognition models",
      "Register on ethical crowdsourcing platforms and maintain 98%+ quality audit scores",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4 hours",
    lessons: [
      {
        order: 1,
        title: "Fundamentals of Computer Vision Labeling (Bounding Boxes & Segmentation)",
        content:
          "Practicing precise object annotation on open-source labeling tools: drawing polygon boundaries around crops, vehicles, and retail products.",
        resourceUrl: "https://diksha.gov.in",
        duration: "45 mins",
        activityType: "interactive",
      },
      {
        order: 2,
        title: "Vernacular Audio Transcription & Phonetic Tagging in Indian Languages",
        content:
          "Timestamping audio clips, tagging background noise, phonetically correcting regional dialect variations, and formatting subtitle files.",
        resourceUrl: "https://bhashini.gov.in",
        duration: "50 mins",
        activityType: "lesson",
      },
      {
        order: 3,
        title: "Guidelines for Data Confidentiality, QA Spot-Checks & Platform Payouts",
        content:
          "Understanding NDA compliance, evaluating inter-annotator agreement metrics, and configuring direct bank payouts via UPI/NEFT.",
        resourceUrl: "https://swayam.gov.in",
        duration: "35 mins",
        activityType: "quiz",
      },
    ],
  },

  // 6. E-Commerce & SHG Digital Storefronts
  {
    id: "mod-kavya-ecommerce-shg-artisan",
    title: "Digital Storefronts & E-Commerce for Rural Artisans & SHGs",
    description:
      "Helping self-help group members and young village entrepreneurs digitize handicrafts, handlooms, and organic produce through ONDC, GeM portal, and social commerce.",
    targetLevel: "Class 10 - Class 12 / SHG Youth",
    objectives: [
      "Onboard rural micro-products onto Open Network for Digital Commerce (ONDC)",
      "Photograph products with smartphones and design marketing banners in Canva",
      "Manage packaging, barcoding, and domestic courier dispatch via India Post Speed Post",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4 hours",
    lessons: [
      {
        order: 1,
        title: "Product Photography with Smartphones & Creating Clean White Backgrounds",
        content:
          "Natural lighting setups, smartphone macro photography for weaves and pottery, and removing messy backgrounds with free tools.",
        resourceUrl: "https://canva.com",
        duration: "40 mins",
        activityType: "practical",
      },
      {
        order: 2,
        title: "Listing Handicrafts on ONDC Seller Apps & GeM Saras Collection",
        content:
          "Product title optimization, pricing calculations including courier fees, and uploading product catalogs to Government e-Marketplace (GeM).",
        resourceUrl: "https://ondc.org",
        duration: "50 mins",
        activityType: "interactive",
      },
      {
        order: 3,
        title: "Packaging Standards, India Post Parcel Integration & Customer Grievances",
        content:
          "Bubble wrap and corrugated box packing standards, generating prepaid shipping labels, and tracking customer delivery timelines.",
        resourceUrl: "https://indiapost.gov.in",
        duration: "40 mins",
        activityType: "lesson",
      },
    ],
  },

  // 7. Solar PV Operations & Maintenance
  {
    id: "mod-kavya-solar-rooftop-om",
    title: "Solar PV Rooftop Operations, Maintenance & Grid Synchronisation",
    description:
      "Advanced hands-on module for aspiring solar entrepreneurs and technicians on string sizing, net-metering synchronization with state DISCOMs, and preventive maintenance.",
    targetLevel: "Class 10 / ITI Electrician",
    objectives: [
      "Inspect DC string voltage, open-circuit parameters, and MPPT operating points",
      "Execute bidirectional net-meter testing with local DISCOM distribution engineers",
      "Perform thermal imaging and multimeter checks for solar cell hot-spots",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "5 hours",
    lessons: [
      {
        order: 1,
        title: "Solar String Combiner Boxes, DC Isolators & Surge Protection Devices (SPD)",
        content:
          "Wiring DC disconnect switches, calculating fuse ratings for parallel module strings, and verifying Type-II SPD earthing.",
        resourceUrl: "https://nise.res.in",
        duration: "45 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "DISCOM Net-Meter Synchronization & Anti-Islanding Grid Tripping Tests",
        content:
          "Testing safety trip switches when main grid power drops, ensuring zero back-feeding hazard for line workers during maintenance.",
        resourceUrl: "https://pmsuryaghar.gov.in",
        duration: "55 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Preventive Cleaning Cycles, Hotspot Diagnostics & O&M Contract Sizing",
        content:
          "Optimal early morning panel wash procedures, identifying micro-cracks and bypass diode failures, and structuring annual maintenance contracts (AMC).",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "40 mins",
        activityType: "quiz",
      },
    ],
  },

  // 8. Warehouse Inventory & Logistics
  {
    id: "mod-kavya-warehouse-logistics",
    title: "Warehouse Inventory Management & Supply Chain Logistics",
    description:
      "Fast-track certification module for warehouse associates covering barcode/RFID scanning, FIFO stock rotation, picker-packer optimization, and freight dispatch.",
    targetLevel: "Class 10 Pass",
    objectives: [
      "Operate handheld barcode scanners and mobile Warehouse Management Systems (WMS)",
      "Apply First-In-First-Out (FIFO) and cycle-counting to maintain 99%+ inventory accuracy",
      "Understand workplace ergonomics, pallet stacking standards, and forklift traffic safety",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4 hours",
    lessons: [
      {
        order: 1,
        title: "Inbound Dock Receiving, Inspection & SKU Palletization",
        content:
          "Verifying delivery manifests against physical cartons, checking for freight damage, and scanning batch barcodes into the warehouse database.",
        resourceUrl: "https://lsscindia.org",
        duration: "45 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Order Picking Strategies (Batch vs Zone) & Handheld Scanner Operation",
        content:
          "Navigating warehouse aisles with pick lists, scanning item bin locations, and minimizing pick-to-pack transit times.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "45 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Outbound Dispatch Manifests & Logistics Sector Skill Council Exam Prep",
        content:
          "Securing pallets with stretch film wrap, generating bill-of-lading documents, and completing LSSC certification assessments.",
        resourceUrl: "https://lsscindia.org",
        duration: "40 mins",
        activityType: "quiz",
      },
    ],
  },

  // 9. Customer Relationship Executive (CRE) & Vernacular BPO
  {
    id: "mod-kavya-customer-relationship-bpo",
    title: "Customer Relationship Executive (CRE) & Vernacular BPO Skills",
    description:
      "Professional tele-calling, active listening, and conflict de-escalation skills for regional language call centers, government citizen helplines, and banking support.",
    targetLevel: "Class 12 Pass",
    objectives: [
      "Demonstrate empathetic customer communication in regional languages and English",
      "Use CRM ticketing software to log complaints and route escalation tickets",
      "Master voice modulation, standard phone scripts, and grievance resolution benchmarks",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "3.5 hours",
    lessons: [
      {
        order: 1,
        title: "The Art of Active Listening & Empathetic Call Handling",
        content:
          "Phrasing polite affirmations, taking structured notes during calls, and pacing tone to calm distressed or confused citizens.",
        resourceUrl: "https://diksha.gov.in",
        duration: "40 mins",
        activityType: "interactive",
      },
      {
        order: 2,
        title: "CRM Helpdesk Software Walkthrough (Zendesk / Zoho Desk Lite)",
        content:
          "Creating support tickets, assigning priority tags (P1 to P4), recording call timestamps, and writing clear internal notes.",
        resourceUrl: "https://swayam.gov.in",
        duration: "45 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "De-escalating Angry Callers & State Helpline (104/108/1912) Mock Scenarios",
        content:
          "Role-playing realistic helpline scenarios: electricity outage reporting, medical ambulance dispatch, and loan query clarification.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "45 mins",
        activityType: "activity",
      },
    ],
  },

  // 10. Commercial Hydroponics
  {
    id: "mod-kavya-commercial-hydroponics",
    title: "Commercial Hydroponics & Automated Polyhouse Cultivation",
    description:
      "Soilless farming technology for modern rural youth: Nutrient Film Technique (NFT), Dutch bucket systems, climate automation, and high-value leafy greens.",
    targetLevel: "Class 10 - Class 12 / Agriculture Polytechnic",
    objectives: [
      "Formulate macro and micro nutrient solutions (N-P-K, Calcium, Iron Chelates)",
      "Monitor and stabilize water pH (5.5-6.5) and Electrical Conductivity (EC)",
      "Automate greenhouse cooling pads and fogging systems for round-the-year yield",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "5 hours",
    lessons: [
      {
        order: 1,
        title: "Hydroponic Systems Design: NFT Channels vs Dutch Buckets",
        content:
          "Pipe slope calculations for nutrient film channels, submersible pump flow rates, and selecting sterile cocopeat/perlite growing media.",
        resourceUrl: "https://agricoop.nic.in",
        duration: "45 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Nutrient Solution Chemistry, EC/pH Meter Calibration & Water Aeration",
        content:
          "Mixing Part A and Part B concentrated stock solutions, calibrating digital pen meters with buffer solutions, and oxygenating sump tanks.",
        resourceUrl: "https://icar.org.in",
        duration: "60 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Harvesting, Cold Packaging & Direct Marketing to Urban Supermarkets",
        content:
          "Gentle harvesting with roots intact, food-grade clamshell packaging, and establishing supply contracts with regional grocery apps.",
        resourceUrl: "https://diksha.gov.in",
        duration: "45 mins",
        activityType: "lesson",
      },
    ],
  },

  // 11. Dialysis Unit Clinical Assistant
  {
    id: "mod-kavya-dialysis-clinical-assistant",
    title: "Dialysis Unit Clinical Assistant & Renal Patient Care",
    description:
      "Technical and clinical orientation for allied health students seeking employment in government district hospitals and private hemodialysis centers.",
    targetLevel: "Class 12 Science (PCB preferred)",
    objectives: [
      "Understand hemodialyzer membrane principles, blood tubing lines, and dialysate baths",
      "Maintain strict aseptic cannulation and heparin anticoagulant administration protocols",
      "Respond promptly to dialysis complications including hypotension and muscle cramps",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "5.5 hours",
    lessons: [
      {
        order: 1,
        title: "Renal Anatomy Basics & Hemodialysis Machine Mechanics",
        content:
          "Functions of healthy kidneys, diffusion and ultrafiltration physics across semi-permeable membranes, and priming blood circuits.",
        resourceUrl: "https://swayam.gov.in",
        duration: "55 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Water Treatment Plant (RO) Quality Standards for Dialysis Centers",
        content:
          "Testing total dissolved solids (TDS), bacterial endotoxin limits, and maintaining water softener brine tanks for hospital dialysis units.",
        resourceUrl: "https://nhm.gov.in",
        duration: "50 mins",
        activityType: "interactive",
      },
      {
        order: 3,
        title: "Patient Monitoring During Treatment & Post-Dialysis Fistula Dressing",
        content:
          "Quarter-hourly vital checks, recognizing air detector alarms, safe needle withdrawal, and applying sterile pressure dressings on AV fistulas.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "55 mins",
        activityType: "practical",
      },
    ],
  },

  // 12. Microfinance & BC Sakhi Training
  {
    id: "mod-kavya-microfinance-bc-sakhi",
    title: "Microfinance Operations, Village SHG Banking & BC Sakhi Training",
    description:
      "Training women and rural youth to operate as certified Banking Correspondent (BC) Sakhis and Microfinance Field Officers under National Rural Livelihoods Mission (NRLM).",
    targetLevel: "Class 10 - Class 12 Pass",
    objectives: [
      "Operate Micro-ATM and AePS biometric fingerprint cash withdrawal terminals",
      "Appraise Joint Liability Group (JLG) creditworthiness and manage recovery books",
      "Promote social security schemes: PMJJBY, PMSBY, and Atal Pension Yojana",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4.5 hours",
    lessons: [
      {
        order: 1,
        title: "Aadhaar Enabled Payment System (AePS) & Micro-ATM Daily Operations",
        content:
          "Processing biometric cash withdrawals, balance inquiries, and mini-statements; reconciling opening and closing cash floats daily.",
        resourceUrl: "https://npci.org.in",
        duration: "45 mins",
        activityType: "practical",
      },
      {
        order: 2,
        title: "SHG Loan Application, Cash Book Maintenance & Repayment Scheduling",
        content:
          "Calculating interest amortization schedules, conducting weekly village group recovery meetings, and updating bank passbooks.",
        resourceUrl: "https://nrlm.gov.in",
        duration: "55 mins",
        activityType: "lesson",
      },
      {
        order: 3,
        title: "Indian Institute of Banking & Finance (IIBF) BC/BF Certification Preparation",
        content:
          "Mock questions on RBI fair practice codes, customer financial literacy guidance, and anti-fraud vigilance rules.",
        resourceUrl: "https://iibf.org.in",
        duration: "50 mins",
        activityType: "quiz",
      },
    ],
  },

  // 13. Mobile Phone Hardware Troubleshooting
  {
    id: "mod-kavya-mobile-repairing",
    title: "Mobile Phone Hardware Troubleshooting, SMD Soldering & Display Replacement",
    description:
      "Practical chip-level technician program covering multimeter tracing, charging port rework with hot-air guns, screen glass OCA lamination, and software recovery.",
    targetLevel: "Class 10 Pass / ITI Electronics",
    objectives: [
      "Trace power supply rails and identify shorted capacitors with digital multimeters",
      "Replace broken USB-C / micro-USB charging ports using hot air rework stations",
      "Safely de-laminate broken touchscreens and bond new display assemblies",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "6 hours",
    lessons: [
      {
        order: 1,
        title: "Smartphone Motherboard Architecture & Tracing VPH / VREG Power Lines",
        content:
          "Reading circuit schematic diagrams, using diode-mode on multimeters to locate ground shorts, and testing battery charging IC lines.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "60 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Hot Air Gun SMD Soldering: Replacing ICs, Diodes & Mic Ports Safely",
        content:
          "Temperature and airflow control (320°C - 380°C), using flux, protecting nearby plastic connectors with Kapton tape, and pin-alignment checks.",
        resourceUrl: "https://diksha.gov.in",
        duration: "60 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Display Separation, OCA Glue Cleaning & Vacuum Laminator Operation",
        content:
          "Using heated separation hot-plates (85°C), cutting wire methods, OCA glue debubbler chambers, and UV curing procedures.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "50 mins",
        activityType: "practical",
      },
    ],
  },

  // 14. Food Processing & FSSAI Compliance
  {
    id: "mod-kavya-food-processing-fssai",
    title: "Food Processing, Post-Harvest Packaging & FSSAI Compliance",
    description:
      "Empowering youth to launch agro-processing micro-enterprises: fruit pulp preservation, millet snacks manufacturing, vacuum packaging, and FSSAI licensing.",
    targetLevel: "Class 10 - Class 12 / Micro-Entrepreneurs",
    objectives: [
      "Implement FSSAI Schedule 4 sanitary standards and food safety hygiene",
      "Calibrate nitrogen flushing and vacuum packaging machines for shelf-life extension",
      "Prepare project reports for 35% credit-linked capital subsidy under PMFME scheme",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4.5 hours",
    lessons: [
      {
        order: 1,
        title: "FSSAI Basic Food Safety Registration & Good Manufacturing Practices (GMP)",
        content:
          "Applying for registration on FoSCoS portal, mandatory water potability testing, hairnet/apron hygiene, and pest control logbooks.",
        resourceUrl: "https://fssai.gov.in",
        duration: "45 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Dehydration, Pasteurization & Vacuum Sealing Technologies for Spices & Pulses",
        content:
          "Operating solar tunnel dryers, temperature monitoring for preservation of active nutrients, and heat-sealing multi-layer pouches.",
        resourceUrl: "https://mofpi.gov.in",
        duration: "50 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Applying for PMFME Subsidy Loans via Jan Samarth Portal",
        content:
          "Drafting micro-enterprise Detailed Project Reports (DPR), calculating machine costs, and submitting online loan requests under PMFME.",
        resourceUrl: "https://jansamarth.in",
        duration: "45 mins",
        activityType: "interactive",
      },
    ],
  },

  // 15. Graphic Design & Social Media Marketing
  {
    id: "mod-kavya-graphic-design-social-media",
    title: "Graphic Design, Vernacular Advertising & Social Media Marketing",
    description:
      "Learn to create eye-catching visual content, WhatsApp marketing flyers, YouTube thumbnails, and promotional videos for local businesses, schools, and festivals.",
    targetLevel: "Class 10 - Class 12 / Creative Youth",
    objectives: [
      "Master Canva and open-source tools for flyer, poster, and banner design",
      "Edit promotional short videos and reels with voiceovers and regional subtitles",
      "Manage a Meta Business Suite page and execute local hyper-targeted WhatsApp campaigns",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4 hours",
    lessons: [
      {
        order: 1,
        title: "Principles of Visual Hierarchy, Color Contrast & Regional Font Typography",
        content:
          "Choosing contrasting color palettes, pairing English and vernacular fonts legibly, and designing festival promotional flyers in minutes.",
        resourceUrl: "https://canva.com",
        duration: "45 mins",
        activityType: "interactive",
      },
      {
        order: 2,
        title: "Video Editing on Smartphone (VN / CapCut): Pacing, B-roll & Caption Sync",
        content:
          "Importing video footage, trimming dead air, applying smooth transitions, adding trending background audio, and generating auto-captions.",
        resourceUrl: "https://swayam.gov.in",
        duration: "50 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Building a Freelance Design Portfolio & Pricing Posters for Local Businesses",
        content:
          "Packaging flyer bundles for local retail stores and coaching institutes, pitching on WhatsApp Business, and setting fair price tiers.",
        resourceUrl: "https://diksha.gov.in",
        duration: "35 mins",
        activityType: "lesson",
      },
    ],
  },

  // 16. Optometry Clinical Assistant
  {
    id: "mod-kavya-optometry-assistant",
    title: "Optometry Clinical Assistant & Eyecare Vision Screening",
    description:
      "Allied ophthalmic training for organizing school vision screenings, measuring refractive errors with auto-refractometers, and dispensing corrective spectacles.",
    targetLevel: "Class 12 Pass (Science / Arts)",
    objectives: [
      "Administer Snellen chart and tumbling E visual acuity tests accurately",
      "Operate automated refractometers and verify interpupillary distance (IPD)",
      "Educate community members on diabetic retinopathy and cataract referral pathways",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4.5 hours",
    lessons: [
      {
        order: 1,
        title: "Ocular Anatomy, Common Refractive Errors (Myopia/Hyperopia) & Visual Acuity",
        content:
          "Understanding eye structure, testing 6/6 distance vision with 6-meter charts, pinhole testing to distinguish refractive vs pathological loss.",
        resourceUrl: "https://swayam.gov.in",
        duration: "45 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Lens Types (Single Vision, Bifocal, Progressive) & Frame Measurement",
        content:
          "Measuring pupillary distance (PD) with millimeter rulers, selecting appropriate bridge sizes, and adjusting spectacle temples for comfort.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "50 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Conducting Community Vision Screening Camps under National Blindness Control Program",
        content:
          "Organizing primary screening camps in rural schools, maintaining cataract surgical registry logs, and coordinating referrals to district hospitals.",
        resourceUrl: "https://nhm.gov.in",
        duration: "45 mins",
        activityType: "activity",
      },
    ],
  },

  // 17. Commercial Floriculture & Cold Chain
  {
    id: "mod-kavya-floriculture-cold-chain",
    title: "Commercial Floriculture, Greenhouse Cultivation & Cold Chain Logistics",
    description:
      "High-value horticultural entrepreneurship: protected cultivation of marigold, gerbera, and Dutch roses, drip fertigation, and post-harvest cooling for temple and wedding markets.",
    targetLevel: "Class 9 - Class 12 / Progressive Farmers",
    objectives: [
      "Manage climate control, shade nets, and soil solarization in flower polyhouses",
      "Prepare pulsing preservative solutions (Silver Thiosulfate & Sucrose) to extend cut flower vase life",
      "Organize reefer truck logistics and wholesale mandi dispatch across regional metros",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4 hours",
    lessons: [
      {
        order: 1,
        title: "Protected Flower Cultivation: Bed Preparation, Pinching & Disbudding",
        content:
          "Preparing raised soil beds with compost and trichoderma, managing drip fertigation timers, and pruning techniques to maximize flower head size.",
        resourceUrl: "https://nhb.gov.in",
        duration: "45 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Post-Harvest Pulsing, Grading Standards & Pre-Cooling Procedures",
        content:
          "Grading stems by length and bud opening stage, hydration in preservative solutions, and cold room pre-cooling to 4°C-6°C.",
        resourceUrl: "https://apeda.gov.in",
        duration: "45 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Cost of Cultivation, Mandi Commission Mechanics & NHB Polyhouse Subsidies",
        content:
          "Calculating operational expenses, understanding auction commissions at flower exchanges, and applying for National Horticulture Board subsidies.",
        resourceUrl: "https://agricoop.nic.in",
        duration: "40 mins",
        activityType: "quiz",
      },
    ],
  },

  // 18. Domestic CCTV Surveillance & Security Systems
  {
    id: "mod-kavya-cctv-security-technician",
    title: "Domestic CCTV Surveillance, Biometrics & Security Systems Installation",
    description:
      "Technical skilling for electrical and electronics youth to install IP cameras, crimp RJ45 network cables, configure NVR remote viewing, and install biometric access controllers.",
    targetLevel: "Class 10 Pass / ITI Electrical",
    objectives: [
      "Crimp Cat6 Ethernet patch cables and terminate RJ45 connectors with zero packet loss",
      "Configure 4/8/16-channel PoE Network Video Recorders (NVR) and IP camera subnets",
      "Setup dynamic DNS, port forwarding, and smartphone mobile live surveillance viewing",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "5 hours",
    lessons: [
      {
        order: 1,
        title: "IP Camera Optics, Focal Lengths, Lux Sensitivity & PoE Switch Wiring",
        content:
          "Selecting 2.8mm wide-angle vs 4mm/6mm telephoto camera lenses, infrared night vision ranges, and calculating power budgets on PoE switches.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "50 mins",
        activityType: "lesson",
      },
      {
        order: 2,
        title: "Network Cable Crimping, Wall Conduit Routing & NVR IP Address Configuration",
        content:
          "T568B color code crimping with RJ45 ratcheting tools, continuity testing, configuring static IPs, and setting up motion-detection recording schedules.",
        resourceUrl: "https://diksha.gov.in",
        duration: "55 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Biometric Fingerprint & RFID Access Control Reader Wiring with Magnetic Door Strikes",
        content:
          "Connecting 12V DC power supplies, wiring exit push-buttons and electromagnetic drop-bolt locks, and enrolling user fingerprints into access software.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "45 mins",
        activityType: "practical",
      },
    ],
  },

  // 19. Digital Village Panchayat Operations & Citizen E-Services
  {
    id: "mod-kavya-csc-vle-digital-panchayat",
    title: "Digital Village Panchayat Operations & Citizen E-Services (CSC VLE)",
    description:
      "Prepare rural youth to establish village Common Service Centers (CSC) and deliver citizen government services: Ayushman cards, PAN cards, land records, and welfare schemes.",
    targetLevel: "Class 12 Pass / Digital Entrepreneurs",
    objectives: [
      "Apply for Telecentre Entrepreneur Course (TEC) certification to register as CSC VLE",
      "Navigate state e-district portals for caste, income, and residence certificate applications",
      "Facilitate PM Kisan e-KYC, Ayushman Bharat Golden Card generation, and banking services",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "4.5 hours",
    lessons: [
      {
        order: 1,
        title: "CSC Registration Architecture, TEC Certification & Hardware Setup Requirements",
        content:
          "Procuring biometric fingerprint scanners (Mantra/Morpho), dual-screen setups, color inkjet printers, and passing online TEC certification exams.",
        resourceUrl: "https://csc.gov.in",
        duration: "45 mins",
        activityType: "interactive",
      },
      {
        order: 2,
        title: "Delivering Central & State Government Welfare E-Services (Ayushman, PM Kisan, E-Shram)",
        content:
          "Step-by-step application walkthrough: biometric e-KYC verification, document uploads in compressed PDF format, and tracking application status.",
        resourceUrl: "https://serviceonline.gov.in",
        duration: "55 mins",
        activityType: "practical",
      },
      {
        order: 3,
        title: "Maintaining Audit Registers, Customer Service Benchmarks & Village Digital Literacy",
        content:
          "Maintaining prescribed government transaction fee registers, displaying Citizen Charters, and organizing DigiGaon digital literacy workshops.",
        resourceUrl: "https://pmgdishajansoochna.in",
        duration: "40 mins",
        activityType: "lesson",
      },
    ],
  },

  // 20. Spoken English & Workplace Readiness
  {
    id: "mod-kavya-workplace-readiness-english",
    title: "Spoken English, Interview Confidence & Workplace Readiness",
    description:
      "Transformational personality and communication workshop designed for first-generation learners: overcoming public speaking anxiety, confident self-introductions, and corporate etiquette.",
    targetLevel: "Open to All (Class 10, 12, ITI, Polytechnic & Graduates)",
    objectives: [
      "Overcome fear of speaking English through daily conversation frameworks",
      "Craft an authentic 90-second self-introduction for job and apprenticeship interviews",
      "Master professional workplace norms: email writing, punctuality, and collaborative teamwork",
    ],
    status: "published",
    accessType: "free",
    estimatedDuration: "5 hours",
    lessons: [
      {
        order: 1,
        title: "Daily Conversational English Drills: Greetings, Expressing Opinions & Asking Questions",
        content:
          "Sentence templates for everyday professional interactions, clarifying instructions politely, and practicing pronunciation of common workplace vocabulary.",
        resourceUrl: "https://swayam.gov.in",
        duration: "50 mins",
        activityType: "interactive",
      },
      {
        order: 2,
        title: "The 90-Second Professional Elevator Pitch & Body Language Secrets",
        content:
          "Structuring your introduction (Background, Key Skills, Future Aspiration), maintaining natural eye contact, firm handshakes, and seated posture.",
        resourceUrl: "https://diksha.gov.in",
        duration: "55 mins",
        activityType: "activity",
      },
      {
        order: 3,
        title: "Resume Building, Mock Interview Walkthrough & Common Traps to Avoid",
        content:
          "Designing a clean single-page CV without grammatical errors, answering 'Tell me about yourself' and 'What are your strengths?', and following up post-interview.",
        resourceUrl: "https://skillindiadigital.gov.in",
        duration: "50 mins",
        activityType: "quiz",
      },
    ],
  },
];

export async function seed20KavyaModules() {
  console.log("🌟 Seeding 20 comprehensive Training Modules for Facilitator G. Sai Kavya...");

  // 1. Find Facilitator G. Sai Kavya
  const kavyaUser = await prisma.user.findFirst({
    where: { email: "kavya@facilitator.com" },
    include: { facilitatorProfile: true },
  });

  const demoTeacherUser = await prisma.user.findFirst({
    where: { email: "demo@teacher.com" },
    include: { facilitatorProfile: true },
  });

  const primaryProfile = kavyaUser?.facilitatorProfile || demoTeacherUser?.facilitatorProfile;

  if (!primaryProfile) {
    console.error("Facilitator G. Sai Kavya profile not found. Please run base seed first.");
    return;
  }

  const primaryFacilitatorId = primaryProfile.id;
  console.log(`Linking modules to Facilitator Profile ID: ${primaryFacilitatorId} (${primaryProfile.displayName})`);

  // Also collect all facilitator IDs associated with G. Sai Kavya
  const allKavyaProfileIds = [
    kavyaUser?.facilitatorProfile?.id,
    demoTeacherUser?.facilitatorProfile?.id,
  ].filter(Boolean) as string[];

  // 2. Ensure existing 3 modules are also linked to primary Facilitator Profile
  const existingModuleIds = ["mod-career-readiness-101", "mod-agri-drone-tech", "mod-clean-energy-solar"];
  for (const modId of existingModuleIds) {
    const existing = await prisma.trainingModule.findUnique({ where: { id: modId } });
    if (existing && existing.facilitatorId !== primaryFacilitatorId) {
      await prisma.trainingModule.update({
        where: { id: modId },
        data: { facilitatorId: primaryFacilitatorId },
      });
      console.log(`Updated existing module ${modId} facilitator to ${primaryFacilitatorId}`);
    }
  }

  // 3. Upsert the 20 new training modules with their lessons
  let totalLessonsCreated = 0;
  for (const moduleData of KAVYA_20_MODULES) {
    const { lessons, ...modInfo } = moduleData;

    const moduleRecord = await prisma.trainingModule.upsert({
      where: { id: modInfo.id },
      update: {
        title: modInfo.title,
        description: modInfo.description,
        targetLevel: modInfo.targetLevel,
        objectives: JSON.stringify(modInfo.objectives),
        status: modInfo.status,
        accessType: modInfo.accessType,
        estimatedDuration: modInfo.estimatedDuration,
        facilitatorId: primaryFacilitatorId,
      },
      create: {
        id: modInfo.id,
        title: modInfo.title,
        description: modInfo.description,
        targetLevel: modInfo.targetLevel,
        objectives: JSON.stringify(modInfo.objectives),
        status: modInfo.status,
        accessType: modInfo.accessType,
        estimatedDuration: modInfo.estimatedDuration,
        facilitatorId: primaryFacilitatorId,
      },
    });

    for (const lesson of lessons) {
      const lessonId = `${moduleRecord.id}-lesson-${lesson.order}`;
      await prisma.moduleLesson.upsert({
        where: { id: lessonId },
        update: {
          moduleId: moduleRecord.id,
          order: lesson.order,
          title: lesson.title,
          content: lesson.content,
          resourceUrl: lesson.resourceUrl || null,
          duration: lesson.duration,
          activityType: lesson.activityType,
        },
        create: {
          id: lessonId,
          moduleId: moduleRecord.id,
          order: lesson.order,
          title: lesson.title,
          content: lesson.content,
          resourceUrl: lesson.resourceUrl || null,
          duration: lesson.duration,
          activityType: lesson.activityType,
        },
      });
      totalLessonsCreated++;
    }
  }

  console.log(`✅ Successfully seeded ${KAVYA_20_MODULES.length} new training modules and ${totalLessonsCreated} lessons for G. Sai Kavya!`);

  // Count total modules for Kavya
  const totalCount = await prisma.trainingModule.count({
    where: { facilitatorId: primaryFacilitatorId },
  });
  console.log(`Total training modules now authored by G. Sai Kavya: ${totalCount}`);
}

// Direct execution support
if (require.main === module) {
  seed20KavyaModules()
    .catch((err) => {
      console.error("Error seeding 20 Kavya modules:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
