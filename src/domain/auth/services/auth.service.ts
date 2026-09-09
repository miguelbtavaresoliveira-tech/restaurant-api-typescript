import bcrypt from 'bcryptjs'
import { prisma } from '../../../shared/lib/prisma.js'
import { signToken, signRefreshToken } from '../../../shared/lib/jwt.js'

export class AuthService {
    async login(data: { email: string, password: string }) {
        const user = await prisma.usuario.findUnique({
            where: { email: data.email },
        })
        if (!user) {
            throw new Error("Usuario não encontrado")
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.senha)
        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas")
        }
        const token = signToken({ id: user.id, role: user.papel })
        const refreshToken = signRefreshToken({ id: user.id, role: user.papel })
        // Save refresh token hash
        const tokenHash = await bcrypt.hash(refreshToken, 10)
        await prisma.refreshToken.create({
            data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        })
        return { user, token, refreshToken }
    }

    async logout(token: string) {
        await prisma.invalidToken.create({
            data: {
                token,
            },
        })
        return { message: "Logout realizado com sucesso!" }
    }
}
