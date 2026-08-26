import assert from 'node:assert/strict';
import test from 'node:test';
import { feetToMeters } from '../src/conversion.js';

test('convertit un pied en 0,3048 mètre', () => {
  assert.equal(feetToMeters(1), 0.3048);
});

test('convertit zéro', () => {
  assert.equal(feetToMeters(0), 0);
});

test('accepte les nombres décimaux et négatifs', () => {
  assert.equal(feetToMeters(-2.5), -0.762);
});

test('refuse une valeur non numérique', () => {
  assert.throws(() => feetToMeters(Number.NaN), TypeError);
  assert.throws(() => feetToMeters('10'), TypeError);
});

