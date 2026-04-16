import { describe, it, expect } from 'vitest';
import DetailReply from '../DetailReply.js';

describe('DetailReply entity', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'reply-1',
      username: 'john',
      // date missing
      content: 'reply',
    };

    expect(() => new DetailReply(payload))
      .toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'reply-1',
      username: 'john',
      date: '2024-01-01',
      content: 123, // wrong
      isDelete: false,
    };

    expect(() => new DetailReply(payload))
      .toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply correctly (not deleted)', () => {
    const payload = {
      id: 'reply-1',
      username: 'john',
      date: '2024-01-01',
      content: 'reply',
      isDelete: false,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.content).toBe('reply');
  });

  it('should mask content when reply is deleted', () => {
    const payload = {
      id: 'reply-1',
      username: 'john',
      date: '2024-01-01',
      content: 'reply',
      isDelete: true,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.content)
      .toBe('**balasan telah dihapus**');
  });
});