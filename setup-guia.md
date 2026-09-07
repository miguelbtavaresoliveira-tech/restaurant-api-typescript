# Guia de Configuração e Execução (Setup)

Este guia apresenta o passo a passo para configurar o ambiente de desenvolvimento, subir o banco de dados, aplicar o Prisma e rodar os testes da sua aplicação.

## 1. Inicializar o Docker

O erro `failed to connect to the docker API` indica que o serviço do Docker (Docker Daemon) não está rodando.

**Como resolver:**
1. Abra o **Menu Iniciar** do Windows.
2. Procure por **Docker Desktop** e abra o aplicativo.
3. Aguarde o ícone do Docker na bandeja do sistema (canto inferior direito) ficar verde / indicar que a "Engine" está rodando.

## 2. Subir o Banco de Dados

Com o Docker rodando, inicie o contêiner do PostgreSQL:

```bash
docker compose up -d
```
> **Nota:** A flag `-d` roda o contêiner em segundo plano (detached mode).

## 3. Configurar o Prisma (Migrations e Seed)

Após o banco de dados estar no ar, você precisa criar as tabelas e popular os dados iniciais.

**Rodar as migrações (criar as tabelas):**
```bash
npx prisma migrate dev
```

**Rodar o Seed (inserir dados iniciais):**
```bash
npx prisma db seed
```
**Listar containers em execução:**
```bash
docker ps
```



**Parar o banco de dados:**
```bash
docker compose down
```



> **Dica:** Caso o Prisma exija gerar os artefatos novamente em algum momento, você pode rodar `npx prisma generate`.

## 4. Rodar os Testes

Com o banco de dados no ar e populado, você pode rodar a suíte completa de testes (Unitários, Integração e E2E) sem se preocupar com falhas de conexão:

```bash
npm run test
```

> **Atenção:** Testes de integração e E2E precisam que o PostgreSQL do Docker esteja rodando e acessível na porta configurada (geralmente `5432`). Se você desligar o Docker, os testes unitários (`auth.service.spec.ts`) vão passar, mas os de integração vão falhar novamente.
