# A mentalidade do CRUD te faz criar sistemas ruins

O CRUD é algo inerente a software, quase sempre precisamos armazenar dados, porém a construção de software vai muito mais além que só armazenar

e pautar o domínio/regras de negócio em torno do CRUD levará a construção de software engessados, difícil de manter e que não se pagarão ao longo do tempo.

Neste vídeo [](), vamos discutir como o CRUD contamina o design do software desde a projeção dos meios de comunicação, camadas de serviços e camadas de negócio, 

mas vamos discutir maneiras de desapegar disto.


Este repositório contém o código fonte do projeto de exemplo utilizado no vídeo e a demonstração de código viciado com CRUD e melhorando com uma linguagem mais expressiva.

## Sistema de gerenciamento de projetos

### Casos de uso

#### Projeto

- Criar projeto (nome, descrição, data de início, data de previsão)
    - Se for passada a data de início, o projeto deve ser marcado como iniciado
- Iniciar um projeto informando a data de início
- Finalizar um projeto informando a data de fim
- Cancelar um projeto informando a data de cancelamento

#### Task

- Adicionar task em um projeto (id do projeto, nome, descrição, data de início, data de previsão)
    - Se for passada a data de início, a task deve ser marcada como iniciada
- Iniciar uma task informando a data de início
- Finalizar uma task informando a data de fim
- Cancelar uma task informando a data de cancelamento

### Endpoints - CRUD

- Criar projeto
    - `POST /projetos`
    - Body: { name, description, started_at, forecasted_at }
    - Response: { id, name, description, started_at, forecasted_at }
- Iniciar um projeto
    - `PATCH /projetos/:id`
    - Body: { started_at }
    - Response: { id, name, description, started_at, forecasted_at }
- Finalizar um projeto
    - `PATCH /projetos/:id`
    - Body: { finished_at }
    - Response: { id, name, description, started_at, finished_at, forecasted_at }
- Cancelar um projeto
    - `PATCH /projetos/:id`
    - Body: { canceled_at }
    - Response: { id, name, description, started_at, canceled_at, forecasted_at }

## Rodar o projeto

Execute o comando `npm install` para instalar as dependências do projeto.

Para rodar o CRUD convencional, execute o comando `npm run 1-crud`.

Para rodar o CRUD com uma linguagem mais expressiva, execute o comando `npm run 2-rich-language`.

Ambos possuem um arquivo `.http` com exemplos de requisições para o projeto. Use a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) para executar as requisições.

O projeto foi desenvolvido com SQLite em memória, portanto se você salvar um arquivo qualquer, o banco de dados irá fazer reset através do `nodemon`.