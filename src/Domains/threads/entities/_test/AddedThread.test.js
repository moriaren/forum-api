import { describe, it, expect } from 'vitest';
import AddedThread from '../AddedThread.js';

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
    };

    expect(() => new AddedThread(payload))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type not meet specification', () => {
    const payload = {
      id: 123,
      title: 'sebuah thread',
      owner: 'user-123',
    };

    expect(() => new AddedThread(payload))
      .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    const addedThread = new AddedThread(payload);

    expect({ ...addedThread }).toStrictEqual({
      id: payload.id,
      title: payload.title,
      owner: payload.owner,
    });
  });
});