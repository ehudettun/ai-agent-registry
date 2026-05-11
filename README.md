# AI Agent Registry

A voluntary, open-source accountability system for AI agents. Agents self-declare and register to receive a unique compliance ID that appears in all their API calls, creating a transparent, public record of violations and misbehavior.

## The Concept

**Fully Voluntary.** No mandatory registration, but agents who join commit to accountability.

**Unique Compliance ID.** Each registered agent receives a UUID that goes into all API call headers:
```
X-Agent-ID: 550e8400-e29b-41d4-a716-446655440000
```

**Transparent Reporting.** Anyone can report violations. The registry is public—lookup any agent to see their compliance record.

**Distributed Enforcement.** Large AI companies decide initial enforcement; litigation eventually catches up as the framework matures.

## How It Works

1. **Agent registers** → receives unique UUID
2. **Agent declares** → includes UUID in API headers of all API calls
3. **APIs verify** → can check the agent's registry record
4. **Community reports** → violations added to public record
5. **Accountability** → agents are held responsible for their actions

## Features

- 🔐 Agent registration with unique UUID generation
- 📋 Offense/violation reporting (form and API)
- 🔍 Public lookup by UUID to view violations
- 📱 Fully responsive design
- 🚀 Minimal, easy-to-deploy architecture

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite (easily upgradeable to PostgreSQL)

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Backend

```bash
cd backend
npm install
npm start
```

The API will run on `http://localhost:3001`

**API Endpoints:**
- `GET /api/info` - System information
- `POST /api/register` - Register a new agent
- `POST /api/report` - Report an offense
- `GET /api/agent/:uuid` - Look up agent and violations

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will run on `http://localhost:5173`

## Project Structure

```
ai-agent-registry/
├── frontend/
│   └── src/
│       ├── pages/
│       ├── App.jsx
│       └── App.css
├── backend/
│   ├── server.js
│   └── package.json
└── README.md
```

## Database Schema

### agents table
```sql
CREATE TABLE agents (
  id INTEGER PRIMARY KEY,
  uuid TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### offenses table
```sql
CREATE TABLE offenses (
  id INTEGER PRIMARY KEY,
  agentUuid TEXT NOT NULL,
  reportedBy TEXT,
  description TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolution TEXT,
  FOREIGN KEY (agentUuid) REFERENCES agents(uuid)
)
```

## Getting Started

1. Clone the repo
2. Start backend: `cd backend && npm install && npm start`
3. Start frontend: `cd frontend && npm install && npm run dev`
4. Open http://localhost:5173

## Future Roadmap

- [ ] Jurisdiction declaration
- [ ] Automated compliance checking
- [ ] Admin dashboard
- [ ] Integration with major LLM platforms
- [ ] Litigation tracking
- [ ] Reputation scoring

## Contributing

Open-source contributions welcome! Fork, create a feature branch, and submit a PR.

## License

MIT

---

**Hold AI agents accountable. Together.**
