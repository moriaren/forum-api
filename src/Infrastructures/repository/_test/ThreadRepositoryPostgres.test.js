import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';

import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import pool from '../../database/postgres/pool.js';

describe('ThreadRepositoryPostgres', () => {
  let threadRepository;

  beforeAll(() => {
    threadRepository = new ThreadRepositoryPostgres(pool);
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should persist thread and return added thread', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'user123',
    });

    const newThread = {
      title: 'test thread',
      body: 'isi test',
      owner: 'user-123',
    };

    // Act
    const addedThread = await threadRepository.addThread(newThread);

    // Assert (return value)
    expect(addedThread.id).toBeDefined();
    expect(addedThread.title).toBe(newThread.title);
    expect(addedThread.owner).toBe(newThread.owner);

    // Assert (database)
    const threadFromDb = await ThreadsTableTestHelper.findThreadById(addedThread.id);

    expect(threadFromDb).not.toBeNull();
    expect(threadFromDb.title).toBe(newThread.title);
    expect(threadFromDb.body).toBe(newThread.body);
    expect(threadFromDb.owner).toBe(newThread.owner);
  });

  it('should not throw error when thread exists', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'user123',
    });

    const addedThread = await threadRepository.addThread({
      title: 'thread test',
      body: 'isi',
      owner: 'user-123',
    });

    // Act & Assert
    await expect(
      threadRepository.verifyThreadExists(addedThread.id)
    ).resolves.not.toThrow();
  });

  it('should throw NotFoundError when thread not found', async () => {
    // Act & Assert
    await expect(
      threadRepository.verifyThreadExists('thread-xxx')
    ).rejects.toThrowError('THREAD.NOT_FOUND');
  });

  it('should get thread by id correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'user123',
    });

    const addedThread = await threadRepository.addThread({
      title: 'thread test',
      body: 'isi thread',
      owner: 'user-123',
    });

    // Act
    const thread = await threadRepository.getThreadById(addedThread.id);

    // Assert
    expect(thread.id).toBe(addedThread.id);
    expect(thread.title).toBe('thread test');
    expect(thread.body).toBe('isi thread');
    expect(thread.username).toBe('user123');
    expect(thread.date).toBeDefined();
  });

  it('should throw NotFoundError when getThreadById not found', async () => {
    // Act & Assert
    await expect(
      threadRepository.getThreadById('thread-xxx')
    ).rejects.toThrowError('THREAD.NOT_FOUND');
  });
});