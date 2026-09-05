# restaurant-api-typescript
Restaurant API (TypeScript)

![CI Status](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)

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