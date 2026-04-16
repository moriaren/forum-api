import { describe, it, expect } from 'vitest';
import NewReply from '../NewReply.js';

describe('NewReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'reply',
      owner: 'user-1',
    };

    expect(() => new NewReply(payload))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type not meet specification', () => {
    const payload = {
      content: 123,
      commentId: 'comment-1',
      owner: 'user-1',
    };

    expect(() => new NewReply(payload))
      .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when content is empty string', () => {
    const payload = {
      content: '   ',
      commentId: 'comment-1',
      owner: 'user-1',
    };

    expect(() => new NewReply(payload))
      .toThrowError('NEW_REPLY.EMPTY_CONTENT');
  });

  it('should create NewReply object correctly', () => {
    const payload = {
      content: 'reply content',
      commentId: 'comment-1',
      owner: 'user-1',
    };

    const newReply = new NewReply(payload);

    expect({ ...newReply }).toStrictEqual({
      content: payload.content,
      commentId: payload.commentId,
      owner: payload.owner,
    });
  });
});