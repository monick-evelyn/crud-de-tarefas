# CRUD de Tarefas

Projeto de exemplo (desafio Rocketseat) que implementa uma API simples em Node.js para gerenciar tarefas (CRUD) e suporta importação de tarefas a partir de CSV.

**Link:**
- Proposta de projeto na Rocketseat: https://app.rocketseat.com.br/projects/ignite-node-js-2023-modulo-01

**Principais funcionalidades:**
- API REST para criar, listar, atualizar, deletar e marcar tarefas como concluídas.
- Persistência simples em arquivo JSON (`db.json`).
- Importação de tarefas a partir de arquivo CSV via script `import-csv.js` (stream).

**Tecnologias:**   
- Node.js (ES Modules)
- `csv-parse` (parser CSV)
- Módulos nativos: `http`, `fs`, `crypto`, `stream`

**Requisitos:**
- Node.js 18+
- npm

**Instalação rápida**

1. Clone o repositório:

```
git clone https://github.com/monick-evelyn/crud-de-tarefas.git
cd crud-de-tarefas
```

2. Instale dependências:

```
npm install
```

3. Inicie o servidor (padrão):

```
npm run dev
```

Por padrão o servidor escuta em `localhost:3335` (verifique `src/server.js` se quiser alterar a porta).

Scripts úteis
- `npm run dev` — inicia servidor em modo de desenvolvimento.
- `npm run importCSV` — executa o script que lê `data.csv` e envia cada linha como POST para o endpoint `/tasks`.

**Formato do CSV**
- O arquivo `data.csv` fica na raiz do projeto.
- O script assume que a primeira linha é cabeçalho (é ignorada) e que cada linha tem duas colunas: `title, description`.

Exemplo `data.csv`:

```
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
```

Como usar o import CSV

- Executando o script localmente (porta padrão do servidor deve estar ativa):

```
npm run importCSV
```

- O script lê `data.csv` via stream e envia `POST /tasks` para cada linha (pulando o cabeçalho).
- Se quiser ver a stream sendo carregada com delay/visualização, o script já inclui uma pausa breve entre linhas.

## API (rotas principais)

**POST /tasks**
- Cria uma nova tarefa a partir do body JSON:

```json
{
  "title": "fazer deploy",
  "description": "sexta-feira"
}
```

**GET /tasks**
- Retorna todas as tarefas.

**GET /tasks?title=x&description=y**
- Filtra por `title` e `description` (ambos devem ser fornecidos neste projeto atual).

**PUT /tasks/:id**
- Atualiza `title` e/ou `description` de uma tarefa, que também são fornecidos no body da requisição.

```json
{
  "description": "quinta-feira"
}
```

**DELETE /tasks/:id**
- Remove uma tarefa com base no ID.

**PATCH /tasks/:id/complete**
- Marca a tarefa (com base no ID) como concluída (`completed_at` recebe `Date()`).


## Indicações

- Usar o cliente de API que seja melhor para seu uso. O utilizado durante todo o projeto foi o `insomnia`

## Licença

- Projeto para fins didáticos.