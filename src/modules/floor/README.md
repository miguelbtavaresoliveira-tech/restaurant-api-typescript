# Módulo: floor

Estrutura preparada (domain/application/infrastructure/presentation), mas as
classes ainda não foram implementadas — este módulo não existia no zip
enviado (só havia `user` e `auth`).

Models previstos: Table, Reservation

Pastas já criadas: domain/entities, application/use-cases, infrastructure/database, presentation/http.
Siga o mesmo padrão usado em `src/modules/identity`:
entidade estende AggregateRoot/Entity (src/shared/domain), regras de negócio
ficam nos métodos da entidade, repositório é uma interface no domain e
implementado com Prisma na infrastructure, use cases orquestram tudo e o
controller só faz parse de HTTP + chama o use case.
