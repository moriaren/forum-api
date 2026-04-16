import { describe, it, expect, vi } from 'vitest';
import AddReplyUseCase from '../AddReplyUseCase.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';

describe('AddReplyUseCase', () => {
  it('should orchestrate correctly', async () => {
    // arrange
    const payload = {
      content: 'reply test',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockRepoResult = {
      id: 'reply-123',
      content: payload.content,
      owner: payload.owner,
      date: '2024-01-01',
    };

    const expectedResult = {
      id: 'reply-123',
      content: payload.content,
      owner: payload.owner,
    };

    const mockReplyRepo = {
      addReply: vi.fn().mockResolvedValue(mockRepoResult),
    };

    const mockCommentRepo = {
      verifyCommentExists: vi.fn().mockResolvedValue(),
    };

    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
    };

    const useCase = new AddReplyUseCase({
      replyRepository: mockReplyRepo,
      commentRepository: mockCommentRepo,
      threadRepository: mockThreadRepo,
    });

    // act
    const result = await useCase.execute(payload);

    // assert
    expect(mockThreadRepo.verifyThreadExists)
      .toHaveBeenCalledWith(payload.threadId);

    expect(mockCommentRepo.verifyCommentExists)
      .toHaveBeenCalledWith(payload.commentId);

    expect(mockReplyRepo.addReply)
      .toHaveBeenCalledWith(new NewReply({
        content: payload.content,
        commentId: payload.commentId,
        owner: payload.owner,
      }));

    expect(result).toBeInstanceOf(AddedReply);
    expect(result).toMatchObject(expectedResult);
  });

  it('should throw error when comment not found', async () => {
    const payload = {
      content: 'reply test',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockReplyRepo = {
      addReply: vi.fn(),
    };

    const mockCommentRepo = {
      verifyCommentExists: vi.fn().mockRejectedValue(new Error('COMMENT.NOT_FOUND')),
    };

    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
    };

    const useCase = new AddReplyUseCase({
      replyRepository: mockReplyRepo,
      commentRepository: mockCommentRepo,
      threadRepository: mockThreadRepo,
    });

    await expect(useCase.execute(payload))
      .rejects.toThrowError('COMMENT.NOT_FOUND');

    expect(mockReplyRepo.addReply).not.toHaveBeenCalled();
  });
});