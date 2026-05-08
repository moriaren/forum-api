import { describe, it, expect, vi } from 'vitest';
import GetThreadDetailHandler from '../GetThreadDetailHandler.js';

describe('GetThreadDetailHandler', () => {
  it('should return thread detail correctly', async () => {
    // Arrange
    const mockThread = {
      id: 'thread-1',
      title: 'thread',
    };

    const mockUseCase = {
      execute: vi.fn(() => Promise.resolve(mockThread)),
    };

    const handler = new GetThreadDetailHandler({
      getThreadDetailUseCase: mockUseCase,
    });

    const req = {
      params: {
        threadId: 'thread-1',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    // Act
    await handler.getThreadDetailHandler(req, res, next);

    // Assert
    expect(mockUseCase.execute)
      .toHaveBeenCalledWith('thread-1');

    expect(res.status)
      .toHaveBeenCalledWith(200);

    expect(res.json)
      .toHaveBeenCalledWith({
        status: 'success',
        data: {
          thread: mockThread,
        },
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

    const handler = new GetThreadDetailHandler({
      getThreadDetailUseCase: mockUseCase,
    });

    const req = {
      params: {
        threadId: 'thread-1',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    // Act
    await handler.getThreadDetailHandler(req, res, next);

    // Assert
    expect(next)
      .toHaveBeenCalledWith(mockError);
  });
});