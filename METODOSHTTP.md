# Especificação do Sistema de Comandas / PDV

> Documento consolidado: especificação original + complementos sugeridos (endpoints, regras e entidades adicionais).
> Itens marcados com **[NOVO]** são complementos que não estavam na especificação original.

---

## 1. Autenticação e Usuários

### Endpoints originais
- **POST /auth/login** — Público (Rate Limited). Valida e-mail e senha de funcionários cadastrados (ADMIN, WAITER). Armazena o Refresh Token exclusivamente como hash (`tokenHash`) no banco de dados. `[RF02, RNF01]`
- **POST /auth/refresh** — Público. Valida e rotaciona o Refresh Token hash no banco de dados. `[RF02, RNF01]`
- **GET /users** — ADMIN. Lista todos os usuários/funcionários cadastrados no sistema para gestão e auditoria. `[RF01, RNF02]`
- **POST /users** — ADMIN. Exclusivo para o Administrador cadastrar novos usuários (funcionários do estabelecimento, com foco principal nos garçons WAITER e administradores ADMIN). A cozinha opera via painel/terminal sem necessidade de contas individuais de usuário. `[RF01, RNF02, RNF05]`
- **PATCH /users/:id/deactivate** — ADMIN. Altera `isActive = false` para desativação lógica do funcionário, mantendo o histórico de auditoria e operacional intacto. Exclui tokens ativos vinculados em cascata. `[RF03, RNF08]`
- **POST /auth/logout** — revoga o Refresh Token (invalida o hash no banco).
- **GET /users/:id** — detalhe de um usuário específico.
- **PATCH /users/:id** — editar dados (nome, e-mail, role).
- **PATCH /users/:id/reactivate** — reverter a desativação lógica.
- **PATCH /users/:id/password** — alterar senha (própria ou reset pelo ADMIN).

### Regras complementares **[NOVO]**
- Bloqueio temporário após N tentativas de login falhas (mitigar brute-force, complementando o Rate Limited de RNF01).
- Rate limiting também em `/auth/refresh`, não só no login.
- Log de auditoria em tentativas de login (sucesso/falha).

---

## 2. Mesas e Reservas

### Endpoints originais
- **POST /tables** — ADMIN. Cadastra nova mesa no estabelecimento garantindo a unicidade do número. `[RF04, RNF05]`
- **PATCH /tables/:id/status** — WAITER, ADMIN. Atualiza o status da mesa (AVAILABLE, OCCUPIED, RESERVED).
  - **Restrição:** A transição manual para AVAILABLE é bloqueada caso existam comandas atreladas à mesa com status diferente de CLOSED. `[RF04, Regra A]`
- **POST /reservations** — WAITER, ADMIN. Registra reserva armazenando nome, telefone do cliente, quantidade de pessoas e data/hora agendada. `[RF05]`
- **PATCH /reservations/:id/cancel** — WAITER, ADMIN. Cancela a reserva de uma mesa. `[RF05]`

### Endpoints complementares **[NOVO]**
- **GET /tables** e **GET /tables/:id** — listagem/consulta (essencial para o painel visual do salão).
- **PATCH /tables/:id** — editar capacidade/número da mesa.
- **GET /reservations** e **GET /reservations/:id**.
- **PATCH /reservations/:id** — reagendar/editar dados da reserva.

### Regras complementares **[NOVO]**
- Reserva deveria mudar o status da mesa para `RESERVED` automaticamente (hoje só a abertura de comanda altera status para `OCCUPIED`).
- Validação de capacidade: quantidade de pessoas da reserva vs. capacidade da mesa.
- Prevenção de conflito de horário (duas reservas na mesma mesa em horários que se sobrepõem).
- Status de reserva além de "cancelada": `CONFIRMED`, `NO_SHOW`, `COMPLETED` — e regra de expiração automática (no-show após X minutos de atraso).

---

## 3. Comandas

### Endpoints originais
- **POST /comandas** — WAITER, ADMIN. Abertura de comanda vinculada a uma `tableId`. Altera automaticamente o status da mesa para OCCUPIED. `[RF06, Regra A]`
- **PATCH /comandas/:id/service-charge** — WAITER, ADMIN. Atualiza o percentual da taxa de serviço armazenado estritamente como `Decimal`. `[RF07, RNF03]`
- **PATCH /comandas/:id/close** — WAITER, ADMIN. Executado dentro de uma transação atômica (`prisma.$transaction`). Valida se a soma dos pagamentos com status COMPLETED cobre o total de consumo. Altera o status da comanda para CLOSED.
  - **Liberação Automática da Mesa:** Se todas as comandas da mesa estiverem no status CLOSED, o status da mesa altera automaticamente para AVAILABLE. `[RF06, Regra A, RNF03]`

### Endpoints complementares **[NOVO]**
- **GET /comandas** e **GET /comandas/:id** — listagem e detalhe (com itens e pagamentos).
- **PATCH /comandas/:id/cancel** — cancelar comanda sem consumo/pagamento.
- **POST /comandas/:id/transfer** — transferir comanda entre mesas (comum quando o cliente troca de lugar).

