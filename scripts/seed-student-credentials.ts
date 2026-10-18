import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const STUDENTS_CREDENTIALS = [
  {
    name: "Soumyadip Chattopadhyay",
    email: "soumya@student.com",
    password: "Soumya@2004",
    educationLevel: "class_10",
    district: "Anantapur",
    state: "Andhra Pradesh",
    class10Marks: "88.5% (Distinction - Mathematics 94, Science 91)",
    class12Marks: "86.2% (First Division - Science PCM)",
    academicPerformance: JSON.stringify({
      class10: { percentage: 88.5, division: "Distinction", math: 94, science: 91, english: 85 },
      class12: { percentage: 86.2, stream: "Science (PCM)", physics: 88, chemistry: 82, math: 89 },
      strengths: ["Strong problem solving in Math & Computer Algorithms", "Eligible for Engineering, BCA, Poly-CS and NSQF Level 5+ certifications"],
    }),
    favoriteSubjects: ["Mathematics", "Physics", "Computer Science"],
    interests: ["Software Engineering", "Artificial Intelligence", "Web Development", "Robotics"],
    skills: ["Basic Computer Operations", "Frontend Web Development (HTML/CSS/JS)", "Problem Solving"],
    careerAspirations: ["Junior Frontend Web Developer", "AI Prompt Specialist & Data Annotator"],
    careerPreference: "technology",
  },
  {
    name: "Ananya Mondal",
    email: "ananya@student.com",
    password: "Ananya@2004",
    educationLevel: "class_12",
    district: "Anantapur",
    state: "Andhra Pradesh",
    class10Marks: "79.2% (First Division)",
    class12Marks: "81.6% (First Division - Science PCB)",
    academicPerformance: JSON.stringify({
      class10: { percentage: 79.2, division: "First Division" },
      class12: { percentage: 81.6, stream: "Science (PCB)", biology: 88, physics: 78, chemistry: 79 },
      strengths: ["Excellent score in Life Science & Biology", "Eligible for Paramedical BSc, Dialysis Technology, GDA and Allied Health diplomas"],
    }),
    favoriteSubjects: ["Biology", "Physics", "Computer Applications"],
    interests: ["Medical Diagnostics", "Biotechnology", "Hospital Administration"],
    skills: ["Medical Equipment Sanitization & First Aid", "Active Listening & Empathy"],
    careerAspirations: ["Dialysis Unit Clinical Assistant", "Telemedicine & Rural Health Coordinator"],
    careerPreference: "healthcare",
  },
  {
    name: "Rahul Soren",
    email: "rahul@student.com",
    password: "Rahul@2004",
    educationLevel: "class_10",
    district: "Anantapur",
    state: "Andhra Pradesh",
    class10Marks: "64.5% (First Division - Practical 82)",
    class12Marks: "68.0% (Vocational ITI Track)",
    academicPerformance: JSON.stringify({
      class10: { percentage: 64.5, division: "First Division", math: 68, science: 65, workEducation: 85 },
      strengths: ["High technical aptitude for tools and electrical circuits", "Ideal for PM Surya Ghar, Surya Mitra 3-month residential, and ITI Electrician"],
    }),
    favoriteSubjects: ["Mathematics", "Physics", "Work Education"],
    interests: ["Solar Energy", "Electrical Systems", "Green Livelihoods"],
    skills: ["Solar Panel Testing & Multimeter Operation", "Basic Computer Operations"],
    careerAspirations: ["Solar PV Rooftop Technician & Installer", "PM-KUSUM Solar Pump & Drip Irrigation Installer"],
    careerPreference: "environment",
  },
  {
    name: "Priyanka Sen",
    email: "priyanka@student.com",
    password: "Priyanka@2004",
    educationLevel: "class_12",
    district: "Anantapur",
    state: "Andhra Pradesh",
    class10Marks: "73.0% (First Division)",
    class12Marks: "75.8% (First Division - Science PCB)",
    academicPerformance: JSON.stringify({
      class10: { percentage: 73.0 },
      class12: { percentage: 75.8, stream: "Science (PCB)", biology: 80, chemistry: 74 },
      strengths: ["High empathy and patient care affinity", "Eligible for GDA Level 4, Optometry Diploma, and Nursing assistantship"],
    }),
    favoriteSubjects: ["Biology", "Chemistry", "English"],
    interests: ["Patient Care", "Nursing", "Community Health Support"],
    skills: ["Medical Equipment Sanitization & First Aid", "Customer Communication & Service"],
    careerAspirations: ["General Duty Medical Assistant (GDA)", "Optometry & Eyecare Dispensing Technician"],
    careerPreference: "healthcare",
  },
  {
    name: "Subhash Bauri",
    email: "subhash@student.com",
    password: "Subhash@2004",
    educationLevel: "class_9",
    district: "Anantapur",
    state: "Andhra Pradesh",
    class10Marks: "58.2% (Second Division - Agriculture/Geography 74)",
    class12Marks: "Class 10 Pass / Agritech Foundation",
    academicPerformance: JSON.stringify({
      class10: { percentage: 58.2, geography: 74, science: 56 },
      strengths: ["Strong practical field experience", "Eligible for Smart Polyhouse, Hydroponics, and KVK Farmer Training"],
    }),
    favoriteSubjects: ["Geography", "Life Science", "History"],
    interests: ["Sustainable Agriculture", "Organic Cultivation", "Village Panchayats"],
    skills: ["Soil Sample Testing & Chemistry", "Team Collaboration & Trust Building"],
    careerAspirations: ["Smart Polyhouse & Hydroponics Grower", "Commercial Aquaculture Specialist"],
    careerPreference: "agriculture",
  },
  {
    name: "Aarav Sharma",
    email: "aarav@student.com",
    password: "Aarav@2004",
    educationLevel: "class_11",
    district: "Anantapur",
    state: "Andhra Pradesh",
    class10Marks: "91.0% (Distinction - Top 1% Merit)",
    class12Marks: "89.4% (Distinction - Computer Science 98)",
    academicPerformance: JSON.stringify({
      class10: { percentage: 91.0, math: 96, science: 94 },
      class12: { percentage: 89.4, stream: "Science (PCM + CS)", cs: 98, math: 92 },
      strengths: ["Elite algorithmic thinking and programming", "Eligible for B.Tech CS, BCA AI, and remote high-value annotation"],
    }),
    favoriteSubjects: ["Computer Science", "Artificial Intelligence", "Mathematics"],
    interests: ["Machine Learning", "Generative AI", "Mobile App Development"],
    skills: ["Basic Computer Operations", "Frontend Web Development (HTML/CSS/JS)"],
    careerAspirations: ["AI Prompt Specialist & Data Annotator", "Mobile Application Developer (Flutter & Android)"],
    careerPreference: "technology",
  },
];

