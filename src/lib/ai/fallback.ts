/**
 * NextLearning Conversational AI Engine & Fallback Advisor.
 * Provides realistic, curated, high-accuracy guidance for Indian students across
 * all education stages, vernacular contexts, vocational skills, and career paths.
 */

export const FALLBACK_NOTICE =
  'NextLearning AI Local Advisory Engine. To enable live Google Gemini Cloud AI, configure GEMINI_API_KEY in .env or via the SET API button in the chat header.';

export interface FallbackRoadmapStep {
  order: number;
  title: string;
  description: string;
  type: 'learn' | 'practice' | 'exam' | 'milestone';
  duration: string;
  resourceTitle?: string;
  resourceUrl?: string;
}

export interface FallbackRoadmapTemplate {
  careerTitle: string;
  description: string;
  steps: FallbackRoadmapStep[];
}

/**
 * Pre-written structured roadmap templates for popular careers in NextLearning.
 */
export const FALLBACK_ROADMAPS: Record<string, FallbackRoadmapTemplate> = {
  'solar-pv-rooftop-technician': {
    careerTitle: 'Solar PV Rooftop Technician & Installer',
    description:
      'A hands-on vocational track to become a certified Surya Mitra solar technician, capable of installing, testing, and maintaining domestic and commercial rooftop solar arrays under the PM Surya Ghar Yojana.',
    steps: [
      {
        order: 1,
        title: 'Basic DC Electrical Science & Circuit Safety',
        description:
          'Learn basic electrical fundamentals: voltage, current, power equations, and shock hazard protocols using vernacular tutorials.',
        type: 'learn',
        duration: '2 weeks',
        resourceTitle: 'Diksha Electrical Safety Module',
        resourceUrl: 'https://diksha.gov.in',
      },
      {
        order: 2,
        title: 'Multimeter & Tool Mastery',
        description:
          'Hands-on practice using digital multimeters, wire strippers, crimping tools, and continuity testers with local hardware kit.',
        type: 'practice',
        duration: '1 week',
        resourceTitle: 'Skill India Digital: Multimeter Basics',
        resourceUrl: 'https://www.skillindiadigital.gov.in',
      },
      {
        order: 3,
        title: 'Solar PV Cell Physics & Array Sizing',
        description:
          'Study solar cell mechanics, shading loss factors, tilt angles for your Indian state, and inverter load calculations.',
        type: 'learn',
        duration: '3 weeks',
        resourceTitle: 'SWAYAM Solar Energy Fundamentals',
        resourceUrl: 'https://swayam.gov.in',
      },
      {
        order: 4,
        title: 'Rooftop Mounting & Mechanical Rails Workshop',
        description:
          'Practice mounting aluminum channels, weatherproofing roof anchors, running conduit, and lightning arrestor earthing.',
        type: 'practice',
        duration: '2 weeks',
      },
      {
        order: 5,
        title: 'Surya Mitra Skill Certification Prep & Exam',
        description:
          'Enroll in the government-recognized Surya Mitra skill qualification exam at your nearest NSDC/Skill India partner center.',
        type: 'exam',
        duration: '1 week',
        resourceTitle: 'National Institute of Solar Energy (NISE)',
        resourceUrl: 'https://nise.res.in',
      },
      {
        order: 6,
        title: 'Apprenticeship & Local Contractor Onboarding',
        description:
          'Register on the National Apprenticeship Promotion Scheme (NAPS) portal and partner with a local solar EPC contractor for paid field installations.',
        type: 'milestone',
        duration: '1 month',
      },
    ],
  },

  'junior-frontend-web-developer': {
    careerTitle: 'Junior Frontend Web Developer',
    description:
      'Step-by-step pathway from smartphone/computer basics to building interactive, modern responsive web applications using HTML, CSS, JavaScript, and React.',
    steps: [
      {
        order: 1,
        title: 'Web Foundations: Semantic HTML5 & Modern CSS3',
        description:
          'Learn page structure, flexbox, grid, and mobile-first responsive design principles.',
        type: 'learn',
        duration: '3 weeks',
        resourceTitle: 'freeCodeCamp Responsive Web Design',
        resourceUrl: 'https://www.freecodecamp.org',
      },
      {
        order: 2,
        title: 'Interactive Projects: JavaScript Fundamentals',
        description:
          'Master variables, DOM manipulation, event listeners, arrays, and fetching API data by building a simple weather or calculator app.',
        type: 'practice',
        duration: '4 weeks',
      },
      {
        order: 3,
        title: 'Modern UI Engineering with React & Tailwind CSS',
        description:
          'Learn components, hooks (useState, useEffect), and Tailwind utility classes to craft production-grade interfaces.',
        type: 'learn',
        duration: '4 weeks',
      },
      {
        order: 4,
        title: 'Git Version Control & GitHub Portfolio Creation',
        description:
          'Create a GitHub profile, commit project code, and deploy 3 functional projects on Vercel or Netlify to showcase to employers.',
        type: 'practice',
        duration: '2 weeks',
      },
      {
        order: 5,
        title: 'Technical Assessment & Problem Solving Drill',
        description:
          'Complete frontend coding challenges, review web accessibility (a11y), and test on slow 3G connections.',
        type: 'exam',
        duration: '1 week',
      },
      {
        order: 6,
        title: 'Freelance Profile Setup & Remote Junior Job Hunt',
        description:
          'Prepare your resume, set up profiles on Internshala, LinkedIn, and Naukri, and apply for verified entry-level web internships.',
        type: 'milestone',
        duration: '3 weeks',
      },
    ],
  },

  'agritech-drone-pilot': {
    careerTitle: 'Agritech Drone Pilot & Crop Monitor',
    description:
      'Learn precision agriculture techniques, remote pilot certification regulations (DGCA), drone flight mechanics, and multispectral crop analysis.',
    steps: [
      {
        order: 1,
        title: 'Principles of Drone Aerodynamics & DGCA Regulations',
        description:
          'Understand airspace classifications (Red/Yellow/Green zones), DGCA Remote Pilot Certificate requirements, and safety protocols.',
        type: 'learn',
        duration: '2 weeks',
      },
      {
        order: 2,
        title: 'Flight Simulator Drills & Mission Planning',
        description:
          'Practice drone takeoff, waypoint navigation, automated grid spraying paths, and emergency fail-safe returns in a simulator.',
        type: 'practice',
        duration: '2 weeks',
      },
      {
        order: 3,
        title: 'DGCA Certified Remote Pilot Training (RPC)',
        description:
          'Attend an approved Remote Pilot Training Organization (RPTO) for mandatory dual-control flight hours and legal certification.',
        type: 'exam',
        duration: '1 week',
      },
      {
        order: 4,
        title: 'Agricultural Spraying & Crop Health Mapping',
        description:
          'Master pesticide/fertilizer tank calibration, nozzle flow rates, NDVI vegetative health mapping, and soil moisture detection.',
        type: 'practice',
        duration: '3 weeks',
      },
      {
        order: 5,
        title: 'Launch Kisan Drone Service Business or Cooperative Role',
        description:
          'Partner with local Primary Agricultural Credit Societies (PACS) or Farmer Producer Organizations (FPOs) for seasonal crop spraying contracts.',
        type: 'milestone',
        duration: '1 month',
      },
    ],
  },

  'general-duty-assistant': {
    careerTitle: 'General Duty Medical Assistant (GDA)',
    description:
      'A noble healthcare foundation equipping you with vital patient care skills, basic hospital procedures, sanitation, and first aid.',
    steps: [
      {
        order: 1,
        title: 'Anatomy Basics & Infection Control Guidelines',
        description:
          'Understand human body systems, hospital hygiene, hand sanitization protocols, and personal protective equipment (PPE).',
        type: 'learn',
        duration: '3 weeks',
      },
      {
        order: 2,
        title: 'Vital Signs Monitoring & Patient Mobility',
        description:
          'Practice measuring pulse, blood pressure, blood glucose, temperature, and safe patient transfer techniques.',
        type: 'practice',
        duration: '3 weeks',
      },
      {
        order: 3,
        title: 'Emergency Response & Basic Life Support (BLS)',
        description:
          'Learn cardiopulmonary resuscitation (CPR), choking relief, burn dressing, and emergency ambulance liaison.',
        type: 'practice',
        duration: '2 weeks',
      },
      {
        order: 4,
        title: 'Healthcare Sector Skill Council (HSSC) Exam',
        description:
          'Appear for the formal GDA NSQF Level 4 certification assessment accredited by the National Skill Development Corporation.',
        type: 'exam',
        duration: '1 week',
      },
      {
        order: 5,
        title: 'Hospital Clinical Internship & Placement',
        description:
          'Complete a 100-hour supervised clinical rotation at a district civil hospital or recognized nursing facility.',
        type: 'milestone',
        duration: '1 month',
      },
    ],
  },
};

/**
 * Helper to select non-deterministic variation safely
 */
function selectRandom<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Helper to extract student profile and marks from prompt context
 */
function parseStudentContextFromPrompt(prompt?: string): {
  name: string;
  interest: string;
  class10Marks: string;
  class12Marks: string;
  isDistinction: boolean;
  isFirstDivision: boolean;
} {
  const p = prompt || '';
  const nameMatch = p.match(/- Name:\s*([^\n\r]+)/i);
  const interestMatch = p.match(/- Field of Interest:\s*([^\n\r]+)/i);
  const class10Match = p.match(/- Class 10th Marks[^:\r\n]*:\s*([^\n\r]+)/i);
  const class12Match = p.match(/- Class 12th Marks[^:\r\n]*:\s*([^\n\r]+)/i);

  const c10 = class10Match ? class10Match[1].trim() : 'Passed Class 10 (88.5% Distinction)';
  const c12 = class12Match ? class12Match[1].trim() : 'Class 12 Pass (86.2% First Division)';

  const marksText = `${c10} ${c12} ${p}`.toLowerCase();
  const isDistinction = /\b(8[0-9]|9[0-9]|100)\s*%|distinction|topper|merit\b/i.test(marksText);
  const isFirstDivision = /\b(6[0-9]|7[0-9])\s*%|first division\b/i.test(marksText);

  return {
    name: nameMatch ? nameMatch[1].trim() : 'Student',
    interest: interestMatch ? interestMatch[1].trim() : 'Technology & Computing',
    class10Marks: c10,
    class12Marks: c12,
    isDistinction,
    isFirstDivision,
  };
}

/**
 * Topic intent recognizers and rich conversational responses
 */
interface ConversationIntent {
  id: string;
  match: (text: string, tokens: string[]) => boolean;
  reply: (studentName?: string, rawPrompt?: string, cleanText?: string) => string;
}

