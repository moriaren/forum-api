import { describe, it, expect } from 'vitest';
import AddedReply from '../AddedReply.js';

describe('AddedReply entities', () => {
  it('should create AddedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      owner: 'user-123',
    };

    const addedReply = new AddedReply(payload);

    expect({ ...addedReply }).toStrictEqual({
      id: payload.id,
      content: payload.content,
      owner: payload.owner,
    });
  });
});