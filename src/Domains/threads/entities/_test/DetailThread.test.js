import { describe, it, expect } from 'vitest';
import DetailThread from '../DetailThread.js';

describe('DetailThread entity', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-1',
      title: 'title',
      // body missing
      date: '2024-01-01',
      username: 'john',
      comments: [],
    };

    expect(() => new DetailThread(payload))
      .toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 123, // wrong type
      title: 'title',
      body: 'body',
      date: '2024-01-01',
      username: 'john',
      comments: [],
    };

    expect(() => new DetailThread(payload))
      .toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    const payload = {
      id: 'thread-1',
      title: 'title',
      body: 'body',
      date: '2024-01-01',
      username: 'john',
      comments: [],
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toBe(payload.id);
    expect(detailThread.title).toBe(payload.title);
    expect(detailThread.body).toBe(payload.body);
    expect(detailThread.date).toBe(payload.date);
    expect(detailThread.username).toBe(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});