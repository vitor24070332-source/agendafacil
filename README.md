# 📅 AgendaFácil — Plataforma de Agendamento de Serviços

Plataforma web para agendamento de serviços (barbearias, salões, clínicas e afins), conectando clientes e profissionais com gestão de agenda, pagamentos e notificações integradas.

---

## 🧑‍💻 Stack Tecnológica

| Camada        | Tecnologia            | Justificativa                                                                 |
|---------------|-----------------------|-------------------------------------------------------------------------------|
| Front-end     | React + Tailwind CSS  | Componentização eficiente, ecossistema amplo e curva de aprendizado acessível |
| Back-end      | Node.js + Express     | Alta performance para I/O assíncrono, mesmo ecossistema JS do front           |
| Banco de dados| PostgreSQL            | Relacional robusto, suporte a UUID, JSON e transações ACID                    |
| ORM           | Prisma                | Type-safe, migrações automáticas e integração com TypeScript                  |
| Autenticação  | JWT + bcrypt          | Stateless, seguro e amplamente documentado                                    |
| API externa   | Google Calendar API   | Sincronização de agendamentos no calendário pessoal do usuário via OAuth 2.0  |
| Testes        | Jest + Cypress        | Jest para unitários/integração; Cypress para testes E2E                       |

---

## 🗂️ Estrutura do Repositório

```
agendafacil/
├── client/                  # Front-end React
│   ├── public/
│   └── src/
│       ├── components/      # Componentes reutilizáveis
│       ├── pages/           # Telas da aplicação
│       ├── hooks/           # Custom hooks
│       ├── services/        # Chamadas à API
│       └── App.jsx
├── server/                  # Back-end Node.js
│   ├── src/
│   │   ├── controllers/     # Lógica dos endpoints
│   │   ├── routes/          # Definição das rotas
│   │   ├── middlewares/     # Auth, validação, erros
│   │   ├── services/        # Regras de negócio
│   │   └── integrations/    # Google Calendar, e-mail
│   ├── prisma/
│   │   └── schema.prisma    # Modelagem do banco
│   └── tests/               # Testes unitários e de integração
├── cypress/                 # Testes E2E
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Modelagem do Banco de Dados

### Entidades principais

- **users** — clientes e administradores (campo `role`)
- **professionals** — perfil estendido de profissionais (1:1 com users)
- **services** — serviços oferecidos por cada profissional
- **availability** — grade de disponibilidade dos profissionais
- **appointments** — agendamentos realizados
- **payments** — transações financeiras vinculadas aos agendamentos
- **reviews** — avaliações pós-atendimento
- **notifications** — fila de notificações por e-mail/push

---

## 🔗 Integração com API Externa

**Google Calendar API**

- Protocolo: OAuth 2.0 + REST
- Uso: criação, atualização e remoção de eventos no Google Calendar do usuário a cada agendamento
- Justificativa: elimina a necessidade de o usuário gerenciar dois calendários separados, aumentando a adoção da plataforma
- Documentação: https://developers.google.com/calendar

---

## 🖥️ Telas Previstas (CRUD)

| # | Tela                        | Entidade principal  |
|---|-----------------------------|---------------------|
| 1 | Cadastro / Login            | users               |
| 2 | Perfil do profissional      | professionals / services |
| 3 | Busca e agendamento         | appointments        |
| 4 | Painel do profissional      | availability / appointments |
| 5 | Painel admin                | users / reports     |

---

## ⚙️ Como Instalar e Executar

### Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- Conta Google com projeto configurado no Google Cloud Console

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/agendafacil.git
cd agendafacil
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

Variáveis necessárias:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/agendafacil
JWT_SECRET=seu_secret_aqui
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
SMTP_HOST=smtp.exemplo.com
SMTP_USER=seu@email.com
SMTP_PASS=sua_senha
```

### 3. Suba o banco com Docker (opcional)

```bash
docker-compose up -d
```

### 4. Instale dependências e rode as migrações

```bash
# Back-end
cd server
npm install
npx prisma migrate dev
npx prisma db seed

# Front-end
cd ../client
npm install
```

### 5. Inicie os servidores

```bash
# Terminal 1 — back-end (porta 3001)
cd server && npm run dev

# Terminal 2 — front-end (porta 3000)
cd client && npm run dev
```

Acesse: http://localhost:3000

---

## 🧪 Executando os Testes

```bash
# Testes unitários e de integração
cd server && npm test

# Cobertura de código
npm run test:coverage

# Testes E2E (Cypress)
cd .. && npx cypress open
# ou headless:
npx cypress run
```

---

## 👥 Equipe

| Nome | GitHub |
|------|--------|
| Integrante 1 | @usuario1 |
| Integrante 2 | @usuario2 |
| Integrante 3 | @usuario3 |
| Integrante 4 | @usuario4 |

---

## 📄 Licença

MIT
