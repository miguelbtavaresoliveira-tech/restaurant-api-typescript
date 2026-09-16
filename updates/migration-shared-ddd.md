# Migração do shared/ para DDD

Seu zip trazia dois conjuntos de arquivos misturados: os que eu tinha gerado
antes (placeholders, porque eu não tinha visto o shared/ real ainda) e os
seus arquivos reais de produção. Usei sempre os **reais** como fonte da
verdade e organizei tudo por responsabilidade. Nada de lógica foi inventado
aqui — só reorganização de pastas e ajuste de imports.

## Mapa: caminho antigo → novo

| Antes | Depois |
|---|---|
| `shared/lib/prisma.ts` | `shared/infrastructure/database/prisma.ts` |
| `shared/lib/jwt.ts` | `shared/infrastructure/security/jwt.ts` |
| `shared/lib/mailer.ts` | `shared/infrastructure/mail/mailer.ts` |
| `shared/middlewares/authenticate.ts` | `shared/http/middlewares/authenticate.ts` |
| `shared/middlewares/authorization.ts` | `shared/http/middlewares/authorize.ts` |
| `shared/middlewares/validate.middleware.ts` | `shared/http/middlewares/validate.middleware.ts` |
| `shared/utils/errors/formatZodErrors.ts` | `shared/http/errors/formatZodErrors.ts` |
| `shared/jobs/*` | `shared/jobs/*` (só ajustei os imports) |
| `shared/testing/*` | `shared/testing/*` (só ajustei os imports) |
| `shared/types/fastify.d.ts` | `shared/types/fastify.d.ts` (sem mudança) |
| `shared/domain/*` | `shared/domain/*` (sem mudança — já estava certo) |

**Removidos** (eram os meus placeholders da entrega anterior, agora substituídos
pelos arquivos reais equivalentes acima): `shared/infrastructure/database/prisma.ts`
antigo (versão sem singleton), `shared/http/middlewares/authenticate.ts` e
`validate.middleware.ts` antigos, `shared/http/formatZodErrors.ts` antigo.

## ⚠️ Inconsistência importante encontrada com o módulo `identity`

Ao ver seu `shared/` real, descobri que **`role` é um valor único por
usuário** (`Role` — não `Role[]`):

- `shared/lib/jwt.ts`: `signToken(payload: { id: number, role: Role })`
- `shared/middlewares/authorization.ts`: `request.user?.role` (singular)
- `shared/types/fastify.d.ts`: `user?: { id: string, role: Role }`
- `shared/testing/factories/make-usuario.ts`: `role: Role.CUSTOMER` (um valor só)

Isso **contradiz** o módulo `identity` que te entreguei antes, onde modelei
`Roles` como um array (`Roles` value object com `values: RoleName[]`),
seguindo o `createUserSchema` original que tinha `role: z.array(RoleEnum)`.

Ou seja: o schema de validação (`user.schema.ts`) dizia "array", mas o resto
do código real (JWT, autorização, factory, tipo do Fastify) sempre tratou
como valor único. Antes de continuar para os próximos módulos, recomendo
decidir qual é a regra certa:

- Se for **um único role por usuário** (o que os 4 arquivos acima sugerem):
  ajustamos `identity` para usar um value object `Role` simples em vez de
  `Roles` (array), e o `createUserSchema` original tinha um bug.
- Se for **múltiplos roles por usuário** (ex.: um garçom que também é
  admin): o `schema.prisma`, o JWT, o middleware de autorização e a factory
  de teste precisam mudar para trabalhar com array.

Me avise qual das duas é a intenção e eu ajusto o `identity` pra bater com o
`shared` na próxima rodada.

Também ajustei o `JwtProvider` do módulo `identity` — no seu `jwt.ts` real
**access token e refresh token usam o mesmo segredo** (`JWT_SECRET`), sem um
segredo separado para reset de senha. O `JwtProvider` que te entreguei tinha
inventado `JWT_REFRESH_SECRET` e `JWT_RESET_SECRET` separados — vale
alinhar isso também quando ajustarmos o `identity`.
