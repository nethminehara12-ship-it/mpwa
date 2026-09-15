import test from 'node:test';
import assert from 'node:assert/strict';
import { assessments, assessmentBand, directivesFor, standardOptions } from '../app/assessment-data.ts';

test('all three assessments have seven questions and the full 0–14 range', () => {
  assert.deepEqual(Object.keys(assessments), ['self', 'team', 'staff']);
  for (const assessment of Object.values(assessments)) {
    assert.equal(assessment.questions.length, 7);
    for (const question of assessment.questions) {
      assert.ok(question.text.endsWith('?'));
      assert.deepEqual((question.options || standardOptions).map(option => option.value), [2, 1, 0]);
    }
  }
  assert.deepEqual(assessments.team.questions[3].options.map(option => option.label), ['Yes', 'Not sure', 'No']);
});

test('every valid score maps to the revised band, including every boundary', () => {
  const expected = ['green', 'green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'amber', 'amber', 'amber', 'amber', 'red', 'red', 'red'];
  for (let score = 0; score <= 14; score++) {
    assert.equal(assessmentBand(score).key, expected[score], `score ${score}`);
    for (const type of Object.keys(assessments)) assert.ok(directivesFor(type, expected[score]).length >= 3);
  }
  for (const invalid of [-1, 15, NaN, 2.5]) assert.throws(() => assessmentBand(invalid), RangeError);
});

test('urgent guidance requires clinical escalation and a safe handover', () => {
  for (const type of Object.keys(assessments)) {
    const text = directivesFor(type, 'red').join(' ');
    assert.match(text, /1926/);
    assert.match(text, /do not leave them alone/i);
    assert.match(text, /emergency/);
  }
});
