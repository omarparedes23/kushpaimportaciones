import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isAdmin } from './is-admin.ts';

test('sin usuario no es admin', () => {
  assert.equal(isAdmin(null), false);
  assert.equal(isAdmin(undefined), false);
});

test('usuario sin rol no es admin', () => {
  assert.equal(isAdmin({ app_metadata: { provider: 'email' } }), false);
});

test('usuario con app_metadata.role = admin es admin', () => {
  assert.equal(isAdmin({ app_metadata: { role: 'admin', provider: 'email' } }), true);
});

test('otro rol no es admin', () => {
  assert.equal(isAdmin({ app_metadata: { role: 'customer' } }), false);
});

test('role en user_metadata no cuenta (el usuario puede editarlo)', () => {
  const user = { app_metadata: {}, user_metadata: { role: 'admin' } };
  assert.equal(isAdmin(user), false);
});