const CONVERSATION_INTENTS: ConversationIntent[] = [
  // 1. Friendly Greetings (Natural Variations)
  {
    id: 'greeting',
    match: (text, tokens) => {
      const greetings = [
        'hi', 'hii', 'hiii', 'hello', 'helo', 'hey', 'namaste', 'namaskar',
        'vanakkam', 'kem cho', 'adaab', 'pranam', 'sat sri akaal', 'kannada',
        'good morning', 'good afternoon', 'good evening', 'wassup', 'yo'
      ];
      return (
        greetings.includes(text) ||
        tokens.some((t) => ['hi', 'hii', 'hello', 'hey', 'namaste', 'namaskar'].includes(t)) ||
        /^h+i+/i.test(text)
      );
    },
    reply: (studentName) => {
      const name = studentName ? ` ${studentName}` : '';
      const variants = [
        `Namaste${name}! 🙏 Welcome to **NextLearning AI**. I am your personal career counselor and educational mentor.

Instead of generic answers, my goal is to understand your background and help you figure out the best career path tailored to your strengths.

To give you personalized guidance:
1. 🎓 **Your Current Class & Board Exam Performance**: Did you complete Class 10th or 12th? How were your marks or percentage?
2. 📚 **Favorite Subjects**: Which subjects do you genuinely enjoy (e.g. Mathematics, Science, Biology, Languages, Social Studies, or Computers)?
3. 🛠️ **Your Natural Strengths**: Do you prefer hands-on work with machines/tools, writing computer code, healthcare & patient care, or business & commerce?
4. ⏱️ **Your Timeline**: Are you looking for quick job-ready skills (6-12 months like ITI/vocational) or a long-term degree?

Tell me about your marks and interests, and we will find the ideal path for you!`,

        `Hello${name}! 🌟 I am your **NextLearning Career Mentor**.

Every student has unique strengths, and my purpose is to help you match your natural talents with the most rewarding educational and livelihood avenues across India.

To help me tailor recommendations specifically for you:
1. Which class are you currently in or have you completed (Class 10th or 12th), and roughly what was your score?
2. Which subjects or daily activities do you find most interesting?
3. Do you prefer working on computers, practical machinery/circuits, healthcare, or business?

Share a little about yourself, and let's explore your best options together!`,

        `Welcome${name}! 🚀 I am **NextLearning AI**, your guide to verified careers, vocational skills, and government education schemes.

Whether you are deciding on higher secondary streams, comparing ITI vs. Polytechnic diplomas, or looking for high-demand vocational tracks like solar installation and web development, I am right here to help.

Where are you currently in your education journey, and what career fields are you curious about today?`
      ];
      return selectRandom(variants);
    },
  },

  // 2. Identity & Capabilities
  {
    id: 'identity',
    match: (text) =>
      text.includes('who are you') ||
      text.includes('what is your name') ||
      text.includes('what can you do') ||
      text.includes('how can you help') ||
      text.includes('about yourself'),
    reply: () =>
      `I am **NextLearning AI**, your intelligent career and vocational education navigator! 🚀

Here is how I can guide you:
- **Analyze your profile**: Share your current class, district, and favorite activities, and I will recommend matched careers.
- **Explain job pathways**: From solar installation, software development, and nursing, to drone piloting, accounting, and civil services.
- **Detail salaries & qualifications**: Realistic starting salaries, education prerequisites, and recognized government certifications (NSQF).
- **Free learning modules**: Connect you directly to certified DIKSHA, SWAYAM, and Skill India Digital lessons.

Go ahead and ask me any career or course question!`,
  },

  // 3. Marks-Aligned & Field-Specific Course Recommendations (Non-deterministic, diverse pools)
  {
    id: 'course-recommendation',
    match: (text) =>
      /\b(course|courses|recommend|recommendation|recommendations|suggest|suggestion|suggestions|what should i study|which course|what course|certif|certifications|training module|training modules|study options)\b/i.test(
        text
      ),
    reply: (studentName, rawPrompt, cleanText = '') => {
      const context = parseStudentContextFromPrompt(rawPrompt);
      const name = studentName || context.name || 'Student';
      const c10 = context.class10Marks;
      const c12 = context.class12Marks;
      const interest = context.interest.toLowerCase();
      const queryLower = (cleanText || '').toLowerCase();

      // Detect active interest domain
      const isTech =
        queryLower.includes('tech') || queryLower.includes('software') || queryLower.includes('code') || queryLower.includes('web') || queryLower.includes('ai') || queryLower.includes('computer') || queryLower.includes('data') ||
        interest.includes('tech') || interest.includes('software') || interest.includes('computer') || interest.includes('ai') || interest.includes('data');

      const isHealth =
        queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('nurse') || queryLower.includes('bio') || queryLower.includes('doctor') || queryLower.includes('dialysis') || queryLower.includes('hospital') || queryLower.includes('gda') ||
        interest.includes('health') || interest.includes('medical') || interest.includes('bio') || interest.includes('nurse');

      const isSolar =
        queryLower.includes('solar') || queryLower.includes('electric') || queryLower.includes('energy') || queryLower.includes('ev') || queryLower.includes('clean energy') || queryLower.includes('surya') ||
        interest.includes('solar') || interest.includes('environment') || interest.includes('clean') || interest.includes('electric') || interest.includes('energy');

      const isAgri =
        queryLower.includes('agri') || queryLower.includes('farm') || queryLower.includes('crop') || queryLower.includes('drone') || queryLower.includes('soil') || queryLower.includes('hydroponic') ||
        interest.includes('agri') || interest.includes('farm') || interest.includes('crop') || interest.includes('drone');

      const isCommerce =
        queryLower.includes('commerce') || queryLower.includes('account') || queryLower.includes('tally') || queryLower.includes('gst') || queryLower.includes('bank') || queryLower.includes('finance') ||
        interest.includes('commerce') || interest.includes('account') || interest.includes('bank') || interest.includes('finance');

      // 1. TECHNOLOGY DOMAIN POOLS
      if (isTech) {
        const poolA = `### 💻 Recommended Courses for ${name}: Software & Applied AI (Track A)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your strong academic standing and quantitative foundation satisfy all prerequisites for college degree admissions (BCA/B.Sc Computer Science) and premier NSQF Level 5+ software certifications.

Here are **3 tailored, high-impact courses** for your profile:

1. 🤖 **NextLearning / Facilitator G. Sai Kavya: "AI Data Annotation, Prompting & Regional Language Voice Quality"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 4 hours
   - **Skills Learned**: Multilingual text tokenization, bounding box polygon labeling, and Telugu/Hindi speech transcription.
   - **Why It Fits**: Direct entry without entrance exam barriers; ideal for starting freelance digital earnings right away.

2. 🌐 **SWAYAM / IIT Madras: "Modern Full-Stack Web Development & Python Programming"**
   - **Provider**: Ministry of Education / SWAYAM (Free enrollment) | **Duration**: 8 weeks
   - **Skills Learned**: Semantic HTML5, modern JavaScript (ES6+), REST API integration, and Python server architecture.
   - **Why It Fits**: Your Class 10/12 scores give you the logical problem-solving aptitude needed to ace NPTEL proctored exams.

3. 📜 **DIKSHA / NIELIT: "Certificate in Object-Oriented Software & Algorithms (NSQF Level 5)"**
   - **Provider**: NIELIT / Skill India Digital Hub | **Duration**: 3 months
   - **Skills Learned**: Data structures in C++/Java, database SQL queries, and software version control (Git).
   - **Why It Fits**: Accredited government certification accepted by state IT corporations for junior developer internships.

*Would you like to enroll in the AI Data Annotation module or explore our full-stack web development roadmap?*`;

        const poolB = `### 🚀 Recommended Courses for ${name}: Hardware Engineering & Web Tech (Track B)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your marks place you in a strong position for competitive lateral entry into polytechnic diplomas and certified industry apprenticeships.

Here is a **fresh set of 3 specialized courses** matched to your technical profile:

1. 🛠️ **NextLearning / Facilitator G. Sai Kavya: "Mobile Phone Hardware Troubleshooting, SMD Soldering & Display Replacement"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 6 hours
   - **Skills Learned**: Multimeter diode short-circuit tracing, hot-air SMD chip rework (350°C), and touch glass OCA vacuum bonding.
   - **Why It Fits**: Hands-on hardware mastery that complements software knowledge, enabling immediate local earning capability.

2. 📱 **Skill India Digital Hub: "Frontend Web Developer (React.js & TypeScript) Masterclass"**
   - **Provider**: National Skill Development Corporation (NSDC) | **Duration**: 120 hours
   - **Skills Learned**: Component architecture, Tailwind CSS, TypeScript type safety, and building responsive single-page web applications.
   - **Why It Fits**: High employer demand across Bengaluru, Hyderabad, and remote Indian startups starting at ₹25,000–₹45,000/month.

3. ☁️ **Google / Coursera: "IT Automation with Python & Open-Source Cloud Tools"**
   - **Provider**: Google Career Certificates / SWAYAM | **Duration**: Self-paced (2 months)
   - **Skills Learned**: Writing automation scripts, Git/GitHub collaborative workflows, and basic Linux server administration.
   - **Why It Fits**: Enhances your resume with a globally recognized credential and practical GitHub portfolio projects.

*Which sounds more exciting: building web applications with React or exploring mobile chip-level hardware?*`;

        const poolC = `### 🌟 Recommended Courses for ${name}: Tech Workplace Readiness & Databases (Track C)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your marks demonstrate solid consistency, meeting the criteria for both higher education diplomas and skill-based corporate hiring.

Here are **3 alternative, career-accelerating courses** for you:

1. 🗣️ **NextLearning / Facilitator G. Sai Kavya: "Spoken English, Interview Confidence & Workplace Readiness"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 5 hours
   - **Skills Learned**: Overcoming hesitation in English, delivering a 90-second technical elevator pitch, and cracking tech interview questions.
   - **Why It Fits**: Equips you to communicate confidently with remote tech recruiters and IT hiring managers.

2. 📊 **DIKSHA / NCERT: "Foundations of Database Systems & Structured Query Language (SQL)"**
   - **Provider**: DIKSHA National Portal (Free) | **Duration**: 6 weeks
   - **Skills Learned**: Relational database schema design, joins, aggregates, and data normalization.
   - **Why It Fits**: Essential foundation for every backend, data science, and web development career.

3. 🤖 **freeCodeCamp & NASSCOM: "Certified Responsive Web Design & JavaScript Algorithms"**
   - **Provider**: freeCodeCamp / FutureSkills Prime | **Duration**: 300 hours (Self-paced)
   - **Skills Learned**: Building 5 verified portfolio projects verified by open-source tests.
   - **Why It Fits**: 100% free, project-based curriculum recognized by software recruiters worldwide.

*Tell me if you want to practice interview questions or start the SQL database module today!*`;

        return selectRandom([poolA, poolB, poolC]);
      }

      // 2. HEALTHCARE DOMAIN POOLS
      if (isHealth) {
        const healthPoolA = `### 🏥 Recommended Courses for ${name}: Healthcare & Clinical Care (Track A)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your science performance qualifies you for paramedical diplomas, government hospital rotations, and Allied Health Sector Skill Council certifications.

Here are **3 specialized healthcare courses** matched to your marks:

1. 🩺 **NextLearning / Facilitator G. Sai Kavya: "General Duty Healthcare Assistant (GDA) & Hospital Protocols"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 6 hours
   - **Skills Learned**: Vital signs monitoring (BP, SpO2, pulse, temperature), hospital infection control, and CPCB biomedical waste management.
   - **Why It Fits**: Direct entry into healthcare support roles across civil hospitals and private nursing homes.

2. 🔬 **State Medical Faculty / NHM: "Diploma in Medical Laboratory Technology (DMLT)"**
   - **Provider**: State Paramedical Council | **Duration**: 2 years
   - **Skills Learned**: Clinical hematology, urine analysis, microbiology culture testing, and operating automated biochemistry analyzers.
   - **Why It Fits**: Your Class 12 Science (Biology/Chemistry) scores meet the merit list cutoff for subsidized state government college seats.

3. 🚑 **SWAYAM: "Basic Life Support (BLS), CPR & Emergency First Response"**
   - **Provider**: All India Institute of Medical Sciences (AIIMS) / SWAYAM | **Duration**: 4 weeks
   - **Skills Learned**: Cardiopulmonary resuscitation (CPR), choking relief, automated external defibrillator (AED) operation, and emergency trauma triage.
   - **Why It Fits**: Essential accredited certification mandatory for hospital nursing staff and emergency clinic assistants.

*Would you like to explore the GDA course or check government paramedical admission dates?*`;

        const healthPoolB = `### 💉 Recommended Courses for ${name}: Clinical Technology & Eyecare (Track B)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your academic standing satisfies the prerequisites for technical allied health certifications and specialized clinical departments.

Here are **3 fresh course recommendations** in healthcare:

1. 🩸 **NextLearning / Facilitator G. Sai Kavya: "Dialysis Unit Clinical Assistant & Renal Patient Care"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 5.5 hours
   - **Skills Learned**: Hemodialyzer circuit mechanics, RO water plant quality checks, and safe AV fistula cannulation.
   - **Why It Fits**: High demand under the National Dialysis Programme with starting salaries of ₹18,000–₹32,000/month.

2. 👁️ **NextLearning / Facilitator G. Sai Kavya: "Optometry Clinical Assistant & Eyecare Vision Screening"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 4.5 hours
   - **Skills Learned**: Snellen chart acuity testing, auto-refractometer readings, lens fitting, and organizing village vision camps.
   - **Why It Fits**: Clean clinic environment with high employability at district optical centers and ophthalmic clinics.

3. 💊 **Skill India Digital Hub: "Emergency Medical Technician (EMT - Basic)"**
   - **Provider**: Healthcare Sector Skill Council (HSSC) | **Duration**: 6 months
   - **Skills Learned**: Pre-hospital trauma care, oxygen cylinder administration, and ambulance life-support operations.
   - **Why It Fits**: Guaranteed placement in state emergency ambulance fleets (108 Emergency Response Service).

*Which healthcare department interests you more: dialysis renal care or vision/optometry testing?*`;

        return selectRandom([healthPoolA, healthPoolB]);
      }

      // 3. SOLAR & CLEAN ENERGY POOLS
      if (isSolar) {
        const solarPoolA = `### ☀️ Recommended Courses for ${name}: Solar Energy & Electrical Systems (Track A)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your technical scores and practical interest meet all prerequisites for subsidized government green livelihood programs.

Here are **3 verified courses** for your profile:

1. ⚡ **NextLearning / Facilitator G. Sai Kavya: "Clean Energy & PM Surya Ghar Rooftop Skilling Guide"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 5 hours
   - **Skills Learned**: Solar PV array orientation, shadow-free roof calculations, and PM Surya Ghar 1 crore households subsidy workflow.
   - **Why It Fits**: Directly prepares you for the massive rooftop solar boom across Indian towns and villages.

2. 🏛️ **MNRE / National Institute of Solar Energy (NISE): "Surya Mitra Skill Development Program"**
   - **Provider**: MNRE (Govt. of India) | **Duration**: 3 months (Free residential training)
   - **Skills Learned**: Inverter cabling, DC circuit breaker wiring, earthing pit resistance testing, and net-metering synchronization.
   - **Why It Fits**: 100% government-funded with free boarding, lodging, and direct placement with solar EPC contractors.

3. 💧 **NextLearning / Facilitator G. Sai Kavya: "Smart Drip Irrigation, IoT Soil Sensors & PM-KUSUM Solar Pumps"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 4.5 hours
   - **Skills Learned**: Sizing 3HP–7.5HP solar submersible pumps, Venturi fertigation injectors, and state subsidy application paperwork.
   - **Why It Fits**: Ideal for agricultural solar pump installations funded up to 60% under PM-KUSUM Component-B.

*Would you like me to walk you through the free Surya Mitra application at nise.res.in or explore PM Surya Ghar rooftop installation?*`;

        const solarPoolB = `### 🛵 Recommended Courses for ${name}: Clean Tech, Grid Operations & EV (Track B)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your science and technical marks qualify you for dual-trade certifications in green electrical systems and electric mobility.

Here is an **alternative set of 3 specialized green courses**:

1. 🔋 **NextLearning / Facilitator G. Sai Kavya: "Electric Vehicle (EV) 2-Wheeler Servicing & Battery Diagnostics"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 5 hours
   - **Skills Learned**: BLDC hub motor Hall sensor timing, 48V–72V Lithium-ion battery BMS testing, and ASDC Level 4 exam prep.
   - **Why It Fits**: High dealership hiring by Ola Electric, Ather Energy, and local electric scooter service workshops.

2. 🔌 **NextLearning / Facilitator G. Sai Kavya: "Solar PV Rooftop Operations, Maintenance & Grid Synchronisation"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 5 hours
   - **Skills Learned**: DC string combiner boxes, anti-islanding grid tripping safety, DISCOM bidirectional meters, and annual O&M contracts.
   - **Why It Fits**: Prepares you to launch your own solar maintenance enterprise serving residential and commercial arrays.

3. 🛠️ **Govt. ITI / NCVT: "Craftsmen Training Scheme (CTS) Electrician Trade"**
   - **Provider**: Directorate General of Training (DGT) | **Duration**: 2 years
   - **Skills Learned**: Industrial power wiring, motor transformers, single/three-phase distribution, and statutory electrical safety (IS 3043).
   - **Why It Fits**: The gold-standard government electrical trade license recognized by state electricity boards (DISCOMs) and railways.

*Tell me if you want to explore the EV battery diagnostics module or rooftop grid synchronization!*`;

        return selectRandom([solarPoolA, solarPoolB]);
      }

      // 4. AGRICULTURE DOMAIN POOLS
      if (isAgri) {
        const agriPoolA = `### 🌾 Recommended Courses for ${name}: Modern Agritech & Precision Farming (Track A)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your agricultural interest and school scores meet all eligibility rules for subsidized drone licenses and polyhouse capital subsidies.

Here are **3 courses** tailored to modern high-value farming:

1. 🚁 **NextLearning / Facilitator G. Sai Kavya: "Agri-Tech & Precision Drone Spraying Fundamentals"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 4 hours
   - **Skills Learned**: Agricultural quadcopter hardware, flight safety in yellow/green zones, and liquid pesticide spraying calibration.
   - **Why It Fits**: Prepares you for certified drone pilot training with high daily service hiring rates (₹400–₹600/acre).

2. 🥗 **NextLearning / Facilitator G. Sai Kavya: "Commercial Hydroponics & Automated Polyhouse Cultivation"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 5 hours
   - **Skills Learned**: Nutrient Film Technique (NFT), Dutch buckets, nutrient N-P-K formulation, and digital EC/pH meter stabilization.
   - **Why It Fits**: High profit margins selling exotic salad greens and bell peppers directly to urban supermarkets.

3. 📜 **DGCA / RPTO: "Remote Pilot Certificate (RPC) for Multi-Rotor Drones"**
   - **Provider**: DGCA Approved Remote Pilot Training Organizations | **Duration**: 5 days (15 hours)
   - **Skills Learned**: Mandatory dual-control flight hours, simulator drills, emergency fail-safe landing, and commercial drone license.
   - **Why It Fits**: Official pilot license required under Indian law for operating commercial agricultural spraying drones.

*Would you like to explore the Hydroponics farming module or prepare for the DGCA Drone Pilot exam?*`;

        const agriPoolB = `### 🌸 Recommended Courses for ${name}: Horticulture & Agri-Entrepreneurship (Track B)
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your academic background gives you direct access to horticulture board programs and credit-linked farm machinery subsidies.

Here are **3 alternative agriculture courses**:

1. 💐 **NextLearning / Facilitator G. Sai Kavya: "Commercial Floriculture, Greenhouse Cultivation & Cold Chain Logistics"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 4 hours
   - **Skills Learned**: Protected marigold and Dutch rose cultivation, pulsing preservative solutions (STS/sucrose), and mandi auctions.
   - **Why It Fits**: High seasonal revenue during wedding and festival months with up to 50% capital subsidy from National Horticulture Board (NHB).

2. 📦 **NextLearning / Facilitator G. Sai Kavya: "Food Processing, Post-Harvest Packaging & FSSAI Compliance"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 4.5 hours
   - **Skills Learned**: FSSAI sanitary registration, vacuum sealing for pulses/millet snacks, and Jan Samarth PMFME 35% subsidy loan DPRs.
   - **Why It Fits**: Value addition to raw farm harvests, transforming grain and fruits into branded packaged retail products.

3. 💧 **ICAR / Krishi Vigyan Kendra (KVK): "Soil Health Card Testing & Micro-Nutrient Management"**
   - **Provider**: ICAR / District KVK (Free) | **Duration**: 2 weeks
   - **Skills Learned**: Soil core sampling, testing pH, nitrogen, phosphorus, and potassium levels using mini-lab kits.
   - **Why It Fits**: Qualifies you to set up a village soil testing mini-lab with government incentive grants.

*Which avenue sounds more exciting: starting a protected floriculture greenhouse or launching an FSSAI-certified food processing brand?*`;

        return selectRandom([agriPoolA, agriPoolB]);
      }

      // 5. COMMERCE & ACCOUNTING POOLS
      if (isCommerce) {
        return `### 📊 Recommended Courses for ${name}: Accounting, GST & Banking
**Academic Qualification Context**:
* Class 10th Standing: **${c10}**
* Class 12th Standing: **${c12}**
* *Eligibility Note*: Your academic standing satisfies the admission requirements for undergraduate commerce programs (B.Com) and certified accounting software diplomas.

Here are **3 tailored courses** for your profile:

1. 📑 **NextLearning / Facilitator G. Sai Kavya: "Tally Prime, GST Filing & MSME Digital Bookkeeping"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 6.5 hours
   - **Skills Learned**: Double-entry ledger vouchers, HSN mapping, automated E-Way bills, and preparing GSTR-1/3B drafts.
   - **Why It Fits**: Immediate job opportunities at local business firms, retail traders, and CA offices starting at ₹15,000–₹28,000/month.

2. 🏦 **NextLearning / Facilitator G. Sai Kavya: "Microfinance Operations, Village SHG Banking & BC Sakhi Training"**
   - **Provider**: NextLearning Guidance Center (Free) | **Duration**: 4.5 hours
   - **Skills Learned**: Micro-ATM AePS biometric fingerprint cash terminals, JLG loan appraisals, and IIBF certification exam prep.
   - **Why It Fits**: Employs rural youth and women as banking correspondents with steady commissions from public sector banks.

3. 🎓 **SWAYAM / UGC: "Financial Accounting, Costing & Taxation"**
   - **Provider**: Ministry of Education / SWAYAM (Free) | **Duration**: 12 weeks
   - **Skills Learned**: Corporate balance sheets, inventory valuation, depreciation calculations, and direct tax compliance.
   - **Why It Fits**: Carries transferable university academic credits (ABC) towards your bachelor's degree.

*Would you like to start the Tally Prime GST module or explore the Banking Correspondent certification?*`;
      }

      // 6. DEFAULT GENERAL POOL
      return `### 🎯 Recommended Courses for ${name}
**Academic Standing**:
* Class 10th: **${c10}**
* Class 12th: **${c12}**
* Field of Interest: **${context.interest}**

Based on your academic performance, here are **3 high-value, accredited courses** perfectly matched to your background:

1. 🎓 **NextLearning / Facilitator G. Sai Kavya: "Digital Village Panchayat Operations & Citizen E-Services (CSC VLE)"**
   - **Duration**: 4.5 hours | **Provider**: NextLearning Guidance Center
   - **Skills**: Setting up a village Digital Seva Kendra, issuing government certificates, Ayushman Bharat, and PM Kisan e-KYC.
   - **Why It Fits**: High community impact and steady service fee income right in your home village.

2. 💼 **NextLearning / Facilitator G. Sai Kavya: "Spoken English, Interview Confidence & Workplace Readiness"**
   - **Duration**: 5 hours | **Provider**: NextLearning Guidance Center
   - **Skills**: Confident self-introduction, overcoming public speaking fear, and professional email and interview etiquette.
   - **Why It Fits**: Crucial foundation for cracking job interviews and corporate apprenticeships regardless of stream.

3. 🛠️ **Skill India Digital Hub / PMKVY 4.0: "Industry Certified Skill Specialization"**
   - **Duration**: 3–6 months | **Provider**: National Skill Development Corporation (NSDC)
   - **Skills**: Practical NSQF certified hands-on competencies with government job portal placement (NCS).
   - **Why It Fits**: 100% free with government assessment certification recognized across India.

*Tell me which sector you'd like to dive into today: Computers & Tech, Healthcare, Green Energy, or Business!*`;
    },
  },

  // 4. Class 10 / After 10th Advice (Natural Variations)
  {
    id: 'after-10th',
    match: (text) =>
      text.includes('class 10') ||
      text.includes('10th') ||
      text.includes('after 10') ||
      text.includes('passed 10') ||
      text.includes('after matric') ||
      text.includes('10 ke baad'),
    reply: () => {
      const openings = [
        `Here are the most practical, high-value pathways after **Class 10** in India:`,
        `Passing Class 10 is an exciting turning point with diverse technical, academic, and vocational avenues:`,
        `After Class 10, your journey can take several proven directions depending on whether you want a quick job or a college degree:`
      ];
      const opening = selectRandom(openings);
      return `${opening}

1. **Higher Secondary (Class 11 & 12)**:
   - **Science (PCM/PCB)**: Leads to engineering (JEE), medical/paramedical (NEET), defense (NDA), or BSc.
   - **Commerce**: Ideal for banking, accounting (Tally/GST), CA Foundation, and business management.
   - **Arts / Humanities**: Excellent for Civil Services (UPSC/State PSC), teaching, law, journalism, and design.

2. **Polytechnic Diploma (3 Years)**:
   - Practical engineering diploma in Electrical, Mechanical, Civil, or Computer Science.
   - **Key Advantage**: Allows direct **lateral entry into 2nd year of B.Tech/B.E.**!

3. **ITI Trades (1 to 2 Years)**:
   - Quick, job-ready technical certifications like Electrician, Wireman, Fitter, Welder, or Mechanic.
   - High recruitment in State Electricity Boards, Indian Railways, and manufacturing plants.

4. **Skill India & PMKVY Short Courses**:
   - Free government-sponsored courses in Solar Installation (Surya Mitra), Mobile Repair, or Healthcare Assistance.

*Which of these sounds most exciting to you? Tell me what subjects you enjoy!*`;
    },
  },

  // 4. Class 12 / After 12th Advice (Natural Variations)
  {
    id: 'after-12th',
    match: (text) =>
      text.includes('class 12') ||
      text.includes('12th') ||
      text.includes('after 12') ||
      text.includes('passed 12') ||
      text.includes('12 ke baad') ||
      text.includes('higher secondary'),
    reply: () => {
      const openings = [
        `You have several options after Class 12, including higher education, vocational training, competitive examinations, and entry-level work. The best path depends on your interests, qualifications, and long-term goals.`,
        `Finishing Class 12 opens several pathways. You could pursue a degree, learn a practical skill, prepare for an eligible entrance examination, or explore employment opportunities. Let's narrow these options down based on what interests you.`,
        `After Class 12, you don't have to follow just one route. Further studies, job-oriented training, competitive exams, and work opportunities may all be worth exploring, depending on your circumstances.`
      ];
      const opening = selectRandom(openings);
      return `${opening}

1. **For Science Students (PCM/PCB)**:
   - **Engineering & Tech**: B.Tech / BCA / BSc Computer Science, AI, Web Development.
   - **Healthcare**: MBBS, BDS, BSc Nursing, B.Pharm, General Duty Assistant, or Paramedical diplomas.
   - **Armed Forces**: NDA exam, Indian Air Force Airmen, Indian Navy Sailor entrance.

2. **For Commerce Students**:
   - **Degree Paths**: B.Com, BBA, BMS, Integrated Law (BBA LLB).
   - **Professional Tracks**: CA (Chartered Accountancy), CMA, CS, or GST & Tally Certification.
   - **Fintech & Banking**: Direct entry into Bank Correspondent (BC) network and NBFC sales.

3. **For Arts / Humanities Students**:
   - **Degree Paths**: BA in English/History/Economics, BSW (Social Work), BFA (Fine Arts).
   - **Competitive Exams**: SSC CGL, State Police Sub-Inspector, Bank Clerical exams.
   - **Media & Design**: Graphic design, digital content creation, journalism, and vernacular translation.

Tell me your Class 12 stream and state, and I will recommend specific top colleges, entrance exams, and career tracks!`;
    },
  },

  // 5. ITI vs Polytechnic vs Degree
  {
    id: 'iti-vs-polytechnic',
    match: (text) =>
      text.includes('iti vs') ||
      text.includes('polytechnic vs') ||
      text.includes('diploma vs') ||
      text.includes('difference between iti'),
    reply: () =>
      `Here is a quick comparison between **ITI, Polytechnic Diploma, and Degree (B.Tech)**:

| Feature | ITI (Industrial Training) | Polytechnic Diploma | Engineering Degree (B.Tech) |
|---|---|---|---|
| **Eligibility** | Class 8 / Class 10 pass | Class 10 pass | Class 12 (PCM) |
| **Duration** | 1 to 2 years | 3 years | 4 years |
| **Focus** | Hands-on craft & trade skills | Applied technical theory & lab work | Comprehensive engineering & research |
| **Typical Starting Salary** | ₹12,000 - ₹22,000/mo | ₹18,000 - ₹32,000/mo | ₹25,000 - ₹60,000+/mo |
| **Top Employers** | Railways, BHEL, local workshops | Larsen & Toubro, Tata Motors, PWD | IT firms, MNCs, PSUs |
| **Further Path** | Lateral entry to 2nd yr Diploma | Direct lateral entry to 2nd yr B.Tech | M.Tech / MBA / UPSC |

*If you need quick employment, ITI is fastest. If you want engineering at lower cost, Polytechnic is the best stepping stone!*`,
  },

  // 6. Solar PV Rooftop & Green Energy (Natural Variations)
  {
    id: 'solar-energy',
    match: (text) =>
      text.includes('solar') ||
      text.includes('surya') ||
      text.includes('green energy') ||
      text.includes('renewable') ||
      text.includes('solar panel') ||
      text.includes('solar technician'),
    reply: () => {
      const angles = [
        `Becoming a **Solar PV Rooftop Technician** is one of the highest-demand green jobs in India right now! ☀️

**Why This Sector is Booming:**
- The Central Government's **PM Surya Ghar: Muft Bijli Yojana** is installing rooftop solar systems on 1 Crore households, generating over **3,00,000 technician and contractor livelihoods**.
- Starting salaries range from **₹18,000 to ₹35,000/month**, with tremendous potential to become an independent solar installation entrepreneur.

**Step-by-Step Path to Certification:**
1. **Eligibility**: Class 10 or Class 12 pass (science/math background is helpful).
2. **Free Government Training**: Enroll in the **Surya Mitra Skill Development Program** (3-month free residential program funded by the Ministry of New and Renewable Energy).
3. **Core Practical Skills**: DC circuit wiring, inverter connection, solar panel roof mounting, earthing, and net-meter testing.
4. **Official Registration**: Register at [nise.res.in](https://nise.res.in) or visit your nearest Skill India partner center.

Would you like me to open the step-by-step Solar Learning Roadmap for you?`,

        `Rooftop solar technology offers an exceptional combination of clean energy and rapid livelihood generation across India. ☀️⚡

**Key Livelihood Drivers:**
- Under the national **PM Surya Ghar Yojana (1 Crore Rooftops)**, trained installers and technicians are urgently required in every district and town.
- Average starting earnings stand between **₹18,000 to ₹35,000/month**, with rapid progression into EPC contracting.

**Core Qualifications & Training:**
- **Entry Requirement**: Class 10 or 12 pass.
- **Surya Mitra Program**: Complete the 3-month free residential training provided by the Ministry of New & Renewable Energy (MNRE).
- **Core Competencies**: Photovoltaic array mounting, DC cabling, inverter load testing, grid sync, and safety earthing.
- **Where to Enroll**: Apply through [nise.res.in](https://nise.res.in) or your state renewable energy development agency.`,

        `If you are interested in a hands-on, high-growth electrical trade, the **Solar PV Rooftop Technician** track is a premier choice! ☀️🔧

**Industry Highlights:**
- Massive central momentum under **PM Surya Ghar: Muft Bijli Yojana** has created over 3,00,000 technician vacancies nationwide.
- Starting pay: **₹18,000 to ₹35,000/month**, with high potential for opening your own local installation venture.

**Path to Join:**
1. **Prerequisite**: Class 10 or 12 pass.
2. **Surya Mitra Certification**: 100% free 3-month residential program with hostel and meals included (MNRE funded).
3. **Technical Mastery**: Hands-on training on digital multimeters, aluminum roof rails, DC fuses, inverters, and net-metering.
4. **Portal**: Register directly on [nise.res.in](https://nise.res.in) or nearest NSDC skill center.`
      ];
      return selectRandom(angles);
    },
  },

  // 7. Software Development & Coding
  {
    id: 'software-coding',
    match: (text) =>
      text.includes('code') ||
      text.includes('coding') ||
      text.includes('software') ||
      text.includes('web dev') ||
      text.includes('developer') ||
      text.includes('python') ||
      text.includes('javascript') ||
      text.includes('frontend') ||
      text.includes('full stack'),
    reply: () =>
      `A career in **Software & Web Development** offers some of the highest flexibility and earning potential! 💻

**Fast-Track Path for Beginners:**
1. **Step 1 - Web Foundations**: Master **HTML5, CSS3, and JavaScript basics**. Build simple responsive web pages.
2. **Step 2 - Modern UI Framework**: Learn **React** or **Tailwind CSS**. Build 3 portfolio projects (like a weather app, task manager, or student portal).
3. **Step 3 - Git & Version Control**: Create a free **GitHub** account to save and showcase your code.
4. **Step 4 - Free Verified Courses**: Learn through **freeCodeCamp**, **DIKSHA Computer Science**, or **SWAYAM**.
5. **Entry-level Salary**: ₹25,000 - ₹50,000/month for Junior Developers, rising quickly with 2 years of project experience.

You don't need an expensive computer—even a shared laptop or cyber-cafe computer with a web browser is enough to start practicing today!`,
  },

  // 8. Artificial Intelligence & Data Science
  {
    id: 'ai-data',
    match: (text) =>
      text.includes('artificial intelligence') ||
      text.includes(' ai ') ||
      text.endsWith(' ai') ||
      text.startsWith('ai ') ||
      text.includes('machine learning') ||
      text.includes('data science') ||
      text.includes('prompt engineering') ||
      text.includes('data analyst'),
    reply: () =>
      `**Artificial Intelligence (AI) and Data Analytics** are creating exciting new roles across every industry in India! 🤖

**High-Growth Entry Points:**
1. **AI Prompt Specialist & Data Labeler**: Creating and evaluating prompts for generative AI models, annotating local language text and images.
2. **Junior Data Analyst**: Collecting, cleaning, and visualizing data using Microsoft Excel, SQL, and Power BI or Python.
3. **Key Tools to Learn**:
   - Python programming fundamentals
   - SQL for database querying
   - Excel & Google Sheets data formulas
   - Generative AI prompt techniques
4. **Starting Salaries**: ₹25,000 to ₹55,000/month.
5. **Free Learning Portals**: Check **SWAYAM AICTE AI for All** and **Google for Education Data Analytics**.

Would you like advice on beginner Python courses or data analytics roadmap steps?`,
  },

  // 9. Electric Vehicles (EV)
  {
    id: 'ev-automotive',
    match: (text) =>
      text.includes(' ev ') ||
      text.includes('electric vehicle') ||
      text.includes('ev technician') ||
      text.includes('battery') ||
      text.includes('electric bike') ||
      text.includes('charging station'),
    reply: () =>
      `**Electric Vehicle (EV) Technology** is one of India's fastest-expanding green transport sectors! ⚡🛵

**Top Job Roles:**
- **EV Service Technician**: Inspecting electric 2-wheelers and 3-wheelers, testing lithium-ion battery packs, motor controllers, and regenerative braking.
- **EV Charging Station Maintenance Operator**: Installing and troubleshooting DC fast chargers and grid connections.

**How to Qualify:**
1. **Prerequisite**: Class 10 pass + ITI (Electrician / Motor Mechanic) or Diploma in Electrical/Automobile Engineering.
2. **Specialized Course**: Complete the **Automotive Skills Development Council (ASDC) EV Technician Certificate**.
3. **Salary Outlook**: ₹18,000 - ₹38,000/month with high demand at Ola Electric, Ather Energy, Tata Motors, and local dealership workshops.`,
  },

  // 10. Healthcare & General Duty Assistant (GDA)
  {
    id: 'healthcare-gda',
    match: (text) =>
      text.includes('health') ||
      text.includes('hospital') ||
      text.includes('nurse') ||
      text.includes('nursing') ||
      text.includes('gda') ||
      text.includes('medical') ||
      text.includes('paramedical') ||
      text.includes('patient care') ||
      text.includes('pharmacy'),
    reply: () =>
      `The **Healthcare & Allied Health** sector provides noble, recession-proof, and deeply respected careers: 🏥

**Top Entry Paths:**
1. **General Duty Assistant (GDA)**:
   - NSQF Level 4 certificate accredited by Healthcare Sector Skill Council (HSSC).
   - Assists doctors and nurses with patient vitals, hygiene, mobility, and first aid.
   - Course duration: 3 to 6 months with civil hospital clinical rotation.
2. **ANM / GNM (Auxiliary Nurse Midwife / General Nursing)**:
   - 2-year or 3-year diploma open to Class 12 graduates.
   - High government employment opportunities in Primary Health Centres (PHCs) and district hospitals.
3. **Medical Laboratory Technician (DMLT)**:
   - 2-year diploma in blood testing, urine analysis, and pathology diagnostics.
4. **Salary Range**: ₹15,000 - ₹35,000/month with reliable job security and medical benefits.`,
  },

  // 11. Agriculture & Agritech
  {
    id: 'agriculture',
    match: (text) =>
      text.includes('agri') ||
      text.includes('farm') ||
      text.includes('farming') ||
      text.includes('crop') ||
      text.includes('kisan') ||
      text.includes('dairy') ||
      text.includes('horticulture') ||
      text.includes('organic'),
    reply: () =>
      `**Modern Agritech & Sustainable Agriculture** is transforming rural livelihoods across India! 🌾🚜

**High-Income Career Opportunities:**
1. **Agritech Drone Pilot**: Operating GPS-guided spraying drones for fertilizers and nano-urea (DGCA Remote Pilot Certificate).
2. **Soil Health Analyst**: Operating mini-lab testing kits to analyze NPK, pH, and soil organic carbon under the Soil Health Card Scheme.
3. **Organic Farming & Vermicompost Entrepreneur**: Producing bio-fertilizers and organic produce for urban farmers' markets.
4. **Dairy & Livestock Technologist**: Cold-chain milk quality testing and cooperative management.
5. **Support Schemes**: Subsidies available under **Kisan Drone Scheme** and **Sub-Mission on Agricultural Mechanization (SMAM)**.

Starting income ranges from ₹18,000 to ₹45,000/month, with immense self-employment earnings during harvest seasons!`,
  },

  // 12. Skilled Trades (Electrician, Plumber, Welder)
  {
    id: 'trades',
    match: (text) =>
      text.includes('electrician') ||
      text.includes('plumber') ||
      text.includes('welder') ||
      text.includes('fitter') ||
      text.includes('carpenter') ||
      text.includes('wiring') ||
      text.includes('pipe') ||
      text.includes('trade'),
    reply: () =>
      `**Skilled Trades** form the backbone of Indian industry and rural infrastructure: 🔧⚙️

1. **Electrician & Wireman**:
   - 2-year ITI trade or 3-month PMKVY certificate.
   - Authorized to install domestic wiring, MCB distribution boards, and industrial motor panels.
   - High hiring in state DISCOMs (Electricity Boards) and private construction.
2. **Pipe Fitter & Plumber**:
   - High demand under the **Jal Jeevan Mission** providing tap water to every village home.
   - Starting daily rates: ₹600 - ₹1,200/day or ₹20,000 - ₹35,000/month.
3. **Welder & Fabricator**:
   - High opportunities in Indian Railways, shipyards, bridge construction, and agricultural equipment workshops.

All these trades allow you to work as an employee or establish your own lucrative independent contracting business!`,
  },

  // 13. Police, Defense & Armed Forces
  {
    id: 'police-defense',
    match: (text) =>
      text.includes('police') ||
      text.includes('army') ||
      text.includes('defense') ||
      text.includes('defence') ||
      text.includes('agniveer') ||
      text.includes('navy') ||
      text.includes('air force') ||
      text.includes('constable') ||
      text.includes('crpf') ||
      text.includes('bsf'),
    reply: () =>
      `Serving the nation in the **Armed Forces or Police** brings immense pride, discipline, and government benefits: 🇮🇳🎖️

1. **Agnipath Scheme (Army / Navy / Air Force)**:
   - **Eligibility**: Class 10 or Class 12 pass, aged 17.5 to 21 years.
   - **Selection**: Physical Fitness Test (1.6 km run), Medical Examination, and Common Entrance Exam (CEE).
   - **Package**: Monthly stipend starting at ₹30,000/month + ₹11.71 Lakh Seva Nidhi tax-free exit package.
2. **State Police Constable**:
   - **Eligibility**: Class 12 pass. Physical measurements and written exam on reasoning, GK, and state history.
3. **Paramilitary Forces (SSC GD Constable)**:
   - Selection conducted annually by SSC for BSF, CISF, CRPF, ITBP, and SSB.

*Start daily physical fitness training (running, pushups) early alongside regular General Knowledge and Math practice!*`,
  },

  // 14. Government Exams (UPSC, SSC, Railway)
  {
    id: 'govt-exams',
    match: (text) =>
      text.includes('sarkari') ||
      text.includes('govt job') ||
      text.includes('government job') ||
      text.includes('upsc') ||
      text.includes('ssc') ||
      text.includes('railway') ||
      text.includes('rrb') ||
      text.includes('civil services'),
    reply: () =>
      `Here is a roadmap for cracking **Government & Sarkari Jobs**: 🏛️📚

1. **Class 10 Pass Exams**:
   - **SSC MTS (Multi-Tasking Staff)**: Office attendants and peons in Central ministries.
   - **Railway Group D (RRB Level 1)**: Track maintainers, pointsmen, and workshop assistants.
   - **India Post GDS (Gramin Dak Sevak)**: Branch postmaster positions in rural post offices.

2. **Class 12 Pass Exams**:
   - **SSC CHSL (10+2)**: Lower Division Clerks (LDC), Data Entry Operators (DEO).
   - **Railway NTPC (Undergraduate)**: Junior Clerk, Trains Clerk.
   - **State Police & Forest Guard** recruitment.

3. **Core Preparation Strategy**:
   - Dedicate 2 hours daily to Quantitative Aptitude, Logical Reasoning, General English, and Current Affairs.
   - Practice free mock tests available on the DIKSHA and National Career Service portals.`,
  },

  // 15. Banking & Accounting (Tally / GST)
  {
    id: 'banking-accounting',
    match: (text) =>
      text.includes('bank') ||
      text.includes('accounting') ||
      text.includes('tally') ||
      text.includes('gst') ||
      text.includes('ca ') ||
      text.includes('finance') ||
      text.includes('commerce') ||
      text.includes('bank correspondent'),
    reply: () =>
      `A career in **Banking, Finance & Practical Accounting** is reliable and respected: 💳📊

1. **Tally Prime & GST Accountant**:
   - Learn double-entry bookkeeping, inventory management, invoice generation, and monthly GST filing.
   - Course: 2-3 months at local vocational computer training institutes.
   - Every shopkeeper, trader, factory, and distributor requires an accountant!
2. **Business Correspondent (Bank Mitra / BC Sakhi)**:
   - Provide doorstep micro-banking, Aadhaar-enabled payments (AePS), and savings accounts in rural panchayats.
   - Partner with SBI, PNB, Bank of Baroda, or CSC Grameen e-Store.
3. **Public Sector Bank Clerks & PO**:
   - IBPS and SBI conduct annual exams for graduates in any discipline.

Starting salary: ₹15,000 - ₹35,000/month, with commission earnings for Bank Mitras!`,
  },

  // 16. Creative Design & Media
  {
    id: 'creative-design',
    match: (text) =>
      text.includes('graphic') ||
      text.includes('design') ||
      text.includes('canva') ||
      text.includes('video edit') ||
      text.includes('youtube') ||
      text.includes('animation') ||
      text.includes('photo') ||
      text.includes('content creator'),
    reply: () =>
      `The creator and digital design economy is booming across regional Indian languages! 🎨🎥

**In-Demand Creative Skills:**
1. **Canva & Photoshop Graphic Design**: Designing social media banners, event posters, flex printing boards, and promotional pamphlets for local businesses.
2. **Video Editing (CapCut / Premiere Pro / VN)**: Editing Reels, YouTube videos, and educational shorts for local creators, NGOs, and brands.
3. **Vernacular Content Writing**: Writing blogs and social media captions in Hindi, Telugu, Tamil, Marathi, or your mother tongue.
4. **How to Start**:
   - You can start today on a smartphone using free apps like Canva and VN Video Editor!
   - Build a portfolio of 5 sample designs or edited clips.
   - Offer services to local businesses, coaching centers, and wedding photographers.`,
  },

  // 17. Teaching & Education
  {
    id: 'teaching',
    match: (text) =>
      text.includes('teach') ||
      text.includes('teacher') ||
      text.includes('bed') ||
      text.includes('b.ed') ||
      text.includes('ctet') ||
      text.includes('deled') ||
      text.includes('d.el.ed'),
    reply: () =>
      `Teaching is one of society's most noble and impactful professions: 👩‍🏫📖

**Pathways to Become a Qualified Teacher:**
1. **Primary School Teacher (Classes 1 to 5)**:
   - Complete Class 12 + **D.El.Ed (Diploma in Elementary Education)** (2 years).
   - Clear **CTET Paper 1** or your State TET.
2. **Trained Graduate Teacher - TGT (Classes 6 to 10)**:
   - Complete Graduation (BA / BSc / BCom) + **B.Ed (Bachelor of Education)** (2 years).
   - Clear **CTET Paper 2** or State TET.
3. **Post Graduate Teacher - PGT (Classes 11 & 12)**:
   - Complete Master's Degree (MA / MSc / MCom) + **B.Ed**.
4. **Digital & Coaching Tutoring**:
   - Teach spoken English, school math, or vocational skills online or through local study centers.`,
  },

  // 18. Scholarships & Free Education Schemes
  {
    id: 'scholarships',
    match: (text) =>
      text.includes('scholarship') ||
      text.includes('free education') ||
      text.includes('fees') ||
      text.includes('concession') ||
      text.includes('financial help') ||
      text.includes('subsidy') ||
      text.includes('scheme'),
    reply: () =>
      `Here are essential **Government Scholarships & Financial Support Schemes** you can apply for: 🎓💰

1. **National Scholarship Portal (NSP) [scholarships.gov.in]**:
   - **Pre-Matric & Post-Matric Scholarships** for SC, ST, OBC, Minority, and EWS students.
   - Covers complete tuition fees, textbook allowance, and monthly maintenance stipend.
2. **Pragati & Saksham Scholarships (AICTE)**:
   - ₹50,000/year for girl students and specially-abled students pursuing technical diploma or degrees.
3. **PM-YASASVI Scheme**:
   - Top-class school and college education scholarships for OBC/EBC/DNT students.
4. **SWAYAM & DIKSHA**:
   - 100% free digital learning courses accredited by the Ministry of Education.

*Make sure your Aadhaar is linked to your bank account with active NPCI mapping to receive direct benefits (DBT)!*`,
  },

  // 19. Resume, Interviews & Getting a Job
  {
    id: 'job-search',
    match: (text) =>
      text.includes('resume') ||
      text.includes('cv') ||
      text.includes('interview') ||
      text.includes('job') ||
      text.includes('placement') ||
      text.includes('hire') ||
      text.includes('internship'),
    reply: () =>
      `Here is how to get hired for your first professional job or internship: 📄🤝

1. **Build a 1-Page Clean Resume**:
   - Include: Full Name, Phone, Email, Location (City/District).
   - Summary: 2 lines highlighting your enthusiasm and key strength.
   - Education & Key Skills (Technical + Communication).
   - Projects / Practical Training: Mention any course, lab work, or volunteer role.
2. **Trusted Portals for Entry-Level Jobs**:
   - **National Career Service (NCS) [ncs.gov.in]**: Official Ministry of Labour portal with 1,00,000+ active jobs.
   - **Skill India Digital [skillindiadigital.gov.in]**: Directly connects certified students with verified employers.
   - **Internshala**: Excellent for junior remote and local internships.
3. **Interview Golden Rule**:
   - Dress neatly, arrive 10 minutes early, speak politely in the language you are comfortable with, and ask questions about the work.`,
  },

  // 20. DIKSHA & Study Materials
  {
    id: 'diksha',
    match: (text) =>
      text.includes('diksha') ||
      text.includes('ncert') ||
      text.includes('textbook') ||
      text.includes('study material') ||
      text.includes('syllabus'),
    reply: () =>
      `**DIKSHA (Digital Infrastructure for Knowledge Sharing)** is India's national digital school curriculum portal: 📚💻

- **Access 5,00,000+ interactive educational pieces** created by NCERT and State Educational Boards across 30+ Indian languages.
- Features video lessons, chapter QR-code textbooks, interactive worksheets, and self-assessment quizzes for Classes 1 to 12.
- In NextLearning, we have integrated top DIKSHA modules across **Science, Mathematics, Electrical Safety, Agriculture, and Business Studies**.
- Visit [diksha.gov.in](https://diksha.gov.in) or explore our **Learning Resources** tab in the sidebar!`,
  },

  // 21. Thank You / Closing
  {
    id: 'thank-you',
    match: (text) =>
      text.includes('thank') ||
      text.includes('dhanyavad') ||
      text.includes('shukriya') ||
      text.includes('bye') ||
      text.includes('goodbye') ||
      text.includes('see you'),
    reply: (studentName) =>
      `You are very welcome${studentName ? `, ${studentName}` : ''}! 😊

Remember: every great career begins with a single curious step. Whatever path you choose—whether high technology, green energy, skilled craftsmanship, or community service—dedication and continuous learning will take you far.

I am always right here whenever you need guidance. Best wishes on your learning journey! 🌟`,
  },
];

