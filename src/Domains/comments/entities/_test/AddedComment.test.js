import { describe, it, expect } from 'vitest';
import AddedComment from '../AddedComment.js';

describe('AddedComment entities', () => {
  it('should create AddedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect({ ...addedComment }).toStrictEqual({
      id: payload.id,
      content: payload.content,
      owner: payload.owner,
    });
  });
});