import test from "node:test";
import assert from "node:assert/strict";
import { matchCareer, matchCareers, type CareerCandidate } from "../src/lib/career-engine/matcher";

const mockCareers: CareerCandidate[] = [
  {
    id: "career-1",
    slug: "solar-pv-technician",
    title: "Solar PV Rooftop Technician",
    category: "environmental",
    description: "Install, test, and maintain rooftop solar panels and clean energy systems.",
    requiredSkills: ["Solar Panel Testing & Multimeter Operation", "Electrical Wiring & Safety Protocols"],
    requiredQualifications: ["Class 10 (Secondary School Examination) passed", "ITI / Vocational Training in Electrical"],
  },
  {
    id: "career-2",
    slug: "agritech-drone-pilot",
    title: "Agritech Drone Pilot",
    category: "agriculture",
    description: "Operate agricultural drones for precision crop spraying and field mapping.",
    requiredSkills: ["Agricultural Drone Piloting", "GPS & Precision Mapping", "Smartphone Navigation & App Usage"],
    requiredQualifications: ["Class 10 (Secondary School Examination) passed"],
  },
  {
    id: "career-3",
    slug: "frontend-developer",
    title: "Junior Frontend Web Developer",
    category: "technology",
    description: "Build user interfaces for vernacular portals and community websites.",
    requiredSkills: ["Frontend Web Development (HTML/CSS/JS)", "Basic Computer Operations"],
    requiredQualifications: ["Class 12 (Higher Secondary) passed", "Polytechnic Diploma in Computer Science"],
  },
];

test("matchCareer computes positive score for matching interests and skills", () => {
  const result = matchCareer(
    {
      interests: ["clean energy", "solar", "electronics"],
      skills: ["Solar Panel Testing & Multimeter Operation"],
      careerAspirations: ["Renewable Energy Technician"],
      educationLevel: "class_10",
      careerPreference: "vocational",
    },
    mockCareers[0]
  );

  assert.equal(result.score > 60, true);
  assert.equal(result.breakdown.interestAlignment > 0, true);
  assert.equal(result.breakdown.skillAlignment > 0, true);
  assert.equal(result.breakdown.educationCompatibility > 0, true);
  assert.equal(result.reasons.length > 0, true);
});

test("matchCareers ranks highest matching career first", () => {
  const matches = matchCareers(
    {
      interests: ["farming", "drones", "crops"],
      skills: ["Smartphone Navigation & App Usage"],
      careerAspirations: ["Drone pilot"],
      educationLevel: "class_10",
      careerPreference: "vocational",
    },
    mockCareers
  );

  assert.equal(matches.length, 3);
  assert.equal(matches[0].careerId, "career-2"); // agritech drone pilot
  assert.equal(matches[0].score >= matches[1].score, true);
});
