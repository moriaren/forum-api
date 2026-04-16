import { describe, it, expect, vi } from 'vitest';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrate delete reply correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockReply = {
      id: 'reply-123',
      owner: 'user-123',
    };

    const mockReplyRepository = {
      verifyReplyExists: vi.fn().mockResolvedValue(),
      getReplyById: vi.fn().mockResolvedValue(mockReply),
      deleteReply: vi.fn().mockResolvedValue(),
    };

    const mockCommentRepository = {
      verifyCommentExists: vi.fn().mockResolvedValue(),
    };

    const mockThreadRepository = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
    };

    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute(payload);

    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(payload.threadId);

    expect(mockCommentRepository.verifyCommentExists)
      .toHaveBeenCalledWith(payload.commentId);

    expect(mockReplyRepository.verifyReplyExists)
      .toHaveBeenCalledWith(payload.replyId);

    expect(mockReplyRepository.getReplyById)
      .toHaveBeenCalledWith(payload.replyId);

    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(payload.replyId);

    expect(mockReplyRepository.deleteReply).toHaveBeenCalledTimes(1);
  });

  it('should throw AuthorizationError when user is not owner', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-999',
    };

    const mockReplyRepository = {
      verifyReplyExists: vi.fn().mockResolvedValue(),
      getReplyById: vi.fn().mockResolvedValue({
        id: 'reply-123',
        owner: 'user-123',
      }),
      deleteReply: vi.fn(),
    };

    const mockCommentRepository = {
      verifyCommentExists: vi.fn().mockResolvedValue(),
    };

    const mockThreadRepository = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
    };

    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(useCase.execute(payload))
      .rejects.toThrow(AuthorizationError);

    expect(mockReplyRepository.deleteReply)
      .not.toHaveBeenCalled();
  });
});