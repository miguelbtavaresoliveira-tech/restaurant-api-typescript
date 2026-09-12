import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserController } from '../controller/user.controller.js';
import { FastifyRequest, FastifyReply } from 'fastify';

const userController = new UserController()

describe('User Controller', () => {
  // Mock reply
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  } as unknown as FastifyReply;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a user (placeholder)', async () => {
    const request = {} as FastifyRequest;
    await userController.create(request, reply);
    expect(reply.status).toHaveBeenCalledWith(201);
  });
});
