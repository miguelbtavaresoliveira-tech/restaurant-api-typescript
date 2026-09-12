import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../service/user.service.js';

describe('User Service', () => {
  const service = new UserService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a user (placeholder)', async () => {
    // placeholder test
    await service.createUser({});
    expect(true).toBe(true);
  });
});
