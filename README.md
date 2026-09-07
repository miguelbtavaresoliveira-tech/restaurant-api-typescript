# restaurant-api-typescript
Restaurant API (TypeScript)

![CI Pipeline](https://github.com/miguelbtavaresoliveira-tech/restaurant-api-typescript/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Fastify](https://img.shields.io/badge/Fastify-5.12-black?logo=fastify)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)

**Padrões de Código e Versionamento**
- **Git Flow:** Trabalho isolado por branches (`feat/`, `fix/`, `test/`). Commits diretos na `main` são bloqueados.
- **Conventional Commits:** Mensagens padronizadas e validadas localmente via **Husky** e **Commitlint**.

**Garantia de Qualidade & CI/CD**
- **Validação Estática:** Checagem de tipos com `tsc --noEmit` no pré-commit e no CI.
- **Integração Contínua (CI):** Pipeline no GitHub Actions executando migrations e suíte completa de testes (**Vitest**) em um container **PostgreSQL** dedicado a cada Pull Request.

**Comandos de Teste e Qualidade**
```bash
# Executar verificação de tipos
npm run typecheck

# Executar suíte completa de testes
npm test

# Executar apenas testes unitários ou E2E
npm run test:unit
npm run test:e2e

# Gerar relatório de cobertura
npm run test:cov