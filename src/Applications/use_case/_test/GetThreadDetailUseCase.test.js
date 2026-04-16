import { describe, it, expect, vi } from 'vitest';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate thread detail with nested replies correctly', async () => {
    // arrange
    const threadId = 'thread-1';

    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
      getThreadById: vi.fn().mockResolvedValue({
        id: threadId,
        title: 'title',
        body: 'body',
        date: new Date().toISOString(),
        username: 'john',
      }),
    };

    const mockCommentRepo = {
      getCommentsByThreadId: vi.fn().mockResolvedValue([
        {
          id: 'comment-1',
          content: 'comment 1',
          date: new Date().toISOString(),
          username: 'john',
          // eslint-disable-next-line camelcase
          is_delete: false,
        },
        {
          id: 'comment-2',
          content: 'comment 2',
          date: new Date().toISOString(),
          username: 'doe',
          // eslint-disable-next-line camelcase
          is_delete: true,
        },
      ]),
    };

    const mockReplyRepo = {
      getRepliesByCommentIds: vi.fn().mockResolvedValue([
        {
          id: 'reply-1',
          content: 'reply 1',
          date: new Date().toISOString(),
          username: 'jane',
          // eslint-disable-next-line camelcase
          is_delete: false,
          commentId: 'comment-1',
        },
        {
          id: 'reply-2',
          content: 'reply 2',
          date: new Date().toISOString(),
          username: 'jack',
          // eslint-disable-next-line camelcase
          is_delete: true,
          commentId: 'comment-1',
        },
      ]),
    };

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    // act
    const result = await useCase.execute(threadId);

    const normalized = JSON.parse(JSON.stringify(result));

    // assert mock verification
    expect(mockThreadRepo.verifyThreadExists)
      .toHaveBeenCalledWith(threadId);

    expect(mockThreadRepo.getThreadById)
      .toHaveBeenCalledWith(threadId);

    expect(mockCommentRepo.getCommentsByThreadId)
      .toHaveBeenCalledWith(threadId);

    expect(mockReplyRepo.getRepliesByCommentIds)
      .toHaveBeenCalledWith(['comment-1', 'comment-2']);

    // assert result
    expect(normalized).toStrictEqual({
      id: threadId,
      title: 'title',
      body: 'body',
      date: normalized.date,
      username: 'john',
      comments: [
        {
          id: 'comment-1',
          username: 'john',
          date: normalized.comments[0].date,
          content: 'comment 1',
          replies: [
            {
              id: 'reply-1',
              username: 'jane',
              date: normalized.comments[0].replies[0].date,
              content: 'reply 1',
            },
            {
              id: 'reply-2',
              username: 'jack',
              date: normalized.comments[0].replies[1].date,
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'doe',
          date: normalized.comments[1].date,
          content: '**komentar telah dihapus**',
          replies: [],
        },
      ],
    });
  });
});