export async function seedStudentAndFacilitatorCredentials() {
  console.log("🔐 Seeding separate student credentials and facilitator accounts...");

  // 1. Facilitator G. Sai Kavya
  const kavyaUser = await prisma.user.upsert({
    where: { email: "kavya@facilitator.com" },
    update: {
      name: "G. Sai Kavya",
      passwordHash: "Kavya@2005",
      role: Role.FACILITATOR,
      language: "en",
    },
    create: {
      name: "G. Sai Kavya",
      email: "kavya@facilitator.com",
      passwordHash: "Kavya@2005",
      role: Role.FACILITATOR,
      language: "en",
    },
  });

  const kavyaProfile = await prisma.facilitatorProfile.upsert({
    where: { userId: kavyaUser.id },
    update: {
      displayName: "G. Sai Kavya",
      organization: "Pratham Rural Career Guidance Center",
      district: "Anantapur",
      state: "Andhra Pradesh",
      expertise: JSON.stringify([
        "Career Guidance & Counseling",
        "Higher Secondary Streams Planning",
        "PMKVY & Vocational Opportunities",
        "Scholarship Access & Financial Aid",
      ]),
      verifiedAt: new Date(),
    },
    create: {
      userId: kavyaUser.id,
      displayName: "G. Sai Kavya",
      organization: "Pratham Rural Career Guidance Center",
      district: "Anantapur",
      state: "Andhra Pradesh",
      expertise: JSON.stringify([
        "Career Guidance & Counseling",
        "Higher Secondary Streams Planning",
        "PMKVY & Vocational Opportunities",
        "Scholarship Access & Financial Aid",
      ]),
      verifiedAt: new Date(),
    },
  });

  // Keep demo facilitator in sync
  await prisma.user.upsert({
    where: { email: "demo@teacher.com" },
    update: {
      name: "G. Sai Kavya",
      passwordHash: "demo1234",
      role: Role.FACILITATOR,
    },
    create: {
      name: "G. Sai Kavya",
      email: "demo@teacher.com",
      passwordHash: "demo1234",
      role: Role.FACILITATOR,
    },
  });

  // 2. Students
  for (const std of STUDENTS_CREDENTIALS) {
    const user = await prisma.user.upsert({
      where: { email: std.email },
      update: {
        name: std.name,
        passwordHash: std.password,
        role: Role.STUDENT,
        language: "en",
      },
      create: {
        name: std.name,
        email: std.email,
        passwordHash: std.password,
        role: Role.STUDENT,
        language: "en",
      },
    });

    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        displayName: std.name,
        educationLevel: std.educationLevel,
        district: std.district,
        state: std.state,
        favoriteSubjects: JSON.stringify(std.favoriteSubjects),
        interests: JSON.stringify(std.interests),
        skills: JSON.stringify(std.skills),
        careerAspirations: JSON.stringify(std.careerAspirations),
        careerPreference: std.careerPreference,
        class10Marks: (std as any).class10Marks || null,
        class12Marks: (std as any).class12Marks || null,
        academicPerformance: (std as any).academicPerformance || null,
        onboardingCompleted: true,
      },
      create: {
        userId: user.id,
        displayName: std.name,
        educationLevel: std.educationLevel,
        district: std.district,
        state: std.state,
        favoriteSubjects: JSON.stringify(std.favoriteSubjects),
        interests: JSON.stringify(std.interests),
        skills: JSON.stringify(std.skills),
        careerAspirations: JSON.stringify(std.careerAspirations),
        careerPreference: std.careerPreference,
        class10Marks: (std as any).class10Marks || null,
        class12Marks: (std as any).class12Marks || null,
        academicPerformance: (std as any).academicPerformance || null,
        onboardingCompleted: true,
      },
    });

    // Link student to G. Sai Kavya
    await prisma.facilitatorStudentAssignment.upsert({
      where: {
        facilitatorId_studentId: {
          facilitatorId: kavyaProfile.id,
          studentId: profile.id,
        },
      },
      update: {
        notes: `Enrolled student specializing in ${std.favoriteSubjects.join(", ")}`,
      },
      create: {
        facilitatorId: kavyaProfile.id,
        studentId: profile.id,
        notes: `Enrolled student specializing in ${std.favoriteSubjects.join(", ")}`,
      },
    });

    // If Soumya, also keep demo@student.com linked
    if (std.email === "soumya@student.com") {
      const demoStd = await prisma.user.findUnique({
        where: { email: "demo@student.com" },
      });
      if (demoStd) {
        await prisma.user.update({
          where: { id: demoStd.id },
          data: {
            name: "Soumyadip Chattopadhyay",
            passwordHash: "demo1234",
          },
        });
        await prisma.studentProfile.updateMany({
          where: { userId: demoStd.id },
          data: {
            class10Marks: (std as any).class10Marks,
            class12Marks: (std as any).class12Marks,
            academicPerformance: (std as any).academicPerformance,
          },
        });
      }
    }
  }

  console.log("✅ Successfully seeded all student portal credentials & G. Sai Kavya facilitator credentials!");
}

if (require.main === module) {
  seedStudentAndFacilitatorCredentials()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error seeding credentials:", err);
      process.exit(1);
    });
}
