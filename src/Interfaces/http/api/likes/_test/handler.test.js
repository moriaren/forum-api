import { describe, it, expect, vi } from 'vitest';
import LikeCommentHandler from '../handler.js';

describe('LikeCommentHandler', () => {
  it('should return 401 when authentication missing', async () => {
    // Arrange
    const mockContainer = {
      getInstance: vi.fn(),
    };

    const handler = new LikeCommentHandler(mockContainer);

    const req = {
      auth: null,
      params: {
        threadId: 'thread-1',
        commentId: 'comment-1',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    // Act
    await handler.putLikeCommentHandler(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Missing authentication',
    });
  });

  it('should orchestrate toggle like comment correctly', async () => {
    // Arrange
    const mockUseCase = {
      execute: vi.fn(),
    };

    const mockContainer = {
      getInstance: vi.fn(() => mockUseCase),
    };

    const handler = new LikeCommentHandler(mockContainer);

    const req = {
      auth: {
        credentials: {
          id: 'user-1',
        },
      },
      params: {
        threadId: 'thread-1',
        commentId: 'comment-1',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    // Act
    await handler.putLikeCommentHandler(req, res, next);

    // Assert
    expect(mockContainer.getInstance)
      .toHaveBeenCalledWith('ToggleLikeCommentUseCase');

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-1',
      threadId: 'thread-1',
      commentId: 'comment-1',
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
    });
  });

  it('should call next when error occurs', async () => {
    // Arrange
    const mockError = new Error('unexpected');

    const mockUseCase = {
      execute: vi.fn(() => {
        throw mockError;
      }),
    };

    const mockContainer = {
      getInstance: vi.fn(() => mockUseCase),
    };

    const handler = new LikeCommentHandler(mockContainer);

    const req = {
      auth: {
        credentials: {
          id: 'user-1',
        },
      },
      params: {
        threadId: 'thread-1',
        commentId: 'comment-1',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    // Act
    await handler.putLikeCommentHandler(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(mockError);
  });
});