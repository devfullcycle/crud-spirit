# Sistema de gerenciamento de projetos

## Casos de uso

### Projeto

- Criar projeto (nome, descrição, data de início, data de previsão)
    - Se for passada a data de início, o projeto deve ser marcado como iniciado
- Iniciar um projeto informando a data de início
- Finalizar um projeto informando a data de fim
- Cancelar um projeto informando a data de cancelamento

### Task

- Adicionar task em um projeto (id do projeto, nome, descrição, data de início, data de previsão)
    - Se for passada a data de início, a task deve ser marcada como iniciada
- Iniciar uma task informando a data de início
- Finalizar uma task informando a data de fim
- Cancelar uma task informando a data de cancelamento

## Endpoints - CRUD

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
