import { describe, it, expect } from 'vitest';
import ReplyRepository from '../ReplyRepository.js';

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const repo = new ReplyRepository();

    await expect(repo.addReply({}))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');

    await expect(repo.verifyReplyExists('reply-1'))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');

    await expect(repo.verifyReplyOwner('reply-1', 'user-1'))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');

    await expect(repo.deleteReply('reply-1'))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');

    await expect(repo.getRepliesByCommentIds([]))
      .rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
  });
});