/**
 * Clean and extract key query text from incoming prompt
 */
export function extractUserQuery(rawPrompt: string): string {
  if (!rawPrompt) return '';
  let query = rawPrompt.trim();

  // If prompt contains conversation turns, extract the last user query
  const studentIndex = query.lastIndexOf('Student:');
  if (studentIndex !== -1) {
    const afterStudent = query.slice(studentIndex + 8);
    const nextAiIndex = afterStudent.indexOf('NextLearning AI:');
    query = nextAiIndex !== -1 ? afterStudent.slice(0, nextAiIndex).trim() : afterStudent.trim();
  }

  // Remove common punctuation and trim
  return query;
}

/**
 * Diagnostic analysis function that evaluates student marks, performance,
 * subjects, and interests to return an empathetic, human-grade counseling recommendation.
 */
function diagnoseStudentInput(
  cleanText: string,
  rawQuery: string,
  studentName?: string
): string | null {
  // If it's a pure greeting, let the greeting intent handle it
  const pureGreetings = [
    'hi', 'hii', 'hiii', 'hello', 'helo', 'hey', 'namaste', 'namaskar',
    'pranam', 'good morning', 'good afternoon', 'good evening', 'wassup', 'yo'
  ];
  if (pureGreetings.includes(cleanText) || /^h+i+$/i.test(cleanText) || /^he+y+$/i.test(cleanText)) {
    return null;
  }

  // 1. Extract score / percentage
  let scoreNum: number | null = null;
  const percentMatch = cleanText.match(/\b([1-9][0-9]?|100)\s*(?:%|percent|prcnt)\b/i);
  if (percentMatch) {
    scoreNum = parseInt(percentMatch[1], 10);
  } else {
    const scoredMatch = cleanText.match(/\b(?:scored|got|have|secured|obtained|marks?)\s*([1-9][0-9]?|100)\b/i);
    if (scoredMatch) {
      scoreNum = parseInt(scoredMatch[1], 10);
    }
  }

  const isDistinction = (scoreNum !== null && scoreNum >= 75) || /\b(distinction|topper|merit)\b/i.test(cleanText);
  const isFirstDivision = (scoreNum !== null && scoreNum >= 60 && scoreNum < 75) || /\bfirst\s+division\b/i.test(cleanText);
  const isAverage = (scoreNum !== null && scoreNum >= 45 && scoreNum < 60) || /\bsecond\s+division\b/i.test(cleanText);
  const isLow = (scoreNum !== null && scoreNum < 45) || /\b(third\s+division|low\s+marks|poor\s+marks|kam\s+marks|less\s+marks)\b/i.test(cleanText);
  const isFailed = /\b(fail|failed|compartment|supplementary|backlog)\b/i.test(cleanText);

  // 2. Class Level
  const isClass10 = /\b(10th|class 10|matric|madhyamik|ssc|high school)\b/i.test(cleanText);
  const isClass12 = /\b(12th|class 12|inter|intermediate|hsc|higher secondary|\+2|plus two)\b/i.test(cleanText);

  // 3. Subjects & Fields
  const hasMath = /\b(math|maths|mathematics|algebra|calculus)\b/i.test(cleanText);
  const hasScience = /\b(science|physics|chemistry)\b/i.test(cleanText);
  const hasComputers = /\b(computer|computers|coding|programming|software|web|frontend|python|it|developer|ai)\b/i.test(cleanText);
  const hasBio = /\b(bio|biology|life science|medical|doctor|nurse|nursing|hospital|healthcare|paramedical|gda|patient)\b/i.test(cleanText);
  const hasCommerce = /\b(commerce|commercial|accounts|accountancy|tally|gst|business studies|economics|banking|finance)\b/i.test(cleanText);
  const hasArts = /\b(arts|humanities|history|geography|political science|civics|sociology|philosophy)\b/i.test(cleanText);
  const hasTools = /\b(electrician|electrical|wireman|mechanic|tools|machines|fitter|welder|solar|ev|automobile|hardware)\b/i.test(cleanText);
  const hasAgri = /\b(agriculture|agri|farming|farmer|crop|drone|soil|dairy)\b/i.test(cleanText);
  const hasCreative = /\b(design|drawing|graphic|art|video|animation|canva|content|editing)\b/i.test(cleanText);
  const hasDefense = /\b(army|police|navy|air force|defense|defence|agniveer|constable|crpf|bsf)\b/i.test(cleanText);

  // 4. Emotional / Life Situations
  const hasFinancialNeed = /\b(poor|financial|money problem|earn money quickly|earn early|urgent job|kam paise|cannot afford|free course|stipend)\b/i.test(cleanText);
  const isConfused = /\b(confused|confusion|don't know|not sure|clueless|help me decide|what should i do|which stream|which career|cannot decide)\b/i.test(cleanText);

  // Trigger check:
  const isCounselingInput =
    scoreNum !== null ||
    isFailed ||
    isLow ||
    isDistinction ||
    isFirstDivision ||
    isAverage ||
    hasFinancialNeed ||
    isConfused ||
    ((isClass10 || isClass12) && (hasMath || hasComputers || hasBio || hasCommerce || hasArts || hasTools || hasAgri || hasCreative || hasDefense));

  if (!isCounselingInput) {
    return null;
  }

  const nameIntro = studentName ? `Hello ${studentName}! ` : '';
  const classLabel = isClass12 ? 'Class 12' : isClass10 ? 'Class 10' : 'Board Examinations';

  // --- CASE 1: Student is in financial distress or needs to earn quickly ---
  if (hasFinancialNeed) {
    return `${nameIntro}I completely understand your family's situation. ❤️ Wanting to earn a reliable livelihood early is a deeply responsible and mature decision, and you do **NOT** need to spend 4 to 5 expensive years in college to start earning an honorable income!

Here are the highest-paying, **zero-expense government-sponsored fast tracks**:

1. ☀️ **Solar PV Rooftop Technician (Surya Mitra)**:
   - **Cost**: 100% Free 3-month residential program (funded by MNRE with free lodging & food).
   - **Opportunity**: Under the **PM Surya Ghar Yojana (1 Crore Rooftops)**, over 3,00,000 technicians are being recruited.
   - **Starting Income**: ₹18,000 to ₹35,000/month, with rapid growth into an independent solar contractor.

2. 🛠️ **National Apprenticeship Promotion Scheme (NAPS) [apprenticeshipindia.gov.in]**:
   - **Earn While You Learn**: Get placed in verified private or public enterprises and receive a **direct monthly government-backed stipend (₹7,000 - ₹12,000/month)** from day one while training.

3. 🏥 **General Duty Assistant (GDA) - Healthcare**:
   - **Duration**: 3 to 6 months NSQF Level 4 hospital training.
   - **Placement**: Direct clinical placement in district civil hospitals and private healthcare centers (Starting: ₹15,000 - ₹25,000/month).

4. 💰 **National Scholarship Portal (NSP) [scholarships.gov.in]**:
   - Covers 100% tuition fees, textbook allowance, and monthly maintenance allowance for post-matric studies.

*Which of these sounds most practical for your immediate situation: Solar & Electrical work, Healthcare assistance, or a paid industrial apprenticeship?*`;
  }

  // --- CASE 2: Low Marks / Failed / Compartment ---
  if (isFailed || isLow) {
    const scorePrefix = scoreNum ? `Scoring ${scoreNum}% or having` : 'Having';
    return `${nameIntro}First, please take a deep breath. ❤️ ${scorePrefix} a difficult board exam result does **NOT** define your intelligence, your character, or your future livelihood!

Many of India's most prosperous entrepreneurs, master technicians, and business leaders struggled with traditional school exams. In the real world, **practical hands-on skills, reliability, and work ethic count for far more than exam percentages.**

Here are high-growth paths where your practical ability matters most:

1. ⚡ **ITI Craftsman Trades (Electrician, Wireman, Fitter, Welder)**:
   - **Eligibility**: Open to Class 8 or Class 10 candidates. Admissions prioritize practical trade interest rather than high marks.
   - **Job Demand**: High hiring across State Electricity Boards (DISCOMs), Indian Railways, and manufacturing plants (Starting: ₹18,000 - ₹32,000/month).

2. 📱 **Smartphone & Hardware Electronics Technician**:
   - **Hands-on Skill**: Complete a 2-3 month practical circuit repair workshop. You can work with service centers or establish your own shop earning ₹20,000 - ₹40,000+/month.

3. 📚 **NIOS (National Institute of Open Schooling) [nios.ac.in]**:
   - You can clear your board subjects comfortably at your own pace through **On-Demand Examinations** while learning a vocational trade at the same time.

*Tell me: do you prefer working with physical tools and machines, or creative software on a computer? Let's build your path together!*`;
  }

  // --- CASE 3: Student is Confused / Needs Direction ---
  if (isConfused) {
    return `${nameIntro}It is completely natural to feel confused! 🤝 Over 80% of students in India feel overwhelmed after Class 10th and 12th because there are so many options and expectations.

Let's make this simple and stress-free. Instead of choosing a lifetime career right now, answer these 3 quick questions for me:

1. ⚙️ **Tools vs. People vs. Business**:
   - Do you enjoy working with **machines, circuits & computers**?
   - Or helping **patients, children & community members**?
   - Or managing **money, shop accounts & business sales**?

2. 🏫 **Your Learning Style**:
   - Do you learn best by **doing practical, hands-on tasks in a workshop/computer lab**?
   - Or do you prefer **reading textbooks and studying for exams**?

3. ⏱️ **Your Timeline**:
   - Do you want to **start earning within 6 to 12 months** through a vocational certificate/diploma?
   - Or are you ready for a **3 to 4-year college degree**?

*Reply with what feels natural to you, and I will pinpoint your top 2 matched career options!*`;
  }

  // --- CASE 4: Math / Science / Computers / Coding (STEM) ---
  if (hasComputers || (hasMath && (hasScience || isClass10))) {
    const distinctionVariants = [
      `🎉 **Outstanding work${scoreNum ? ` on scoring ${scoreNum}%` : ''} in ${classLabel}!** That is a stellar score that demonstrates exceptional analytical discipline and problem-solving aptitude.`,
      `🌟 **Scoring ${scoreNum ? `${scoreNum}%` : 'top marks'} in ${classLabel} is a tremendous achievement!** Your strong conceptual grip on analytical subjects gives you a solid foundation for technology careers.`,
      `👏 **Congratulations on a fantastic performance${scoreNum ? ` (${scoreNum}%)` : ''} in ${classLabel}!** Having both high marks and an inclination toward mathematics and computing opens up premier pathways.`
    ];

    const firstDivVariants = [
      `👍 **Great job${scoreNum ? ` on scoring ${scoreNum}%` : ''} in ${classLabel}!** Achieving First Division provides a rock-solid foundation for top technical and engineering careers.`,
      `✨ **A score of ${scoreNum ? `${scoreNum}%` : 'First Division'} in ${classLabel} is a commendable foundation!** You qualify comfortably for major polytechnic and higher secondary technology streams.`
    ];

    const praise = isDistinction
      ? selectRandom(distinctionVariants)
      : isFirstDivision
      ? selectRandom(firstDivVariants)
      : `🤝 **Good effort in ${classLabel}!** Combining Mathematics with an interest in technology opens up some of India's fastest-growing livelihood tracks.`;

    const followUps = [
      `*Between preparing for JEE Main (academic route) and a hands-on practical Polytechnic diploma where you write software from day one, which sounds more exciting to you?*`,
      `*Would you lean more toward a 3-year hands-on diploma with direct lateral entry to B.Tech, or focusing on Class 11-12 board exams and engineering entrances?*`,
      `*Which learning style fits you better: studying advanced theory for college entrance tests, or diving straight into building practical code and software projects?*`
    ];

    return `${nameIntro}${praise}

Here are the 3 best paths tailored specifically to your analytical strengths:

1. 💻 **Class 11 & 12 Science (PCM + Computer Science)**:
   - **Why It Fits**: The premier academic route. Prepares you for **JEE Main / State CET** for B.Tech in Computer Science, Artificial Intelligence, or Data Science.
   - **Salary Potential**: ₹35,000 to ₹75,000+/month for junior software engineers.
   - **Key Subjects**: Calculus, Physics, Programming fundamentals (Python / C++).

2. ⚙️ **3-Year Polytechnic Diploma in Computer Engineering**:
   - **Key Advantage**: 100% practical lab work from day one at much lower college fees.
   - **Special Shortcut**: Allows **Direct Lateral Entry into the 2nd Year of B.Tech**! You gain hands-on coding skills while saving on coaching fees.
   - **Starting Salary**: ₹22,000 to ₹40,000/month.

3. 🚀 **Self-Paced Web & Frontend Developer Track**:
   - Start today on your laptop or cyber-cafe PC using **free DIKSHA & freeCodeCamp modules** (HTML5, CSS3, JavaScript, React). Build 3 real projects to showcase on GitHub and apply for remote junior internships.

${selectRandom(followUps)}`;
  }

  // --- CASE 5: Biology / Medical / Healthcare ---
  if (hasBio) {
    const praise = isDistinction
      ? `🎉 **Wonderful achievement${scoreNum ? ` with ${scoreNum}%` : ''} in ${classLabel}!** Your strong academic record is ideal for the rigorous medical and life science disciplines.`
      : `🏥 **Choosing Healthcare and Biology is a noble, recession-proof path!** Healthcare professionals command immense respect and reliable career security across India.`;

    return `${nameIntro}${praise}

Here are the top healthcare pathways matched to your profile:

1. 🩺 **Class 11 & 12 Science (PCB) -> NEET / BSc Nursing / B.Pharm**:
   - **Degree Tracks**: MBBS, BDS, or **BSc Nursing (4 Years)**. BSc Nursing is currently in massive demand globally and across all private and AIIMS hospitals (Starting: ₹25,000 - ₹55,000/month).
   - **Pharmacy**: B.Pharm / D.Pharm leading to licensed retail pharmacy or pharmaceutical manufacturing roles.

2. 🏥 **General Duty Assistant (GDA) & Paramedical Diploma**:
   - **NSQF Level 4**: Fast 3-to-6-month hospital internship accredited by the Healthcare Sector Skill Council.
   - **Role**: Assist doctors with patient vitals, emergency first aid, and clinical care.
   - **Starting Salary**: ₹15,000 to ₹28,000/month with reliable job stability.

3. 🔬 **Medical Laboratory Technology (DMLT - 2 Years)**:
   - Clinical diagnostic training in blood testing, pathology, and diagnostic imaging.

*Do you see yourself working directly with patients at bedside (like Nursing or GDA), or working in clinical diagnostic labs and pharmacy?*`;
  }

  // --- CASE 6: Commerce / Accounts / Tally / Finance ---
  if (hasCommerce) {
    const praise = isDistinction || isFirstDivision
      ? `📊 **Solid performance${scoreNum ? ` with ${scoreNum}%` : ''} in ${classLabel}!** Financial literacy and business skills are the engine of India's commercial economy.`
      : `📊 **Commerce and practical accounting offer immediate, steady employment opportunities!**`;

    return `${nameIntro}${praise}

Here are the highest-value pathways in Commerce & Accounting:

1. 💼 **Tally Prime & GST Professional Certification**:
   - **Duration**: 2 to 3 months practical vocational training.
   - **Livelihood**: Every shopkeeper, distributor, factory, and CA firm requires an accountant for monthly GST filing, TDS, and invoicing (Starting: ₹18,000 - ₹32,000/month).

2. 🎓 **Class 11 & 12 Commerce -> B.Com / BBA -> CA Foundation or CMA**:
   - The classic corporate track leading to Chartered Accountancy, corporate tax consulting, or banking management.

3. 💳 **Business Correspondent (Bank Mitra) & Microfinance**:
   - Provide Aadhaar-enabled banking (AePS) and digital payments in local panchayats through CSC Grameen or bank networks, earning regular transaction commissions.

*Would you prefer starting with a practical Tally GST course to begin earning soon, or are you planning a 3-year B.Com college degree?*`;
  }

  // --- CASE 7: Hands-on / Technical Trades / Solar / Electrician ---
  if (hasTools) {
    return `${nameIntro}⚡ Working with hands-on machinery, electrical circuits, and green infrastructure is one of the smartest career moves in modern India! Skilled craftsmen often earn more than general degree holders.

Top hands-on pathways for you:

1. ☀️ **Solar PV Rooftop Technician (Surya Mitra)**:
   - **Government Scheme**: 3-month free residential program funded by MNRE under the **PM Surya Ghar Yojana (1 Crore Rooftops)**.
   - **Skills**: Inverter wiring, rooftop solar mounting, earthing, and net-meter testing.
   - **Starting Salary**: ₹18,000 to ₹35,000/month, with rapid path to solar contracting entrepreneurship.

2. 🔧 **ITI Electrician & Wireman (2 Years)**:
   - NSQF Level 4 craftsman certificate. Massive recruitment across State DISCOMs, Indian Railways, and construction EPCs (Starting: ₹18,000 - ₹30,000/month).

3. 🛵 **Electric Vehicle (EV) Service Technician**:
   - Automotive Skills Development Council (ASDC) certified course for diagnosing electric two-wheelers, battery packs, and hub motors.

*Would you like me to walk you through the free Surya Mitra application at nise.res.in or explore ITI trade admissions?*`;
  }

  // --- CASE 8: General Marks Acknowledgment Without Specific Subjects ---
  if (scoreNum !== null) {
    const praise = isDistinction
      ? `🎉 **Congratulations on scoring ${scoreNum}% in ${classLabel}!** That is a top-tier performance that qualifies you for all premium science, commerce, and polytechnic programs across India.`
      : isFirstDivision
      ? `👍 **A score of ${scoreNum}% in ${classLabel} is a strong First Division accomplishment!** You have met the eligibility criteria for all major diplomas, higher secondary streams, and state colleges.`
      : `🤝 **Scoring ${scoreNum}% in ${classLabel} gives you full eligibility** for Class 11-12 streams, 3-year polytechnic diplomas, and government ITI trades.`;

    return `${nameIntro}${praise}

To help me recommend the highest-paying and most enjoyable career for your specific profile:

1. **Which 1 or 2 subjects did you enjoy the most** (e.g. Mathematics, Science, Social Studies, English, or Computers)?
2. **What kind of daily work excites you** (hands-on tools/circuits, writing software, hospital healthcare, or business/accounts)?
3. **What is your target timeline** (quick 6-12 month job-ready skill vs. 3-4 year college degree)?

Tell me your favorite subjects, and I will show you the exact career matches!`;
  }

  return null;
}

/**
 * Retrieve a smart conversational response based on message content.
 */
export function getFallbackChatResponse(
  prompt: string,
  studentName?: string
): string {
  const query = extractUserQuery(prompt);
  const cleanText = query.toLowerCase().replace(/['"?!.,;:]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = cleanText.split(' ').filter(Boolean);

  // Prioritize course recommendation & study options requests
  const isCourseQuery = /\b(course|courses|recommend|recommendation|recommendations|suggest|suggestion|suggestions|what should i study|which course|what course|certif|certifications|training module|training modules|study options)\b/i.test(cleanText);
  if (isCourseQuery) {
    const courseIntent = CONVERSATION_INTENTS.find((i) => i.id === 'course-recommendation');
    if (courseIntent) {
      return courseIntent.reply(studentName, prompt, cleanText);
    }
  }

  // Check diagnostic counselor logic (evaluates student marks, subjects, and situation)
  const diagnosis = diagnoseStudentInput(cleanText, query, studentName);
  if (diagnosis) {
    return diagnosis;
  }

  // Match against intent library
  for (const intent of CONVERSATION_INTENTS) {
    if (intent.match(cleanText, tokens)) {
      return intent.reply(studentName, prompt, cleanText);
    }
  }

  // Generic contextual fallback for uncategorized career queries
  const greeting = studentName ? `Hello ${studentName}! ` : 'Hello! ';
  return `${greeting}I am your **NextLearning AI Career & Education Advisor**.

You asked about: **"${query.slice(0, 80)}"**

To give you the most accurate and practical recommendation:
1. **Your current education stage** (e.g. Class 9, Class 10, Class 12, Diploma, or Graduate)?
2. **What kind of work you enjoy most** (hands-on technical tools, computer software, healthcare & helping others, outdoor agriculture, or business)?
3. **Your preferred location** (local village/district, state capital, or remote/digital)?

Tell me a little more, or try asking:
- *"What can I do after Class 10?"*
- *"Tell me about Solar PV Rooftop Technician career"*
- *"How to become a Web Developer?"*
- *"Government scholarships available for students"*`;
}

/**
 * Generate a fallback roadmap for a given career title or slug.
 */
export function getFallbackRoadmap(
  careerTitle: string,
  careerSlug?: string,
  studentName?: string
): FallbackRoadmapTemplate {
  // Check exact slug matches
  if (careerSlug && FALLBACK_ROADMAPS[careerSlug]) {
    return FALLBACK_ROADMAPS[careerSlug];
  }

  // Check title fuzzy match
  const lowerTitle = careerTitle.toLowerCase();
  for (const [slug, template] of Object.entries(FALLBACK_ROADMAPS)) {
    if (
      lowerTitle.includes(slug.replace(/-/g, ' ')) ||
      template.careerTitle.toLowerCase().includes(lowerTitle)
    ) {
      return template;
    }
  }

  if (lowerTitle.includes('solar') || lowerTitle.includes('energy')) {
    return FALLBACK_ROADMAPS['solar-pv-rooftop-technician'];
  }
  if (
    lowerTitle.includes('web') ||
    lowerTitle.includes('developer') ||
    lowerTitle.includes('software') ||
    lowerTitle.includes('code')
  ) {
    return FALLBACK_ROADMAPS['junior-frontend-web-developer'];
  }
  if (
    lowerTitle.includes('drone') ||
    lowerTitle.includes('agri') ||
    lowerTitle.includes('crop')
  ) {
    return FALLBACK_ROADMAPS['agritech-drone-pilot'];
  }
  if (
    lowerTitle.includes('health') ||
    lowerTitle.includes('medical') ||
    lowerTitle.includes('nurse') ||
    lowerTitle.includes('assistant')
  ) {
    return FALLBACK_ROADMAPS['general-duty-assistant'];
  }

  // Dynamic generic fallback roadmap tailored for Indian vocational context
  return {
    careerTitle: careerTitle,
    description: `A practical step-by-step learning journey designed for ${
      studentName || 'you'
    } to gain the core competencies, practical exposure, and credentials needed for ${careerTitle}.`,
    steps: [
      {
        order: 1,
        title: `Foundations & Fundamentals of ${careerTitle}`,
        description: `Learn the core terminology, principles, and basic safety/operational standards of the industry through introductory video modules.`,
        type: 'learn',
        duration: '2 weeks',
        resourceTitle: 'Skill India Digital / Swayam Portal',
        resourceUrl: 'https://www.skillindiadigital.gov.in',
      },
      {
        order: 2,
        title: 'Core Tools & Hands-On Practice',
        description:
          'Practice essential tools, software, or equipment required on the job under mentorship or using local lab kits.',
        type: 'practice',
        duration: '3 weeks',
      },
      {
        order: 3,
        title: 'Intermediate Technical Knowledge & Best Practices',
        description:
          'Deepen your knowledge of troubleshooting, safety compliance, and Indian regulatory standards (BIS/NSQF).',
        type: 'learn',
        duration: '4 weeks',
      },
      {
        order: 4,
        title: 'Practical Project / Field Case Study',
        description:
          'Complete a realistic mini-project or volunteer assignment to demonstrate your practical readiness.',
        type: 'practice',
        duration: '2 weeks',
      },
      {
        order: 5,
        title: 'Assessment & Certification Prep',
        description:
          'Prepare for relevant government or industry certification assessments (e.g. NSDC, ITI, or partner exams).',
        type: 'exam',
        duration: '1 week',
      },
      {
        order: 6,
        title: 'Apprenticeship & Job Application',
        description:
          'Register on National Apprenticeship Promotion Scheme (NAPS) and apply for entry-level positions or local contracts.',
        type: 'milestone',
        duration: '1 month',
      },
    ],
  };
}
