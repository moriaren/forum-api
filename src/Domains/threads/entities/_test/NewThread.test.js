import { describe, it, expect } from 'vitest';
import NewThread from '../NewThread.js';

describe('NewThread entity', () => {
  it('should create NewThread correctly with valid payload', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'isi thread',
      owner: 'user-123',
    };

    const thread = new NewThread(payload);

    expect(thread.title).toBe(payload.title);
    expect(thread.body).toBe(payload.body);
    expect(thread.owner).toBe(payload.owner);
  });

  it('should throw error when payload missing properties', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'isi thread',
    };

    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload has invalid data type', () => {
    const payload = {
      title: 123, // invalid
      body: 'isi thread',
      owner: 'user-123',
    };

    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
});