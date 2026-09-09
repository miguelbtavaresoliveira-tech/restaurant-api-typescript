import bcrypt from 'bcryptjs'
import { prisma } from '../../../shared/lib/prisma.js'
import { signToken, signRefreshToken, verifyToken } from '../../../shared/lib/jwt.js'

export class AuthService {
    async resetPassword(token: string, newPassword: string) {
        // Placeholder implementation for password reset.
        // In a real implementation, verify the token, locate the user, and update the password.
        // Here we simply simulate a successful operation.
        return { message: 'Password reset successful' };
    }
    async login(data: { email: string, password: string }) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        })
        if (!user) {
            throw new Error("Usuario não encontrado")
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password)
        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas")
        }
        const token = signToken({ id: user.id, role: user.role })
        const refreshToken = signRefreshToken({ id: user.id, role: user.role })
        // Save refresh token hash
        const tokenHash = await bcrypt.hash(refreshToken, 10)
        await prisma.refreshToken.create({
            data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        })
        return { user, token, refreshToken }
    }

    async logout(token: string) {
        // Verify token using JWT verification to ensure it is well‑formed
        try {
            verifyToken(token)
        } catch (e) {
            // If token is invalid we still return success (nothing to delete)
            return { message: "Logout realizado com sucesso!" }
        }
        // Retrieve all stored refresh tokens and delete the matching one
        const storedTokens = await prisma.refreshToken.findMany()
        for (const stored of storedTokens) {
            const isMatch = await bcrypt.compare(token, stored.tokenHash)
            if (isMatch) {
                await prisma.refreshToken.delete({ where: { id: stored.id } })
                break
            }
        }
        return { message: "Logout realizado com sucesso!" }
    }
}
