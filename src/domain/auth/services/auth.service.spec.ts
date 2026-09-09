import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthService } from './auth.service.js'
import { prismaMock } from '@/shared/testing/prisma.mock.js'
import { makeUsuario } from '@/shared/testing/factories/make-usuario.js'
import bcrypt from 'bcryptjs'
import { signToken, signRefreshToken } from '@/shared/lib/jwt.js'

// Mock external dependencies
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}))

vi.mock('@/shared/lib/jwt.js', () => ({
  signToken: vi.fn(),
  signRefreshToken: vi.fn(),
}))

vi.mock('@/shared/lib/prisma.js', async () => {
  const { prismaMock } = await import('@/shared/testing/prisma.mock.js')
  return { prisma: prismaMock }
})

describe('AuthService (Unidade)', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    vi.clearAllMocks()
    prismaMock.usuario.findUnique.mockResolvedValue(null)
    prismaMock.invalidToken.create.mockResolvedValue({ id: 1, token: 'fake', criadoEm: new Date() })
    prismaMock.refreshToken.create.mockResolvedValue({} as any)
  })

  describe('login', () => {
    it('deve realizar o login com sucesso retornando token e refreshToken', async () => {
      const fakeUser = makeUsuario({ email: 'joao@restaurante.com', senha: 'hash' })
      prismaMock.usuario.findUnique.mockResolvedValue(fakeUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
      vi.mocked(signToken).mockReturnValue('access_jwt')
      vi.mocked(signRefreshToken).mockReturnValue('refresh_jwt')

      const result = await authService.login({ email: 'joao@restaurante.com', password: 'senha' })

      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'joao@restaurante.com' } })
      expect(result).toEqual({ user: fakeUser, token: 'access_jwt', refreshToken: 'refresh_jwt' })
    })
  })

  describe('logout', () => {
    it('deve invalidar o token e retornar mensagem de sucesso', async () => {
      const result = await authService.logout('some_token')
      expect(prismaMock.invalidToken.create).toHaveBeenCalled()
      expect(result).toEqual({ message: 'Logout realizado com sucesso!' })
    })
  })
})
