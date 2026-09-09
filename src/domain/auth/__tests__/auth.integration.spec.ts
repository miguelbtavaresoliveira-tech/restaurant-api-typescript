import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { AuthService } from '../services/auth.service.js'
import { prisma } from '../../../shared/lib/prisma.js'
import { makeUsuario } from '../../../shared/testing/factories/make-usuario.ts'
import bcrypt from 'bcryptjs'

describe.skip('AuthService (Integração)', () => {
  let authService: AuthService

  beforeEach(async () => {
    authService = new AuthService()

    // Limpa tabelas relevantes antes de cada teste
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    // Limpeza final do banco após rodar a suíte
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  it('deve realizar login salvando e buscando dados reais no PostgreSQL', async () => {
    const rawPassword = 'senha_secreta_123'
    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    const usuarioFake = makeUsuario({
      email: 'integracao@restaurante.com',
      password: hashedPassword,
    })

    const usuarioNoBanco = await prisma.user.create({
      data: usuarioFake,
    })

    const result = await authService.login({
      email: 'integracao@restaurante.com',
      password: rawPassword,
    })

    expect(result.user.id).toBe(usuarioNoBanco.id)
    expect(result.user.email).toBe('integracao@restaurante.com')
    expect(result.token).toBeDefined()
    expect(result.refreshToken).toBeDefined()
  })

  it('deve deletar o RefreshToken correspondente ao fazer logout', async () => {
    // Cria usuário e realiza login para gerar refresh token
    const rawPassword = 'senha123'
    const hashedPassword = await bcrypt.hash(rawPassword, 10)
    const usuario = await prisma.user.create({
      data: makeUsuario({ email: 'logout@restaurante.com', password: hashedPassword }),
    })

    const loginResult = await authService.login({
      email: 'logout@restaurante.com',
      password: rawPassword,
    })

    // Verifica que o refresh token foi armazenado
    const storedTokensBefore = await prisma.refreshToken.findMany({ where: { userId: usuario.id } })
    expect(storedTokensBefore.length).toBeGreaterThan(0)

    // Executa logout com o refresh token retornado
    const logoutResult = await authService.logout(loginResult.refreshToken)
    expect(logoutResult).toEqual({ message: 'Logout realizado com sucesso!' })

    // Confirma que o refresh token foi removido
    const storedTokensAfter = await prisma.refreshToken.findMany({ where: { userId: usuario.id } })
    expect(storedTokensAfter.length).toBe(0)
  })
})