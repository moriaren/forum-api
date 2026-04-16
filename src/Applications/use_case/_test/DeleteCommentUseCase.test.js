import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('DeleteCommentUseCase', () => {
  let mockCommentRepository;
  let mockThreadRepository;
  let useCase;

  const payload = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    owner: 'user-123',
  };

  beforeEach(() => {
    mockCommentRepository = {
      verifyCommentExists: vi.fn().mockResolvedValue(),
      getCommentOwner: vi.fn().mockResolvedValue('user-123'),
      deleteComment: vi.fn().mockResolvedValue(),
    };

    mockThreadRepository = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
    };

    useCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
  });

  it('should orchestrate delete comment correctly', async () => {
    await useCase.execute(payload);

    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(payload.threadId);

    expect(mockCommentRepository.verifyCommentExists)
      .toHaveBeenCalledWith(payload.commentId);

    expect(mockCommentRepository.getCommentOwner)
      .toHaveBeenCalledWith(payload.commentId);

    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(payload.commentId);

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledTimes(1);
  });

  it('should throw AuthorizationError when user is not owner', async () => {
    mockCommentRepository.getCommentOwner.mockResolvedValue('other-user');

    await expect(useCase.execute(payload))
      .rejects
      .toThrow(AuthorizationError);

    expect(mockCommentRepository.deleteComment)
      .not.toHaveBeenCalled();
  });
});