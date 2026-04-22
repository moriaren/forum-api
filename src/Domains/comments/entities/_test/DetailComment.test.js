import { describe, it, expect } from 'vitest';
import DetailComment from '../DetailComment.js';

describe('DetailComment entity', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-1',
      username: 'john',
      date: '2024-01-01',

      replies: [],
    };

    expect(() => new DetailComment(payload))
      .toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'comment-1',
      username: 'john',
      date: '2024-01-01',
      content: 'comment',
      isDelete: false,
      likeCount: 0,
      replies: 'not-array',
    };

    expect(() => new DetailComment(payload))
      .toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment correctly (not deleted)', () => {
    const payload = {
      id: 'comment-1',
      username: 'john',
      date: '2024-01-01',
      content: 'comment',
      isDelete: false,
      likeCount: 0,
      replies: [],
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.content).toBe('comment');
    expect(detailComment.replies).toEqual([]);
  });

  it('should mask content when comment is deleted', () => {
    const payload = {
      id: 'comment-1',
      username: 'john',
      date: '2024-01-01',
      content: 'comment',
      isDelete: true,
      likeCount: 0,
      replies: [],
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.content)
      .toBe('**komentar telah dihapus**');
  });

  it('should throw error when likeCount is not number', () => {
    const payload = {
      id: 'comment-1',
      username: 'john',
      date: '2024-01-01',
      content: 'comment',
      isDelete: false,
      likeCount: '2',
      replies: [],
    };

    expect(() => new DetailComment(payload))
      .toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});