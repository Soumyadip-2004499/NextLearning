import prisma from "../src/lib/db";
import { Role } from "@prisma/client";
import { ingestDikshaDataset } from "./ingest-diksha";

const DEMO_PASSWORD_HASH = "$2b$10$3euPFOt1xJgA5m.Yj6YpcuY0fF2Qc2o5eYk8Fv8O/i0/v9Q5b8qGu";

export async function seedExtendedContent() {
  console.log("🚀 Starting extended content seed (new students, courses & training modules)...");

  // 1. Get Facilitator G. Sai Kavya
  const facilitatorUser = await prisma.user.findFirst({
    where: { email: "demo@teacher.com" },
    include: { facilitatorProfile: true },
  });

  if (!facilitatorUser || !facilitatorUser.facilitatorProfile) {
    console.error("Facilitator G. Sai Kavya profile not found. Please run base seed first.");
    return;
  }
  const facilitatorId = facilitatorUser.facilitatorProfile.id;

  // ====================================================
  // 2. ADDITIONAL REALISTIC VOCATIONAL COURSES
  // ====================================================
  console.log("📚 Seeding additional vocational courses across diverse non-solar domains...");
  const extraCourses = [
    {
      id: "res-dgca-agri-drone-pilot",
      title: "Skill India / DGCA: Remote Pilot Certificate Course for Agricultural Drones",
      description:
        "Comprehensive DGCA-compliant curriculum covering multi-rotor drone aerodynamics, GPS waypoint flight planning, lithium polymer battery charging safety, and drone spraying calibration for paddy and sugarcane.",
      provider: "Drone Federation of India & Skill India Digital Hub",
      resourceType: "course",
      url: "https://skillindiadigital.gov.in/courses/agri-drone-pilot",
      language: "en",
      educationLevel: JSON.stringify(["class_10", "class_12", "vocational_iti", "polytechnic_diploma"]),
      subjects: JSON.stringify(["Agritech", "Aviation", "Precision Farming"]),
      skills: JSON.stringify(["Drone Piloting & DGCA Flight Regulations", "Pesticide & Spraying Calibration", "GPS Waypoint Navigation"]),
      duration: "15 hours (5 days practical)",
      difficulty: "intermediate",
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: "res-asdc-ev-battery-servicing",
      title: "ASDC / NCVET: Electric Two-Wheeler BLDC Motor & Lithium Battery Diagnostic Guide",
      description:
        "Practical diagnostic masterclass: testing battery management systems (BMS), troubleshooting BLDC hub motor Hall sensors, throttle potentiometer wiring, and regenerative braking controllers.",
      provider: "Automotive Skills Development Council (ASDC)",
      resourceType: "video",
      url: "https://asdc.org.in/learning/ev-technician-masterclass",
      language: "hi",
      educationLevel: JSON.stringify(["class_10", "vocational_iti", "polytechnic_diploma"]),
      subjects: JSON.stringify(["Automobile", "Electrical Engineering", "EV Technology"]),
      skills: JSON.stringify(["Two-Wheeler / Electric Vehicle Servicing", "Domestic Electrical Wiring & Safety", "Problem Solving & Troubleshooting"]),
      duration: "6 hours",
      difficulty: "intermediate",
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: "res-hssc-general-duty-assistant",
      title: "Healthcare Sector Skill Council: General Duty Assistant (GDA) Patient Care Handbook",
      description:
        "Essential patient care procedures for rural healthcare centers: sterile dressing, vital sign monitoring (BP, SpO2, temperature), wheelchair patient transfer, and emergency CPR protocols.",
      provider: "Healthcare Sector Skill Council (HSSC)",
      resourceType: "article",
      url: "https://healthcare-skills.com/curriculum/gda-handbook",
      language: "hi",
      educationLevel: JSON.stringify(["class_10", "class_12", "vocational_iti"]),
      subjects: JSON.stringify(["Healthcare", "Biology", "Community Health"]),
      skills: JSON.stringify(["Patient Vital Signs Monitoring", "Medical Equipment Sanitization & First Aid", "Empathy & Bedside Manners"]),
      duration: "8 hours",
      difficulty: "beginner",
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: "res-icar-organic-natural-farming",
      title: "ICAR / MANAGE: Natural & Bio-Dynamic Farming Masterclass",
      description:
        "Scientific methods for preparing Jeevamrit, Beejamrit, pest deterrents using neem leaves and cow urine, mulching techniques, and zero-budget natural farming (ZBNF) certification steps.",
      provider: "Indian Council of Agricultural Research (ICAR)",
      resourceType: "course",
      url: "https://manage.gov.in/courses/natural-farming-guide",
      language: "hi",
      educationLevel: JSON.stringify(["class_8", "class_10", "vocational_iti"]),
      subjects: JSON.stringify(["Agriculture", "Ecology", "Organic Farming"]),
      skills: JSON.stringify(["Soil Sample Testing & Chemistry", "Environmental & Ecological Awareness", "Natural Crop Protection"]),
      duration: "10 hours",
      difficulty: "beginner",
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: "res-niesbud-microenterprise-accounting",
      title: "NIESBUD: Rural Micro-Enterprise Bookkeeping, Cash Flow & Mudra Loan Navigation",
      description:
        "Simplified bookkeeping tutorial for village self-help groups and micro-entrepreneurs: recording daily cash sales, ledger balancing, inventory tracking, and preparing bankable PMMY Mudra loan business proposals.",
      provider: "National Institute for Entrepreneurship and Small Business Development (NIESBUD)",
      resourceType: "article",
      url: "https://niesbud.nic.in/training/microenterprise-bookkeeping",
      language: "en",
      educationLevel: JSON.stringify(["class_10", "class_12", "undergraduate"]),
      subjects: JSON.stringify(["Commerce", "Finance", "Entrepreneurship"]),
      skills: JSON.stringify(["Financial Literacy & Bookkeeping", "Customer Communication & Service", "Small Business Planning"]),
      duration: "4.5 hours",
      difficulty: "beginner",
      isSampleData: true,
      verifiedAt: new Date(),
    },
    {
      id: "res-essci-mobile-pcb-repair",
      title: "ESSCI: Smartphone Hardware Troubleshooting & SMD Micro-Soldering Guide",
      description:
        "Techniques for tracing short circuits on mobile phone motherboards, using DC power supplies for current leakage detection, replacing Type-C charging ports, and microscope SMD soldering.",
      provider: "Electronics Sector Skills Council of India (ESSCI)",
      resourceType: "video",
      url: "https://essc-india.org/courses/mobile-repair-fundamentals",
      language: "hi",
      educationLevel: JSON.stringify(["class_10", "vocational_iti"]),
      subjects: JSON.stringify(["Electronics", "Trades", "Hardware"]),
      skills: JSON.stringify(["PCB Component Soldering", "Problem Solving & Troubleshooting", "Multimeter Operation"]),
      duration: "5 hours",
      difficulty: "intermediate",
      isSampleData: true,
      verifiedAt: new Date(),
    },
  ];

  for (const c of extraCourses) {
    await prisma.learningResource.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log(`✅ Seeded ${extraCourses.length} additional vocational courses.`);

  // ====================================================
  // 3. SEED TRAINING MODULES AUTHORED BY G. SAI KAVYA
  // ====================================================
  console.log("📝 Seeding Training Modules authored by Facilitator G. Sai Kavya...");
  const modulesData = [
    {
      id: "mod-career-readiness-101",
      title: "Rural Career Readiness & ITI Apprenticeship Navigator",
      description: "A foundational guidance module for rural students transitioning from school to accredited vocational diplomas, ITI trades, and NAPS apprenticeships.",
      targetLevel: "Class 9 - Class 12",
      objectives: JSON.stringify([
        "Understand NCVT vs SCVT certification benefits",
        "Navigate the National Apprenticeship Promotion Scheme (NAPS)",
        "Build a simple professional resume and prepare for trade interviews",
      ]),
      facilitatorId,
      status: "published",
      accessType: "free",
      estimatedDuration: "3.5 hours",
      lessons: [
        {
          order: 1,
          title: "Mapping Your Practical Talents to In-Demand Vocational Trades",
          content: "Explore the 12 primary vocational sectors in rural India and match your practical interests.",
          resourceType: "video",
          duration: "30 mins",
          activityType: "self_study",
        },
        {
          order: 2,
          title: "How to Apply for Govt. ITI Admissions & Merit List Criteria",
          content: "Walkthrough of state ITI online admission portals, document checklists, and reservation categories.",
          resourceType: "guide",
          duration: "45 mins",
          activityType: "interactive",
        },
        {
          order: 3,
          title: "Registering on Apprenticeship India (NAPS Portal)",
          content: "Step-by-step registration, e-KYC verification, and searching for district-level stipend vacancies.",
          resourceType: "walkthrough",
          duration: "60 mins",
          activityType: "practical",
        },
      ],
    },
    {
      id: "mod-agri-drone-tech",
      title: "Agri-Tech & Precision Drone Spraying Fundamentals",
      description: "Curated training module introducing youth to modern agricultural technologies, automated spraying, soil sensors, and drone pilot licensing in India.",
      targetLevel: "Class 10 - Class 12",
      objectives: JSON.stringify([
        "Understand DGCA drone categories and pilot eligibility",
        "Learn liquid pesticide payload calculations per acre",
        "Explore drone entrepreneurship under Sub-Mission on Agricultural Mechanization (SMAM)",
      ]),
      facilitatorId,
      status: "published",
      accessType: "free",
      estimatedDuration: "4 hours",
      lessons: [
        {
          order: 1,
          title: "Introduction to Drone Hardware & Brushless Motors",
          content: "Key components of agricultural quadcopters and hexacopters: flight controllers, ESCs, telemetry, and nozzles.",
          resourceType: "article",
          duration: "45 mins",
          activityType: "self_study",
        },
        {
          order: 2,
          title: "Flight Safety, Weather Limits & No-Fly Zones",
          content: "DigitalSky portal regulations, green/yellow/red zones, wind tolerance, and safe landing protocols.",
          resourceType: "video",
          duration: "45 mins",
          activityType: "interactive",
        },
        {
          order: 3,
          title: "Subsidies & Bank Loans for Custom Hiring Centers (CHCs)",
          content: "How rural youth cooperatives and individuals can obtain 40-50% subsidy under SMAM for agricultural drones.",
          resourceType: "guide",
          duration: "60 mins",
          activityType: "practical",
        },
      ],
    },
    {
      id: "mod-clean-energy-solar",
      title: "Clean Energy & PM Surya Ghar Rooftop Skilling Guide",
      description: "Orientation module for youth interested in solar technician careers, rooftop installations, net-metering, and government solar subsidies.",
      targetLevel: "Class 10 & Vocational",
      objectives: JSON.stringify([
        "Master single-phase vs three-phase rooftop solar wiring",
        "Understand PM Surya Ghar 1 crore homes rooftop scheme",
        "Prepare for certified Surya Mitra training center enrollment",
      ]),
      facilitatorId,
      status: "published",
      accessType: "free",
      estimatedDuration: "5 hours",
      lessons: [
        {
          order: 1,
          title: "Solar PV Photovoltaic Fundamentals & Rooftop Suitability",
          content: "Calculating shadow-free roof area, orientation (South facing), and monthly electricity bill savings.",
          resourceType: "article",
          duration: "40 mins",
          activityType: "self_study",
        },
        {
          order: 2,
          title: "Inverter Synchronisation & DISCOM Net-Metering",
          content: "Connecting grid-tie inverters to local utility distribution transformer lines and bidirectional meters.",
          resourceType: "video",
          duration: "50 mins",
          activityType: "interactive",
        },
        {
          order: 3,
          title: "Surya Mitra National Certification Exam Preparation",
          content: "Mock assessment questions on electrical safety standards, earthing pits, and lightning protection.",
          resourceType: "quiz",
          duration: "60 mins",
          activityType: "assessment",
        },
      ],
    },
  ];

  for (const mod of modulesData) {
    const { lessons, ...moduleInfo } = mod;
    const createdModule = await prisma.trainingModule.upsert({
      where: { id: moduleInfo.id },
      update: moduleInfo,
      create: moduleInfo,
    });

    for (const lesson of lessons) {
      const lessonId = `${createdModule.id}-lesson-${lesson.order}`;
      await prisma.moduleLesson.upsert({
        where: { id: lessonId },
        update: {
          moduleId: createdModule.id,
          order: lesson.order,
          title: lesson.title,
          content: lesson.content,
          resourceUrl: (lesson as any).resourceUrl || null,
          duration: lesson.duration,
          activityType: lesson.activityType,
        },
        create: {
          id: lessonId,
          moduleId: createdModule.id,
          order: lesson.order,
          title: lesson.title,
          content: lesson.content,
          resourceUrl: (lesson as any).resourceUrl || null,
          duration: lesson.duration,
          activityType: lesson.activityType,
        },
      });
    }
  }
  console.log(`✅ Seeded ${modulesData.length} training modules authored by G. Sai Kavya.`);

  // ====================================================
  // 4. SEED ADDITIONAL STUDENTS UNDER G. SAI KAVYA
  // ====================================================
  console.log("👥 Seeding 4 additional diverse students assigned to Facilitator G. Sai Kavya...");

  const studentsToCreate = [
    {
      email: "ananya.mondal@student.in",
      name: "Ananya Mondal",
      phone: "+919876543221",
      educationLevel: "class_12",
      district: "Bankura",
      state: "West Bengal",
      interests: ["agriculture", "technology", "clean_energy"],
      hobbies: ["drone photography", "cycling", "science experiments"],
      favoriteSubjects: ["Biology", "Physics", "Computer Applications"],
      skills: ["Smartphone Navigation & App Usage", "Basic Computer Operations", "Pesticide & Spraying Calibration"],
      careerAspirations: ["Agri-Drone Pilot & Crop Survey Specialist", "Precision Farming Technician"],
      careerPreference: "vocational",
      availableHours: 12,
      deviceAccess: "smartphone",
      facilitatorNotes: "Ananya completed Class 12 Science in Bankura. Exceptional focus on agricultural drone piloting. Connected with Bankura KVK for upcoming DGCA pilot batch.",
      roadmap: {
        id: "roadmap-ananya-drone-1",
        title: "Agri-Drone Pilot & Crop Survey Specialist",
        description: "Accredited DGCA Remote Pilot Certification track with field agricultural spraying internships in West Bengal.",
        steps: [
          {
            id: "step-ananya-1",
            order: 1,
            title: "Principles of Aerodynamics & Multi-Rotor Drones",
            description: "Understand lift, thrust, pitch, yaw, and multi-rotor flight stabilization sensors.",
            type: "learn",
            status: "completed",
            duration: "5 hours",
            completedAt: new Date("2026-10-08"),
          },
          {
            id: "step-ananya-2",
            order: 2,
            title: "DGCA DigitalSky Regulations & Airspace Safety",
            description: "Learn airspace categorization, flight log documentation, and NOTAM warnings.",
            type: "learn",
            status: "completed",
            duration: "4 hours",
            completedAt: new Date("2026-10-12"),
          },
          {
            id: "step-ananya-3",
            order: 3,
            title: "Simulated Waypoint Flight Planning on Android HUD",
            description: "Practice grid mapping, overlap percentage, and auto-return-to-home programming.",
            type: "practice",
            status: "in_progress",
            duration: "6 hours",
            completedAt: null,
          },
          {
            id: "step-ananya-4",
            order: 4,
            title: "Field Spraying Nozzle Flow Calibration",
            description: "Hands-on chemical dilution, droplet micron sizing, and drift control.",
            type: "practice",
            status: "pending",
            duration: "4 hours",
            completedAt: null,
          },
        ],
      },
      savedOpportunity: "opp-pm-surya-ghar-skilling",
      applicationStatus: "preparing_documents",
      appNotes: "Awaiting character certificate from school principal for DGCA verification.",
    },
    {
      email: "rahul.soren@student.in",
      name: "Rahul Soren",
      phone: "+919876543222",
      educationLevel: "class_10",
      district: "Purulia",
      state: "West Bengal",
      interests: ["trades", "technology", "logistics"],
      hobbies: ["motorcycle mechanics", "football", "carpentry"],
      favoriteSubjects: ["Mathematics", "Physics", "Work Education"],
      skills: ["Two-Wheeler / Electric Vehicle Servicing", "Domestic Electrical Wiring & Safety", "Multimeter Operation"],
      careerAspirations: ["Electric Vehicle Service Technician", "Auto Electrician"],
      careerPreference: "employment",
      availableHours: 15,
      deviceAccess: "smartphone",
      facilitatorNotes: "Rahul has high hands-on aptitude for mechanics and circuits. Aiming for an immediate apprenticeship at local Tata/Mahindra EV service station in Purulia.",
      roadmap: {
        id: "roadmap-rahul-ev-1",
        title: "EV Two-Wheeler Diagnostic & Battery Technician",
        description: "Specialized vocational pathway covering high-voltage battery safety, BLDC motors, and computerized ECU scan tools.",
        steps: [
          {
            id: "step-rahul-1",
            order: 1,
            title: "DC Power Fundamentals & High-Voltage Disconnect Safety",
            description: "Understand 48V-72V DC safety, insulated PPE, and emergency circuit breakers.",
            type: "learn",
            status: "completed",
            duration: "4 hours",
            completedAt: new Date("2026-10-09"),
          },
          {
            id: "step-rahul-2",
            order: 2,
            title: "Lithium-Ion Cell Balancing & BMS Health Diagnostics",
            description: "Testing cell voltages, thermal runaway prevention, and replacing damaged cells.",
            type: "practice",
            status: "in_progress",
            duration: "6 hours",
            completedAt: null,
          },
          {
            id: "step-rahul-3",
            order: 3,
            title: "BLDC Hub Motor Stator Rewinding & Hall Sensor Testing",
            description: "Diagnosing motor stuttering, phase angle matching (60 vs 120 degrees), and water damage.",
            type: "practice",
            status: "pending",
            duration: "8 hours",
            completedAt: null,
          },
        ],
      },
      savedOpportunity: "opp-railway-apprentice",
      applicationStatus: "submitted",
      appNotes: "Submitted application for Purulia division railway mechanical apprentice quota.",
    },
    {
      email: "priyanka.sen@student.in",
      name: "Priyanka Sen",
      phone: "+919876543223",
      educationLevel: "class_12",
      district: "Howrah",
      state: "West Bengal",
      interests: ["healthcare", "community_services", "science"],
      hobbies: ["reading", "first aid volunteering", "sketching"],
      favoriteSubjects: ["Biology", "Chemistry", "English"],
      skills: ["Patient Vital Signs Monitoring", "Medical Equipment Sanitization & First Aid", "Empathy & Bedside Manners"],
      careerAspirations: ["Healthcare General Duty Assistant (GDA)", "Community Health Officer"],
      careerPreference: "further_education",
      availableHours: 14,
      deviceAccess: "smartphone",
      facilitatorNotes: "Priyanka is preparing for GDA certification while exploring GNM nursing entrance exams. Highly diligent in patient vitals assessment practice.",
      roadmap: {
        id: "roadmap-priyanka-gda-1",
        title: "Certified General Duty Assistant (GDA) in Allied Healthcare",
        description: "Professional nursing assistant track covering infection control, patient mobilization, and clinical documentation.",
        steps: [
          {
            id: "step-priyanka-1",
            order: 1,
            title: "Hospital Infection Prevention & Biomedical Waste Segregation",
            description: "Color-coded waste disposal (yellow, red, blue, black), hand hygiene, and PPE protocols.",
            type: "learn",
            status: "completed",
            duration: "4 hours",
            completedAt: new Date("2026-10-05"),
          },
          {
            id: "step-priyanka-2",
            order: 2,
            title: "Accurate Vital Signs Monitoring (BP, SpO2, Pulse, Temp)",
            description: "Practical mastery using sphygmomanometer, digital pulse oximeter, and recording TPR charts.",
            type: "practice",
            status: "completed",
            duration: "6 hours",
            completedAt: new Date("2026-10-11"),
          },
          {
            id: "step-priyanka-3",
            order: 3,
            title: "Emergency First Aid, Bleeding Control & CPR Drills",
            description: "Cardiopulmonary resuscitation on training manikins and burn wound stabilization.",
            type: "practice",
            status: "in_progress",
            duration: "5 hours",
            completedAt: null,
          },
        ],
      },
      savedOpportunity: "opp-pm-yasasvi",
      applicationStatus: "ready_to_apply",
      appNotes: "Documents verified by G. Sai Kavya. Ready to apply on NSP portal.",
    },
    {
      email: "subhash.bauri@student.in",
      name: "Subhash Bauri",
      phone: "+919876543224",
      educationLevel: "class_9",
      district: "Bardhaman",
      state: "West Bengal",
      interests: ["agriculture", "environment", "business"],
      hobbies: ["gardening", "cattle care", "clay modeling"],
      favoriteSubjects: ["Geography", "Life Science", "History"],
      skills: ["Soil Sample Testing & Chemistry", "Environmental & Ecological Awareness", "Foundational Mathematics & Calculations"],
      careerAspirations: ["Organic Farm Manager", "Bio-Fertilizer Entrepreneur"],
      careerPreference: "entrepreneurship",
      availableHours: 10,
      deviceAccess: "smartphone",
      facilitatorNotes: "Subhash's family runs a 2-acre farm in Bardhaman. Very keen on vermicomposting and bio-fertilizer sales to local farmers.",
      roadmap: {
        id: "roadmap-subhash-organic-1",
        title: "Organic Farm Manager & Vermicomposting Entrepreneur",
        description: "Zero-budget natural farming track, bio-manure bed preparation, and rural micro-enterprise setup.",
        steps: [
          {
            id: "step-subhash-1",
            order: 1,
            title: "Principles of Organic Soil Biology & Earthworm Species",
            description: "Eisenia fetida characteristics, bedding moisture (60-70%), and organic carbon enhancement.",
            type: "learn",
            status: "completed",
            duration: "4 hours",
            completedAt: new Date("2026-10-07"),
          },
          {
            id: "step-subhash-2",
            order: 2,
            title: "Building Low-Cost Concrete Vermibeds & Shade Nets",
            description: "Preventing ant infestations, drainage aeration, and layering organic crop residue.",
            type: "practice",
            status: "in_progress",
            duration: "8 hours",
            completedAt: null,
          },
          {
            id: "step-subhash-3",
            order: 3,
            title: "Harvesting, Sieving & Packaging Organic Vermicompost",
            description: "Moisture reduction, moisture-proof packaging, and pricing bags for local nursery sales.",
            type: "practice",
            status: "pending",
            duration: "5 hours",
            completedAt: null,
          },
        ],
      },
      savedOpportunity: "opp-nabard-fellow-intern",
      applicationStatus: "interested",
      appNotes: "Exploring youth micro-subsidy for vermibed infrastructure.",
    },
  ];

  for (const stu of studentsToCreate) {
    // 1. Create User
    const user = await prisma.user.upsert({
      where: { email: stu.email },
      update: {
        name: stu.name,
        phone: stu.phone,
        passwordHash: DEMO_PASSWORD_HASH,
        role: Role.STUDENT,
        language: "en",
      },
      create: {
        email: stu.email,
        name: stu.name,
        phone: stu.phone,
        passwordHash: DEMO_PASSWORD_HASH,
        role: Role.STUDENT,
        language: "en",
      },
    });

    // 2. Create StudentProfile
    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        displayName: stu.name,
        educationLevel: stu.educationLevel,
        district: stu.district,
        state: stu.state,
        interests: JSON.stringify(stu.interests),
        hobbies: JSON.stringify(stu.hobbies),
        favoriteSubjects: JSON.stringify(stu.favoriteSubjects),
        skills: JSON.stringify(stu.skills),
        careerAspirations: JSON.stringify(stu.careerAspirations),
        careerPreference: stu.careerPreference,
        availableHours: stu.availableHours,
        deviceAccess: stu.deviceAccess,
        onboardingCompleted: true,
      },
      create: {
        userId: user.id,
        displayName: stu.name,
        educationLevel: stu.educationLevel,
        district: stu.district,
        state: stu.state,
        interests: JSON.stringify(stu.interests),
        hobbies: JSON.stringify(stu.hobbies),
        favoriteSubjects: JSON.stringify(stu.favoriteSubjects),
        skills: JSON.stringify(stu.skills),
        careerAspirations: JSON.stringify(stu.careerAspirations),
        careerPreference: stu.careerPreference,
        availableHours: stu.availableHours,
        deviceAccess: stu.deviceAccess,
        onboardingCompleted: true,
      },
    });

    // 3. Assign to G. Sai Kavya
    await prisma.facilitatorStudentAssignment.upsert({
      where: {
        facilitatorId_studentId: {
          facilitatorId,
          studentId: profile.id,
        },
      },
      update: {
        notes: stu.facilitatorNotes,
      },
      create: {
        facilitatorId,
        studentId: profile.id,
        notes: stu.facilitatorNotes,
      },
    });

    // 4. Create Learning Roadmap
    const r = await prisma.learningRoadmap.upsert({
      where: { id: stu.roadmap.id },
      update: {
        studentId: profile.id,
        careerTitle: stu.roadmap.title,
        description: stu.roadmap.description,
        status: "active",
      },
      create: {
        id: stu.roadmap.id,
        studentId: profile.id,
        careerTitle: stu.roadmap.title,
        description: stu.roadmap.description,
        status: "active",
      },
    });

    // 5. Create Steps
    for (const step of stu.roadmap.steps) {
      await prisma.roadmapStep.upsert({
        where: { id: step.id },
        update: {
          roadmapId: r.id,
          order: step.order,
          title: step.title,
          description: step.description,
          type: step.type,
          status: step.status,
          duration: step.duration,
          completedAt: step.completedAt,
        },
        create: {
          id: step.id,
          roadmapId: r.id,
          order: step.order,
          title: step.title,
          description: step.description,
          type: step.type,
          status: step.status,
          duration: step.duration,
          completedAt: step.completedAt,
        },
      });
    }

    // 6. Link Saved Opportunity and Application
    await prisma.savedOpportunity.upsert({
      where: {
        studentId_opportunityId: {
          studentId: profile.id,
          opportunityId: stu.savedOpportunity,
        },
      },
      update: { notes: "Bookmarked during career guidance orientation." },
      create: {
        studentId: profile.id,
        opportunityId: stu.savedOpportunity,
        notes: "Bookmarked during career guidance orientation.",
      },
    });

    await prisma.applicationRecord.upsert({
      where: {
        studentId_opportunityId: {
          studentId: profile.id,
          opportunityId: stu.savedOpportunity,
        },
      },
      update: {
        status: stu.applicationStatus,
        notes: stu.appNotes,
      },
      create: {
        studentId: profile.id,
        opportunityId: stu.savedOpportunity,
        status: stu.applicationStatus,
        notes: stu.appNotes,
      },
    });

    // 7. Facilitator Recommendation
    await prisma.facilitatorRecommendation.create({
      data: {
        facilitatorId,
        studentId: profile.id,
        type: "resource",
        referenceId: "res-dgca-agri-drone-pilot",
        message: `${stu.name}, please review this newly added certified module. It will help strengthen your practical track.`,
        isRead: false,
      },
    }).catch(() => {});
  }

  console.log("🎉 All 4 additional students, roadmaps, and assignments successfully seeded under G. Sai Kavya!");

  // 5. Ingest DIKSHA dataset
  await ingestDikshaDataset();
}

if (require.main === module) {
  seedExtendedContent()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error running extended seed:", err);
      process.exit(1);
    });
}
