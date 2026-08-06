import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSharedAppointment } from '../src/services/appointments-service.jsx';

test('buildSharedAppointment adds sharing metadata for other users', () => {
  const appointment = {
    id: 'abc123',
    title: 'Client review',
    description: 'Discuss requirements',
    date: '2026-08-01',
    user_id: 'siva'
  };

  const sharedAppointment = buildSharedAppointment(appointment, 'mani');

  assert.equal(sharedAppointment.title, appointment.title);
  assert.equal(sharedAppointment.sharedBy, 'mani');
  assert.equal(sharedAppointment.user_id, appointment.user_id);
  assert.ok(sharedAppointment.sharedAt);
});
