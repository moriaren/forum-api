import { describe, it, expect } from 'vitest';
import CommentRepository from '../CommentRepository.js';

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const repo = new CommentRepository();

    await expect(repo.addComment({}))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');

    await expect(repo.verifyCommentExists('comment-1'))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');

    await expect(repo.verifyCommentOwner('comment-1', 'user-1'))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');

    await expect(repo.deleteComment('comment-1'))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');

    await expect(repo.getCommentsByThreadId('thread-1'))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
  });
});