import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getFallbackChatResponse, getFallbackRoadmap } from '../src/lib/ai/fallback';
import { getAIProvider } from '../src/lib/ai/provider';

test('fallback returns non-deterministic varied answers for repeated queries', () => {
  const query = 'What can I do after Class 12?';
  const responses = new Set<string>();

  // Sample multiple times to observe variation across the pool responses
  for (let i = 0; i < 30; i++) {
    const res = getFallbackChatResponse(query);
    assert.ok(res.length > 50, 'Response should have substantial content');
    responses.add(res);
  }

  // Should have generated more than 1 distinct response variant
  assert.ok(responses.size > 1, `Expected varied responses, got ${responses.size} unique variations`);
});

test('fallback greeting produces non-deterministic varied openings', () => {
  const variations = new Set<string>();

  for (let i = 0; i < 20; i++) {
    const greeting = getFallbackChatResponse('hello', 'Soumyadip');
    assert.ok(greeting.length > 20);
    variations.add(greeting);
  }

  assert.ok(variations.size > 1, 'Greetings should have non-deterministic variations');
});

test('AI provider initializes with configurable generation settings and stream capability', () => {
  const provider = getAIProvider();
  assert.ok(provider, 'Provider should be instantiated');
  assert.strictEqual(typeof provider.generateText, 'function');
  assert.strictEqual(typeof provider.generateStream, 'function');
});

test('fallback roadmap retrieves structured template with learning milestones', () => {
  const roadmap = getFallbackRoadmap('Solar PV Rooftop Technician');
  assert.ok(roadmap);
  assert.ok(roadmap.steps.length >= 3);
  assert.ok(roadmap.steps.some((s) => s.type === 'learn'));
});

test('course recommendation aligns with student marks, field of interest, and varies across calls', () => {
  const techStudentPrompt = `Student Profile Context:
- Name: Soumyadip
- Education Level: 12th
- Class 10th Marks / Standing: 88.5% (Distinction - State Board Top Tier)
- Class 12th Marks / Standing: 86.2% (PCM Stream - First Class with Distinction)
- Academic Standing: Excellent (Distinction across both 10th & 12th)
- Favorite Subjects: Mathematics, Physics, Computer Science
- Field of Interest: Technology & Computer Science

Student: Recommend courses matching my marks & interests`;

  const responses = new Set<string>();

  for (let i = 0; i < 20; i++) {
    const res = getFallbackChatResponse(techStudentPrompt, 'Soumyadip');
    assert.ok(res.includes('88.5%') || res.includes('Class 10'), 'Should reference Class 10 marks/standing');
    assert.ok(res.includes('86.2%') || res.includes('Class 12'), 'Should reference Class 12 marks/standing');
    assert.ok(
      res.includes('Tech') || res.includes('Software') || res.includes('Web') || res.includes('AI') || res.includes('Hardware'),
      'Should recommend courses aligned with Technology interest'
    );
    responses.add(res);
  }

  // Must have varied across calls (e.g., Track A, Track B, Track C)
  assert.ok(responses.size > 1, `Expected varied course sets across repeated asks, got ${responses.size} unique variations`);
});

test('course recommendation tailors to healthcare student interest and marks with variation', () => {
  const healthStudentPrompt = `Student Profile Context:
- Name: Ananya
- Education Level: 12th
- Class 10th Marks / Standing: 79.2% (First Division)
- Class 12th Marks / Standing: 81.6% (PCB Biology Stream)
- Academic Standing: Very Good (Distinction in Biology)
- Favorite Subjects: Biology, Chemistry
- Field of Interest: Healthcare & Allied Health

Student: Which courses do you suggest for me?`;

  const responses = new Set<string>();

  for (let i = 0; i < 20; i++) {
    const res = getFallbackChatResponse(healthStudentPrompt, 'Ananya');
    assert.ok(res.includes('Ananya'), 'Should address student by name');
    assert.ok(res.includes('79.2%') || res.includes('81.6%'), 'Should reference Class 10 or 12 marks');
    assert.ok(
      res.includes('Health') || res.includes('Medical') || res.includes('Care') || res.includes('Hospital') || res.includes('Dialysis'),
      'Should recommend courses aligned with Healthcare interest'
    );
    responses.add(res);
  }

  assert.ok(responses.size > 1, `Expected varied healthcare courses across repeated calls, got ${responses.size} variations`);
});

