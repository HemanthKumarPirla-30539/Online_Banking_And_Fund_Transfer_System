import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePasswordStrength } from './passwordValidation.js';

test('marks short passwords as weak', () => {
  assert.equal(evaluatePasswordStrength('Abc1!').strength, 'weak');
});

test('marks passwords with three character types as medium', () => {
  assert.equal(evaluatePasswordStrength('Password1').strength, 'medium');
});

test('marks fully compliant passwords as strong', () => {
  assert.equal(evaluatePasswordStrength('StrongPass1!').strength, 'strong');
});
