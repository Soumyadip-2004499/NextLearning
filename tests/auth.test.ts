import test from "node:test";
import assert from "node:assert/strict";
import { POST as loginHandler } from "../src/app/api/auth/login/route";
import { NextRequest } from "next/server";

function createMockRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("loginHandler authenticates student demo account", async () => {
  const req = createMockRequest({
    email: "demo@student.com",
    password: "demo1234",
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.email, "demo@student.com");
  assert.equal(data.user.role, "STUDENT");
  assert.equal(data.redirectTo, "/dashboard");

  // Check cookies set
  const cookies = res.cookies;
  assert.equal(cookies.get("nextlearning_user")?.value, "demo@student.com");
  assert.equal(cookies.get("nextlearning_role")?.value, "STUDENT");
  assert.ok(cookies.get("nextlearning_session")?.value);
  assert.ok(cookies.get("udaan_session")?.value);
});

test("loginHandler authenticates facilitator demo account", async () => {
  const req = createMockRequest({
    email: "demo@teacher.com",
    password: "demo1234",
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.email, "demo@teacher.com");
  assert.equal(data.user.role, "FACILITATOR");
  assert.equal(data.redirectTo, "/facilitator");

  // Check cookies set
  const cookies = res.cookies;
  assert.equal(cookies.get("nextlearning_user")?.value, "demo@teacher.com");
  assert.equal(cookies.get("nextlearning_role")?.value, "FACILITATOR");
  assert.ok(cookies.get("nextlearning_session")?.value);
  assert.ok(cookies.get("udaan_session")?.value);
});

test("loginHandler rejects invalid password", async () => {
  const req = createMockRequest({
    email: "demo@student.com",
    password: "wrongpassword999",
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 401);

  const data = await res.json();
  assert.equal(data.success, false);
});

test("loginHandler rejects unknown email", async () => {
  const req = createMockRequest({
    email: "unknown-user-999@test.in",
    password: "demo1234",
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 401);

  const data = await res.json();
  assert.equal(data.success, false);
});

test("loginHandler authenticates Soumyadip student account", async () => {
  const req = createMockRequest({
    email: "Soumya@student.com",
    password: "Soumya@2004",
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.role, "STUDENT");
  assert.equal(data.redirectTo, "/dashboard");
});

test("loginHandler authenticates Facilitator G. Sai Kavya account", async () => {
  const req = createMockRequest({
    email: "Kavya@facilitator.com",
    password: "Kavya@2005",
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.role, "FACILITATOR");
  assert.equal(data.redirectTo, "/facilitator");
  assert.equal(res.cookies.get("nextlearning_role")?.value, "FACILITATOR");
  assert.equal(res.cookies.get("udaan_role")?.value, "FACILITATOR");
});

