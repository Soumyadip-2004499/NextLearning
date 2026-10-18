import test from "node:test";
import assert from "node:assert/strict";
import { cn, formatDate, parseJsonField, slugify, truncate, getInitials } from "../src/lib/utils";

test("cn utility merges class names correctly", () => {
  const result = cn("p-4", "text-red-500", false && "hidden", "p-6");
  assert.equal(result.includes("p-6"), true);
  assert.equal(result.includes("p-4"), false); // tailwind-merge resolves conflicts
});

test("formatDate formats dates to Indian locale", () => {
  const date = new Date("2026-10-15T00:00:00.000Z");
  const formatted = formatDate(date);
  assert.match(formatted, /15.*Oct.*2026/i);
});

test("parseJsonField safely parses JSON strings and returns fallbacks", () => {
  const valid = parseJsonField('["tech", "agriculture"]', []);
  assert.deepEqual(valid, ["tech", "agriculture"]);

  const invalid = parseJsonField("invalid json string", ["fallback"]);
  assert.deepEqual(invalid, ["fallback"]);

  const nullVal = parseJsonField(null, ["fallback"]);
  assert.deepEqual(nullVal, ["fallback"]);
});

test("slugify creates URL-friendly slugs", () => {
  assert.equal(slugify("Solar PV Rooftop Technician & Installer!"), "solar-pv-rooftop-technician-installer");
  assert.equal(slugify("Agritech Drone Pilot 2026"), "agritech-drone-pilot-2026");
});

test("truncate shortens text appropriately", () => {
  assert.equal(truncate("Hello world", 5), "Hello…");
  assert.equal(truncate("Short", 10), "Short");
});

test("getInitials extracts two letters from names", () => {
  assert.equal(getInitials("Soumyadip Chattopadhyay"), "SC");
  assert.equal(getInitials("G. Sai Kavya"), "GS");
  assert.equal(getInitials("NextLearning"), "N");
  assert.equal(getInitials("Next Learning"), "NL");
});
