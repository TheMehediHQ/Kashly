# MoneyFlow Monorepo

A production-ready monorepo for the MoneyFlow finance application, built with:

- **pnpm workspaces** for efficient dependency management
- **Turborepo** for fast, cached builds and task orchestration
- **Next.js 16** (App Router) for both frontend and API routes
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **MongoDB** for data persistence
- **JWT** for authentication

## Architecture

This is a **single-deployment** monorepo. The entire application (frontend + backend API) lives in `apps/web` and deploys as a single Vercel project.

```
moneyflow/
├── apps/
│   └── web/              # Next.js App Router (frontend + API routes)
│       ├── app/
│       │   ├── api/      # Next.js Route Handlers (backend API)
│       │   ├── dashboard/
│       │   ├── login/
│       │   ├── register/
│       │   └── ...
│       ├── lib/          # Shared backend logic
│       │   ├── db/       # Database connection
│       │   ├── auth/     # Auth utilities (password, token)
│       │   ├── services/ # Business logic services
│       │   └── utils/    # Utility functions
│       ├── components/     # React components
│       ├── public/       # Static assets
│       └── package.json
├── packages/
│   ├── config/           # Shared ESLint & TypeScript configs
│   ├── ui/               # Shared React components
│   └── validation/       # Shared Zod validation schemas
├── package.json          # Root package.json
├── pnpm-workspace.yaml   # pnpm workspace config
├── turbo.json            # Turborepo task config
└── README.md
```

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) (v9+)
- [Node.js](https://nodejs.org/) (v18+)
- A MongoDB database (e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This starts the Next.js development server with Turborepo. The app will be available at `http://localhost:3000`.

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

## Environment Variables

Create `apps/web/.env.local` with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# App URL (used for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (for verification & password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Deployment

This project is designed for a **single Vercel deployment**:

- **Root Directory:** `apps/web`
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`

## License

MIT
