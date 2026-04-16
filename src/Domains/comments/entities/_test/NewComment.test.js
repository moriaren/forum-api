import { describe, it, expect } from 'vitest';
import NewComment from '../NewComment.js';

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'comment',
      owner: 'user-1',
    };

    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type not meet specification', () => {
    const payload = {
      content: 123,
      threadId: 'thread-1',
      owner: 'user-1',
    };

    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when content is empty string', () => {
    const payload = {
      content: '   ',
      threadId: 'thread-1',
      owner: 'user-1',
    };

    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.EMPTY_CONTENT');
  });

  it('should throw error when content exceed limit', () => {
    const payload = {
      content: 'a'.repeat(1001),
      threadId: 'thread-1',
      owner: 'user-1',
    };

    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.CONTENT_LIMIT_CHAR');
  });

  it('should create NewComment object correctly', () => {
    const payload = {
      content: 'comment content',
      threadId: 'thread-1',
      owner: 'user-1',
    };

    const newComment = new NewComment(payload);

    expect({ ...newComment }).toStrictEqual({
      content: payload.content,
      threadId: payload.threadId,
      owner: payload.owner,
    });
  });
});