### Regras complementares **[NOVO]**
- Como "todas as comandas da mesa" é mencionado na especificação original, o sistema parece suportar múltiplas comandas simultâneas por mesa (ex.: divisão por pessoa) — vale documentar explicitamente essa regra e um endpoint de split/merge de comandas.
- Campo de desconto na comanda (percentual ou valor fixo) e quem autorizou (rastreabilidade).

---

## 4. Cardápio

### Endpoints originais
- **POST /categories** — ADMIN. Cria nova categoria de produtos garantindo nome único no banco de dados. `[RF08, RNF05]`
- **POST /products** — ADMIN. Cadastra produto informando nome, descrição, disponibilidade (`isAvailable`) e preço persistido no tipo `Decimal`. `[RF09, RNF03]`
- **PATCH /products/:id** — ADMIN. Atualiza dados ou preço do produto no cardápio.
  - **Restrição:** Alterações de preços no cardápio não alteram retroativamente o `unitPrice` de itens gravados em pedidos anteriores ou em comandas abertas. `[RF09, Regra C, RNF04]`

### Endpoints complementares **[NOVO]**
- **GET /categories**, **PATCH /categories/:id**, exclusão lógica de categoria.
- **GET /products** (com filtro por categoria/disponibilidade) e **GET /products/:id**.
- Exclusão lógica de produto (`isAvailable = false` via endpoint dedicado, não só PATCH genérico).

### Regras complementares **[NOVO]**
- Upload de imagem do produto.
- Modificadores/variações (tamanho, ponto da carne, adicionais) — se aplicável ao negócio.
- Tempo de preparo estimado, alérgenos.

---

## 5. Pedidos

### Endpoints originais
- **POST /orders** — WAITER, ADMIN. Lança pedido vinculado a uma comanda e grava o `waiterId` do garçom responsável. O preço unitário do produto é copiado atomicamente para `OrderItem.unitPrice` (`Decimal` imutável). Notifica o painel da cozinha em tempo real via WebSocket (PENDING). `[RF10, RF12, Regra B, Regra C, RNF03, RNF04]`
- **PATCH /orders/:id/status** — WAITER, ADMIN (ou chave/token de terminal da cozinha). Transiciona o status do pedido (PENDING → IN_PREPARATION → READY → DELIVERED ou CANCELLED).
  - **Observação:** Como a cozinha não necessita de usuários individuais, a mudança de status no painel da cozinha é autorizada via nível de permissão do terminal/dispositivo ou garçom/admin. Na alteração para READY, dispara notificação via WebSocket/SSE para os garçons. `[RF11, Regra B]`

### Endpoints complementares **[NOVO]**
- **GET /orders** (por comanda) e **GET /orders/:id**.
- Endpoint para cancelar item específico do pedido, com justificativa obrigatória e autorização (ADMIN) — importante para controle de perdas/fraude.
- Campo de observação por item (ex.: "sem cebola", "ponto da carne").

### Regras complementares **[NOVO]**
- Status por item (`OrderItem.status`) além do status do pedido como um todo, já que itens diferentes podem estar em estágios diferentes de preparo na cozinha.
- Cancelamento de item após `IN_PREPARATION` deveria gerar log de auditoria (RNF07) com motivo.

---

## 6. Pagamentos e Auditoria

### Endpoints originais
- **POST /payments** — WAITER, ADMIN. Executado em `prisma.$transaction`. Registra o pagamento (métodos: PIX, CREDIT_CARD, DEBIT_CARD, CASH, valor: `Decimal`, e `waiterId` que recebeu). Suporta pagamentos fracionados recalculando o saldo isolado da comanda. `[RF13, RF14, Regra A, Regra B, RNF03]`
- **GET /audit-logs** — ADMIN. Consulta o histórico completo de ações registradas no formato `JSONB`, utilizando índices em colunas de alta frequência de busca (como datas e `userId`). `[RF15, RNF06, RNF07]`

### Endpoints complementares **[NOVO]**
- **GET /payments** (por comanda) — extrato de pagamentos.
- **PATCH /payments/:id/refund** ou `/cancel` — correção de erro de lançamento.
- **GET /audit-logs** com filtros (por tipo de ação, entidade, período) — hoje só menciona índices, não filtros explícitos.
- Relatório de fechamento de caixa/turno (`GET /reports/cash-closing`) por garçom e por período.

### Regras complementares **[NOVO]**
- Gorjeta (tip) separada da taxa de serviço, se o negócio distinguir os dois.
- Idempotência em `POST /payments` para evitar cobrança duplicada em caso de retry de rede.
- **Nota fiscal (NFC-e/NFe)** — se for um sistema real no Brasil, integração fiscal é praticamente obrigatória e não aparece na especificação original.

---

## 7. Transversais (todo o sistema) **[NOVO]**

- Paginação e filtros padronizados nos endpoints `GET` de listagem.
- Padrão de erro HTTP consistente (formato de resposta de erro).
- Versionamento de API (`/api/v1/...`).
- `GET /health` para monitoramento.
- Entidade **Cliente** (se houver fidelidade/histórico de consumo, hoje reserva só guarda nome/telefone).

---

## Legenda de Referências

- **RF** = Requisito Funcional
- **RNF** = Requisito Não Funcional
- **Regra A/B/C** = Regras de negócio referenciadas no documento original
