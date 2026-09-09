import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { prismaMock } from '@/shared/testing/prisma.mock.js';
import { makeUsuario } from '@/shared/testing/factories/make-usuario.js';
import bcrypt from 'bcryptjs';
import { signToken, signRefreshToken } from '@/shared/lib/jwt.js';
// Mock external dependencies
vi.mock('bcryptjs', () => ({
    default: {
        compare: vi.fn(),
        hash: vi.fn(),
    },
}));
vi.mock('@/shared/lib/jwt.js', () => ({
    signToken: vi.fn(),
    signRefreshToken: vi.fn(),
}));
vi.mock('@/shared/lib/prisma.js', async () => {
    const { prismaMock } = await import('@/shared/testing/prisma.mock.js');
    return { prisma: prismaMock };
});
describe('AuthService (Unidade)', () => {
    let authService;
    beforeEach(() => {
        authService = new AuthService();
        vi.clearAllMocks();
        prismaMock.user.findUnique.mockResolvedValue(null);
        prismaMock.refreshToken.create.mockResolvedValue({});
    });
    describe('login', () => {
        it('deve realizar o login com sucesso retornando token e refreshToken', async () => {
            const fakeUser = makeUsuario({ email: 'joao@restaurante.com', password: 'hash' });
            prismaMock.user.findUnique.mockResolvedValue(fakeUser);
            vi.mocked(bcrypt.compare).mockResolvedValue(true);
            vi.mocked(signToken).mockReturnValue('access_jwt');
            vi.mocked(signRefreshToken).mockReturnValue('refresh_jwt');
            const result = await authService.login({ email: 'joao@restaurante.com', password: 'senha' });
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'joao@restaurante.com' } });
            expect(result).toEqual({ user: fakeUser, token: 'access_jwt', refreshToken: 'refresh_jwt' });
        });
    });
    describe('logout', () => {
        const plainTextToken = 'a_plain_text_refresh_token';
        const hashedToken = 'a_hashed_refresh_token';
        beforeEach(() => {
            vi.mocked(bcrypt.hash).mockResolvedValue(hashedToken);
            prismaMock.refreshToken.delete.mockResolvedValue({});
        });
        it('deve deletar o refreshToken correspondente e retornar mensagem de sucesso', async () => {
            prismaMock.refreshToken.findMany.mockResolvedValue([
                { id: 1, tokenHash: hashedToken, userId: 1, expiresAt: new Date() },
            ]);
            vi.mocked(bcrypt.compare).mockResolvedValue(true);
            const result = await authService.logout(plainTextToken);
            expect(prismaMock.refreshToken.findMany).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalledWith(plainTextToken, hashedToken);
            expect(prismaMock.refreshToken.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ message: 'Logout realizado com sucesso!' });
        });
        it('não deve deletar nenhum refreshToken se nenhum corresponder', async () => {
            prismaMock.refreshToken.findMany.mockResolvedValue([
                { id: 2, tokenHash: 'another_hashed_token', userId: 1, expiresAt: new Date() },
            ]);
            vi.mocked(bcrypt.compare).mockResolvedValue(false);
            const result = await authService.logout(plainTextToken);
            expect(prismaMock.refreshToken.findMany).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalledWith(plainTextToken, 'another_hashed_token');
            expect(prismaMock.refreshToken.delete).not.toHaveBeenCalled();
            expect(result).toEqual({ message: 'Logout realizado com sucesso!' });
        });
        it('deve retornar mensagem de sucesso mesmo se nenhum refreshToken for encontrado no banco', async () => {
            prismaMock.refreshToken.findMany.mockResolvedValue([]);
            vi.mocked(bcrypt.compare).mockResolvedValue(false);
            const result = await authService.logout(plainTextToken);
            expect(prismaMock.refreshToken.findMany).toHaveBeenCalled();
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(prismaMock.refreshToken.delete).not.toHaveBeenCalled();
            expect(result).toEqual({ message: 'Logout realizado com sucesso!' });
        });
    });
});
