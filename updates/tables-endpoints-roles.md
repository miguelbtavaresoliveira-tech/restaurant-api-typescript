### 📋 Tabela de Endpoints

| Método | Rota | Roles | Descrição / Regras de Negócio |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/tables` | `ADMIN` | Cadastra nova mesa garantindo a unicidade do `number`. `[RF04, RNF05]` |
| **`GET`** | `/tables` | `WAITER`, `ADMIN` | Lista mesas ativas (`deletedAt: null`). Aceita `?status=`. `ADMIN` pode usar `?includeDeleted=true`. `[Regra C]` |
| **`GET`** | `/tables/:id` | `WAITER`, `ADMIN` | Retorna os detalhes da mesa acompanhados de suas comandas ativas em `session_tables`. |
| **`PATCH`** | `/tables/:id` | `ADMIN` | Edita o número da mesa (`number`). *(Edição de capacidade removida)*. |
| **`PATCH`** | `/tables/:id/status` | `WAITER`, `ADMIN` | Atualiza o status (`AVAILABLE`, `OCCUPIED`, `RESERVED`, `DIRTY`, `MAINTENANCE`). `[RF04, Regra A]` |
| **`POST`** | `/tables/merge` | `WAITER`, `ADMIN` | Une uma ou mais mesas a uma comanda ativa. `[Regra D]` |
| **`POST`** | `/tables/:id/unmerge` | `WAITER`, `ADMIN` | Desagrupa uma mesa secundária de um atendimento/comanda. `[Regra E]` |
| **`DELETE`**| `/tables/:id` | `ADMIN` | Executa *soft delete* preenchendo `deletedAt = now()`. `[Regra B]` |
| **`PATCH`** | `/tables/:id/restore` | `ADMIN` | Restaura uma mesa deletada limpando o campo (`deletedAt = null`). |

---

### ⚙️ Regras de Negócio Detalhadas

* **Regra A (Transição de Status):** A alteração manual para `AVAILABLE` ou `MAINTENANCE` é bloqueada caso existam comandas vinculadas via `session_tables` com status `OPEN` ou `PAYMENT_PENDING`.
* **Regra B (Exclusão Segura / Soft Delete):** A requisição `DELETE /tables/:id` altera o campo `deletedAt` com a data/hora atual. A operação é **bloqueada** se a mesa possuir comandas ativas (`OPEN` ou `PAYMENT_PENDING`).
* **Regra C (Filtro Padrão de Listagem):** Por padrão, todas as buscas (`GET /tables`) devem aplicar implicitamente o filtro `where: { deletedAt: null }` para que mesas desativadas não apareçam no mapa de salão dos garçons.
* **Regra D (Junção de Mesas / Merge):** Permite vincular/agrupar uma ou mais mesas secundárias a uma comanda ou atendimento ativo já existente na `session_tables`.
* **Regra E (Desagrupamento / Unmerge):** Permite remover uma mesa secundária de um agrupamento de atendimento/comanda ativo, liberando a mesa individualmente sem encerrar a comanda principal.

---

### 📝 Checklist de Tarefas (Critérios de Aceite)

- [ ] **Model & Database Migration:**
  - [ ] Adicionar campo `deletedAt` (timestamp/nullable).
  - [ ] Garantir restrição de unicidade no campo `number`.
  - [ ] Estruturar a tabela relacional `session_tables` para suportar múltiplas mesas por atendimento/comanda.
- [ ] **EndPoints CRUD & Soft Delete:**
  - [ ] `POST /tables`: Cadastro garantindo `number` único.
  - [ ] `PATCH /tables/:id`: Alteração exclusiva do campo `number`.
  - [ ] `DELETE /tables/:id`: Aplicar Soft Delete com verificação de comandas abertas *(Regra B)*.
  - [ ] `PATCH /tables/:id/restore`: Restauração da mesa (`deletedAt = null`).
- [ ] **Junção & Desagrupamento (Merge / Unmerge):**
  - [ ] `POST /tables/merge`: Rota para agrupar uma ou mais mesas a uma comanda ativa *(Regra D)*.
  - [ ] `POST /tables/:id/unmerge`: Rota para desagrupar uma mesa secundária do atendimento *(Regra E)*.
- [ ] **Consultas & Filtros:**
  - [ ] `GET /tables`: Filtro padrão `deletedAt: null` *(Regra C)*.
  - [ ] `GET /tables`: Suporte ao parâmetro query `?status=`.
  - [ ] `GET /tables`: Permissão para `ADMIN` usar `?includeDeleted=true`.
  - [ ] `GET /tables/:id`: Trazer comandas vinculadas via `session_tables`.
- [ ] **Controle de Status:**
  - [ ] `PATCH /tables/:id/status`: Suporte aos status `AVAILABLE`, `OCCUPIED`, `RESERVED`, `DIRTY`, `MAINTENANCE`.
  - [ ] Validação de transição para `AVAILABLE` ou `MAINTENANCE` bloqueada se houver comanda `OPEN` ou `PAYMENT_PENDING` *(Regra A)*.
- [ ] **Testes:**
  - [ ] Testes unitários/integração para validações das Regras A, B, C, D e E.
  - [ ] Testes de autorização por perfil (`ADMIN` vs `WAITER`).