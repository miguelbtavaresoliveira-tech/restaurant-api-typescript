import { Role } from '@prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    console.error(
        "AVISO: JWT_SECRET não está definido no ambiente. A aplicação não funciná corretamente",
    )
}
const JWT_EXPIRES_IN = '1h'

export function signToken(payload: {id: number, role: Role }): string {
    return jwt.sign(payload, JWT_SECRET!, {
        expiresIn: JWT_EXPIRES_IN,
    })
}

export function signRefreshToken(payload: {id: number, role: Role }) {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET!)
    } catch (err) {
        throw new Error("Token inválido")
    }
}