import { describe, it, expect, vi } from 'vitest';
import ToggleLikeCommentUseCase from '../ToggleLikeCommentUseCase.js';

describe('ToggleLikeCommentUseCase', () => {
  it('should add like when not yet liked', async () => {
    const mockLikeRepo = {
      verifyLike: vi.fn().mockResolvedValue(false),
      addLike: vi.fn(),
      deleteLike: vi.fn(),
    };

    const mockCommentRepo = {
      verifyCommentExists: vi.fn(),
    };

    const mockThreadRepo = {
      verifyThreadExists: vi.fn(),
    };

    const useCase = new ToggleLikeCommentUseCase({
      userCommentLikeRepository: mockLikeRepo,
      commentRepository: mockCommentRepo,
      threadRepository: mockThreadRepo,
    });

    await useCase.execute({
      userId: 'user-1',
      threadId: 'thread-1',
      commentId: 'comment-1',
    });

    expect(mockThreadRepo.verifyThreadExists)
      .toHaveBeenCalledWith('thread-1');

    expect(mockCommentRepo.verifyCommentExists)
      .toHaveBeenCalledWith('comment-1');

    expect(mockLikeRepo.verifyLike)
      .toHaveBeenCalledWith('user-1', 'comment-1');

    expect(mockLikeRepo.addLike)
      .toHaveBeenCalledWith('user-1', 'comment-1');

    expect(mockLikeRepo.deleteLike)
      .not.toHaveBeenCalled();
  });

  it('should delete like when already liked', async () => {
    const mockLikeRepo = {
      verifyLike: vi.fn().mockResolvedValue(true),
      addLike: vi.fn(),
      deleteLike: vi.fn(),
    };

    const mockCommentRepo = {
      verifyCommentExists: vi.fn(),
    };

    const mockThreadRepo = {
      verifyThreadExists: vi.fn(),
    };

    const useCase = new ToggleLikeCommentUseCase({
      userCommentLikeRepository: mockLikeRepo,
      commentRepository: mockCommentRepo,
      threadRepository: mockThreadRepo,
    });

    await useCase.execute({
      userId: 'user-1',
      threadId: 'thread-1',
      commentId: 'comment-1',
    });

    expect(mockLikeRepo.deleteLike)
      .toHaveBeenCalledWith('user-1', 'comment-1');

    expect(mockLikeRepo.addLike)
      .not.toHaveBeenCalled();
  });
});