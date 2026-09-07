testes:

npm run test: Roda todos os testes uma única vez e encerra.

npm run test:watch: Modo de desenvolvimento — reexecuta os testes automaticamente sempre que você salvar um arquivo.

npm run test:unit: Executa apenas os testes unitários (ideal para rodar continuamente enquanto você desenvolve a lógica das regras de negócio).

npm run test:e2e: Executa apenas os testes integrados que fazem chamadas HTTP e acessam o PostgreSQL no Docker.

npm run test:cov: Gera uma tabela no terminal mostrando a porcentagem exata de linhas, funções e ramificações da sua API cobertas por testes.



Geração de dados Fakes  com factories e @faker-js/faker
Usar valores estaticos como email por exemplo gera colisão com o banco como @unique, ou falsos positivos. As factories geram objetos com dados aleatórios válidos a cada execução, permitindo sobreescrever propriedades necessárias para o teste 


Fluxo Local (Na sua máquina)

Início do Commit: Ao rodar git commit -m "feat(auth): adiciona login", o Husky intercepta a ação antes de gravar as alterações.

Validação de Tipos (pre-commit): O script roda tsc --noEmit. Se houver qualquer erro de tipagem no código TypeScript, a ação é abortada e nada é commitado.

Validação da Mensagem (commit-msg): O Commitlint lê o texto digitado. Se você escrever algo fora do padrão (ex: git commit -m "ajuste no codigo"), o commit é negado, exigindo a sintaxe do Conventional Commits (ex: fix(auth): corrige token).

Fluxo Remoto (No GitHub Actions)

Gatilho de Pull Request: Ao subir sua branch e abrir um PR para a main, o arquivo .github/workflows/ci.yml entra em ação no servidor do GitHub.

Instância PostgreSQL Isolada: O CI inicializa um container Docker temporário com PostgreSQL real.

Setup & Compilação: O ambiente instala dependências (npm ci), gera as tipagens do ORM via prisma generate (acionado pelo postinstall) e faz a checagem de tipos (npm run typecheck).

Migrations & Testes: As migrations criam as tabelas no banco temporário e o Vitest roda as suítes de testes unitários e E2E.

Status Badge: Se tudo passar, a trava do PR é liberada para merge e a badge no topo do repositório fica verde (CI: passing).



Prisma antes de commitar 
npx prisma generate
npx prisma migrate dev --name <nome-da-migration>

Prisma no postinstall 
O postinstall é um hook do npm que é acionado automaticamente toda vez que você instala ou atualiza dependências (npm install ou npm update).

No seu caso, ele está configurado para rodar o comando npx prisma generate.

Portanto, sempre que você rodar npm install (ou npm i) no seu projeto, o script irá: 


**Validação estatíca imediata**
```
npx tsc --noEmit - Valida se todos os tipos do TypeScript estão corretos.
npm run lint — Garante as regras de estilo e boas práticas de código.
```