
# Hackaton - API

#### Executando projeto localmente

Clone o projeto

```bash
  git clone https://github.com/rrsantos1/hackaton.git
```

Entre no diretório do projeto

```bash
  cd hackaton
```

Instale as dependências

```bash
  npm install
```

Crie um banco local

```bash
  docker run --name mypostgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=user \
  -e POSTGRES_DB=db-hackaton \
  -p 5432:5432 \
  -d postgres:latest
```

Adicione o arquivo .env no projeto com base no .env.sample
- PORT=3001
- NODE_ENV=development
- DATABASE_HOST=localhost
- DATABASE_NAME=db-hackaton
- DATABASE_USER=user
- DATABASE_PASSWORD=user
- DATABASE_PORT=5432
- JWT_SECRET=secret

Inicie o servidor

```bash
  npm run start:dev
```
 
A API estará rodando na porta http://localhost:3001 e o banco na porta http://localhost:5432.

### User
#### Criar usuário

```http
  POST /user
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório**. Nome completo do usuário. |
| `email` | `string` | **Obrigatório**. E-mail do usuário. |
| `password` | `string` | **Obrigatório**. Senha. |

#### Acessar o sistema

```http
  POST /user/signin
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email` | `string` | **Obrigatório**. E-mail do usuário. |
| `password` | `string` | **Obrigatório**. Senha |

#### Encontre um usuário pelo ID

```http
  GET /user/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |


#### Deletar um usuário pelo ID

```http
  DELETE /user/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |

### Atividades
#### Criar atividade

```http
  POST /activity
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
Authorization bearer | jwt | Obrigatório
title | string | Obrigatório. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Obrigatório. Categoria da atividade.
type | string | Obrigatório. Tipo da atividade (quiz, word_search, crossword).
config | object | Opcional. Configurações específicas da atividade.
content | object | Opcional. Conteúdo principal da atividade.
coverImage | string | Opcional. URL da imagem de capa da atividade.

#### Encontrar todas as atividades

```http
  GET /activity
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
page | number | Opcional. Número da página para paginação (default: 1).
limit | number | Opcional. Quantidade de itens por página (default: 10000).

#### Deletar uma atividade pelo ID

```http
  DELETE /activity/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |

#### Atualizar uma atividade

```http
  PUT /activity/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
id | number | Obrigatório. ID da atividade a ser atualizada (na URL).
title | string | Opcional. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Opcional. Categoria da atividade.
type | string | Opcional. Tipo da atividade (quiz, word_search, crossword).
config | object | Opcional. Configurações da atividade.
content | object | Opcional. Conteúdo da atividade.
coverImage | string | Opcional. URL da nova imagem de capa.
words | string | Opcional. Lista de palavras separadas por vírgula (para word_search).
rows | number | Opcional. Número de linhas do grid (word_search/crossword).
cols | number | Opcional. Número de colunas do grid (word_search/crossword).
clue | string | Opcional. Dica para palavras do crossword.
time | number | Opcional. Tempo limite da atividade (em minutos).

#### Criar um word_search

```http
  POST /activity/word_search
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
title | string | Obrigatório. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Obrigatório. Categoria da atividade.
type | string | Obrigatório. Sempre deve ser "word_search".
config.time | number | Obrigatório. Tempo da atividade em minutos.
config.rows | number | Obrigatório. Quantidade de linhas no grid.
config.cols | number | Obrigatório. Quantidade de colunas no grid.
content.words | string | Obrigatório. Lista de palavras separadas por vírgula.
coverImage | file | Opcional. Imagem de capa da atividade (upload via multipart/form-data).


#### Criar um crossword

```http
  POST /activity/crossword
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
title | string | Obrigatório. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Obrigatório. Categoria da atividade.
type | string | Obrigatório. Sempre deve ser "crossword".
config.rows | number | Obrigatório. Quantidade de linhas no grid.
config.cols | number | Obrigatório. Quantidade de colunas no grid.
config.time | number | Opcional. Tempo da atividade em minutos.
content.words | array | Obrigatório. Lista de objetos com word e clue.
coverImage | file | Opcional. Imagem de capa da atividade (upload via multipart/form-data).


#### Criar um quiz

```http
  POST /activity/quiz
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
title | string | Obrigatório. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Obrigatório. Categoria da atividade.
type | string | Obrigatório. Sempre deve ser "quiz".
config.time | number | Opcional. Tempo limite da atividade em minutos.
config.shuffleQuestions | boolean | Opcional. Se as perguntas devem ser embaralhadas.
content.questions | array | Obrigatório. Lista de perguntas com enunciado, opções e resposta correta.
coverImage | file | Opcional. Imagem de capa da atividade (upload via multipart/form-data).

#### Criar um cloze

```http
  POST /activity/cloze
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
title | string | Obrigatório. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Obrigatório. Categoria da atividade.
type | string | Obrigatório. Sempre deve ser "cloze".
config.timeLimit | number | Opcional. Tempo limite da atividade em minutos.
config.shuffleQuestions | boolean | Opcional. Se as perguntas devem ser embaralhadas.
content.questions | array | Obrigatório. Lista de frases com lacunas, respostas e opções.
coverImage | file | Opcional. Imagem de capa da atividade (upload via multipart/form-data).

#### Criar um dragdrop

```http
  POST /activity/dragdrop
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
title | string | Obrigatório. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Obrigatório. Categoria da atividade.
type | string | Obrigatório. Sempre deve ser "drag_drop".
config.timeLimit | number | Opcional. Tempo limite da atividade em minutos.
config.shufflePairs | boolean | Opcional. Se os pares devem ser embaralhados.
content.pairs | array | Obrigatório. Lista de pares { word, translation }.
coverImage | file | Opcional. Imagem de capa da atividade (upload via multipart/form-data).

#### Criar um multiplechoice

```http
  POST /activity/multiplechoice
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
title | string | Obrigatório. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Obrigatório. Categoria da atividade.
type | string | Obrigatório. Sempre deve ser "multiple_choice".
config.timeLimit | number | Opcional. Tempo limite da atividade em minutos.
config.shufflePairs | boolean | Opcional. Se os pares devem ser embaralhados.
content.pairs | array | Obrigatório. Lista de pares { word, translation }.
coverImage | file | Opcional. Imagem de capa da atividade (upload via multipart/form-data).


#### Criar um sentence_order

```http
  POST /activity/sentence_order
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
Parâmetro | Tipo | Descrição
Authorization bearer | jwt | Obrigatório
title | string | Obrigatório. Título da atividade.
description | string | Opcional. Descrição da atividade.
category | string | Obrigatório. Categoria da atividade.
type | string | Obrigatório. Sempre deve ser "sentence_order".
config.timeLimit | number | Opcional. Tempo limite da atividade em minutos.
content.questions | array | Obrigatório. Lista de frases a serem ordenadas.
content.scoring | object | Obrigatório. Configurações de pontuação: { pointPerWord, bonusFullSentence, bonusFastFinish, timeLimitForBonus }.
content.uiSettings | object | Obrigatório. Configurações da interface de usuário, como botões e animações.
coverImage | file | Opcional. Imagem de capa da atividade (upload via multipart/form-data).