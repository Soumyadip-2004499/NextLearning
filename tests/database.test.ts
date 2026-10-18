import test from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/lib/db";

test("database contains seeded careers across multiple categories", async () => {
  const count = await prisma.career.count();
  assert.equal(count >= 36, true);

  const solarCareer = await prisma.career.findUnique({
    where: { slug: "solar-pv-rooftop-technician" },
  });
  assert.notEqual(solarCareer, null);
  assert.equal(solarCareer?.category, "environment");
});

test("database contains demo student and facilitator profiles", async () => {
  const student = await prisma.user.findUnique({
    where: { email: "demo@student.com" },
    include: { studentProfile: true },
  });
  assert.notEqual(student, null);
  assert.equal(student?.role, "STUDENT");
  assert.notEqual(student?.studentProfile, null);

  const teacher = await prisma.user.findUnique({
    where: { email: "demo@teacher.com" },
    include: { facilitatorProfile: true },
  });
  assert.notEqual(teacher, null);
  assert.equal(teacher?.role, "FACILITATOR");
});

test("database contains seeded opportunities and learning resources", async () => {
  const oppCount = await prisma.opportunity.count();
  assert.equal(oppCount >= 18, true);

  const resourceCount = await prisma.learningResource.count();
  assert.equal(resourceCount >= 11, true);
});
