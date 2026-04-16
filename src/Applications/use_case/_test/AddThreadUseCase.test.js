import { describe, it, expect, vi } from 'vitest';
import AddThreadUseCase from '../AddThreadUseCase.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // arrange
    const payload = {
      title: 'sebuah thread',
      body: 'isi thread',
      owner: 'user-123',
    };

    const mockRepoResult = {
      id: 'thread-123',
      title: payload.title,
      owner: payload.owner,
      date: '2024-01-01',
    };

    const expectedResult = {
      id: 'thread-123',
      title: payload.title,
      owner: payload.owner,
    };

    const mockThreadRepository = {
      addThread: vi.fn().mockResolvedValue(mockRepoResult),
    };

    const useCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // act
    const result = await useCase.execute(payload);

    // assert
    expect(mockThreadRepository.addThread)
      .toHaveBeenCalledWith({
        title: payload.title,
        body: payload.body,
        owner: payload.owner,
      });

    expect(mockThreadRepository.addThread)
      .toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(AddedThread);
    expect(result).toMatchObject(expectedResult);
  });
});