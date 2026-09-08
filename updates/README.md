# Atualização da Migração Prisma

## Visão geral
Esta atualização descreve a migração **refatoration-schema-1.0.0** que versiona o schema Prisma do projeto.

## Migração
- Foi criada a pasta `prisma/migrations/20240908000100_refatoration-schema-1.0.0/` contendo `migration.sql` (arquivo SQL vazio‑ou‑com‑comentário, indicando que nenhuma alteração de modelo foi necessária neste versionamento).
- O comando utilizado foi `npx prisma migrate dev --name refatoration-schema-1.0.0`.

## Docker
- Os containers Docker foram reiniciados (`docker compose down && docker compose up -d`).
- O serviço `database` (PostgreSQL) está rodando e conectado via `DATABASE_URL`.

## Verificação
- Execute `npx prisma db pull` para sincronizar o cliente Prisma.
- Use `npx prisma studio` ou consultas SQL para confirmar que o schema está atualizado.
