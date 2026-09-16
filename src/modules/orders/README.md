# Módulo: orders

Estrutura preparada (domain/application/infrastructure/presentation), mas as
classes ainda não foram implementadas — este módulo não existia no zip
enviado (só havia `user` e `auth`).

Models previstos: Order, OrderItem

Pastas já criadas: domain/entities, application/use-cases, infrastructure/database, presentation/http.
Siga o mesmo padrão usado em `src/modules/identity`:
entidade estende AggregateRoot/Entity (src/shared/domain), regras de negócio
ficam nos métodos da entidade, repositório é uma interface no domain e
implementado com Prisma na infrastructure, use cases orquestram tudo e o
controller só faz parse de HTTP + chama o use case.

## Regras de negócio já definidas (aplicar na entidade Order/OrderItem)
- Estados do pedido são fixos (não configuráveis) — bom candidato a um
  value object OrderStatus com transições válidas explícitas.
- Cada OrderItem deve congelar o preço no momento do pedido (campo unitPrice),
  independente de o preço do produto mudar depois no catalog.
