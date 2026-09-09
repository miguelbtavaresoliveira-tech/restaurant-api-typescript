import bcrypt from 'bcryptjs';
import { prisma } from '../../../shared/lib/prisma.js';
import { signToken, signRefreshToken } from '../../../shared/lib/jwt.js';
export class AuthService {
    async login(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error("Usuario não encontrado");
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas");
        }
        const token = signToken({ id: user.id, role: user.role });
        const refreshToken = signRefreshToken({ id: user.id, role: user.role });
        // Save refresh token hash
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        await prisma.refreshToken.create({
            data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        });
        return { user, token, refreshToken };
    }
    async logout(token) {
        // Find the refresh token record that matches the provided token using bcrypt.compare
        const storedTokens = await prisma.refreshToken.findMany();
        for (const stored of storedTokens) {
            const isMatch = await bcrypt.compare(token, stored.tokenHash);
            if (isMatch) {
                await prisma.refreshToken.delete({ where: { id: stored.id } });
                return { message: "Logout realizado com sucesso!" };
            }
        }
        // If no matching token is found, throw an error
        return { message: "Logout realizado com sucesso!" };
    }
}
