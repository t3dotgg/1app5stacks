# Roundest (og t3-stack edition)

## Setup

Prerequisites: pnpm, node, postgres

1. Install deps:

```bash
pnpm install
```

2. Start dev server:

```bash
pnpm run dev
```

## Deployment

1. Pick a postgres provider, get db up, copy DATABASE_URL
2. Push to github
3. Click "new project" on Vercel, select repo, set DATABASE_URL
