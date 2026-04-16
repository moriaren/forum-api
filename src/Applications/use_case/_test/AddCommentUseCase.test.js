import { describe, it, expect, vi } from 'vitest';
import AddCommentUseCase from '../AddCommentUseCase.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';

describe('AddCommentUseCase', () => {
  it('should orchestrate correctly', async () => {
    // arrange
    const payload = {
      content: 'comment content',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockAddedComment = {
      id: 'comment-123',
      content: payload.content,
      owner: payload.owner,
      date: '2024-01-01',
    };

    const expectedResult = {
      id: 'comment-123',
      content: payload.content,
      owner: payload.owner,
    };

    const mockCommentRepository = {
      addComment: vi.fn().mockResolvedValue(mockAddedComment),
    };

    const mockThreadRepository = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
    };

    const useCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // act
    const result = await useCase.execute(payload);

    // assert
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(payload.threadId);

    expect(mockCommentRepository.addComment)
      .toHaveBeenCalledWith(new NewComment(payload));

    expect(result).toBeInstanceOf(AddedComment);

    expect(result).toMatchObject(expectedResult);
  });

  it('should throw error when thread not found', async () => {
    // arrange
    const payload = {
      content: 'comment content',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockCommentRepository = {
      addComment: vi.fn(),
    };

    const mockThreadRepository = {
      verifyThreadExists: vi.fn()
        .mockRejectedValue(new Error('THREAD.NOT_FOUND')),
    };

    const useCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // act & assert
    await expect(useCase.execute(payload))
      .rejects.toThrowError('THREAD.NOT_FOUND');

    expect(mockCommentRepository.addComment)
      .not.toHaveBeenCalled();
  });
});