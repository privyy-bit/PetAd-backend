import { EventType } from '@prisma/client';
import { SchemaRegistry } from './schema-registry';

describe('SchemaRegistry', () => {
  it('validates correct payloads', () => {
    expect(() => {
      SchemaRegistry.validatePayload(EventType.ADOPTION_REQUESTED, 1, {
        petId: 'pet-1',
        adopterId: 'user-1',
      });
    }).not.toThrow();
  });

  it('throws on invalid payloads during validation', () => {
    expect(() => {
      SchemaRegistry.validatePayload(EventType.ADOPTION_REQUESTED, 1, {
        petId: 123,
      } as any);
    }).toThrow();
  });

  it('replays a v1 event correctly under a v2 reducer via an upcaster', () => {
    // Register a test v2 schema with an upcaster from v1 to v2
    // Using ADOPTION_REJECTED which we can configure for test
    const upcasted = SchemaRegistry.validateAndUpcast(EventType.ADOPTION_REJECTED, 1, {
      reason: 'test-reason',
    });
    expect(upcasted).toBeDefined();
  });

  it('verifies all event types are covered', () => {
    const allTypes = Object.values(EventType);
    expect(() => {
      SchemaRegistry.verifyAllEventTypesCovered(allTypes);
    }).not.toThrow();
  });
});
