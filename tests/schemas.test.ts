import test from "node:test";
import assert from "node:assert/strict";
import {
  loginSchema,
  registerSchema,
  profileUpdateSchema,
  chatMessageSchema,
  applicationStatusSchema,
  trainingModuleSchema,
} from "../src/lib/validators/schemas";

test("loginSchema validates valid credentials", () => {
  const result = loginSchema.safeParse({
    email: "student@example.com",
    password: "password123",
  });
  assert.equal(result.success, true);
});

test("loginSchema rejects invalid email", () => {
  const result = loginSchema.safeParse({
    email: "not-an-email",
    password: "password123",
  });
  assert.equal(result.success, false);
});

test("registerSchema validates matching passwords and student role", () => {
  const result = registerSchema.safeParse({
    name: "Soumyadip Chattopadhyay",
    email: "soumyadip@test.in",
    password: "securepassword",
    confirmPassword: "securepassword",
    role: "STUDENT",
    language: "hi",
  });
  assert.equal(result.success, true);
});

test("registerSchema fails when passwords do not match", () => {
  const result = registerSchema.safeParse({
    name: "Soumyadip Chattopadhyay",
    email: "soumyadip@test.in",
    password: "securepassword1",
    confirmPassword: "securepassword2",
    role: "STUDENT",
  });
  assert.equal(result.success, false);
});

test("profileUpdateSchema validates array fields", () => {
  const result = profileUpdateSchema.safeParse({
    displayName: "Soumyadip C.",
    interests: ["solar", "agriculture"],
    skills: ["electrician"],
    availableHours: 15,
  });
  assert.equal(result.success, true);
});

test("chatMessageSchema enforces message size boundaries", () => {
  const valid = chatMessageSchema.safeParse({ message: "What can I do after Class 10?" });
  assert.equal(valid.success, true);

  const empty = chatMessageSchema.safeParse({ message: "" });
  assert.equal(empty.success, false);
});

test("applicationStatusSchema accepts valid pipeline states", () => {
  const valid = applicationStatusSchema.safeParse({
    status: "ready_to_apply",
    notes: "Aadhaar and marksheets uploaded",
  });
  assert.equal(valid.success, true);

  const invalid = applicationStatusSchema.safeParse({
    status: "unknown_status",
  });
  assert.equal(invalid.success, false);
});
