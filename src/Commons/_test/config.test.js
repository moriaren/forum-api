import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('config', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should use localhost when not production', async () => {
    process.env.NODE_ENV = 'development';

    const config = (await import('../config.js')).default;

    expect(config.app.host).toBe('localhost');
  });

  it('should use 0.0.0.0 when production', async () => {
    process.env.NODE_ENV = 'production';

    const config = (await import('../config.js')).default;

    expect(config.app.host).toBe('0.0.0.0');
  });

  it('should enable debug when development', async () => {
    process.env.NODE_ENV = 'development';

    const config = (await import('../config.js')).default;

    expect(config.app.debug).toEqual({ request: ['error'] });
  });

  it('should disable debug when not development', async () => {
    process.env.NODE_ENV = 'production';

    const config = (await import('../config.js')).default;

    expect(config.app.debug).toEqual({});
  });
});