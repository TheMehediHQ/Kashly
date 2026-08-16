<p align="center">
  <img src="figma/original-86b6e09ee38231e5f28f62586f10bfda.webp" alt="Kashly Logo" width="80" />
</p>

<h1 align="center">Kashly</h1>

<p align="center">
  <strong>A modern open-source money management app for tracking income, expenses, budgets, and transactions — across web and mobile.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Bun-1.3+-black" alt="Bun" />
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript" />
</p>

---

## Screenshots

<p align="center">
  <img src="figma/3c730e8e-fbbc-4d55-b78b-a73f7d6ecfce.jpeg" alt="Kashly Dashboard" width="70%" />
</p>

---

## Features

### Authentication & Security
- 🔐 **Clerk authentication** — sign-up, sign-in, and session management
- ✉️ **Email verification** via Clerk workflows
- 🔒 **Webhook-synced user data** to MongoDB
- 🛡️ **Rate limiting** and CORS protection

### Finance Management
- 💰 **Income & expense tracking** — log every transaction with categories
- 📊 **Transaction history** — filterable, searchable history with images
- 🎯 **Budget management** — set limits, track spending, review overages
- 📈 **Financial dashboard** — real-time overview of balances, trends, and activity
- 💳 **Wallet view** — current balance, income, expenses at a glance

### User Experience
- 👤 **User profile management** — update personal info and avatar
- 🌗 **Light & dark theme** — system-aware theme toggle
- 📱 **Responsive design** — works on desktop, tablet, and mobile
- ☁️ **Cloudinary image uploads** — attach receipts and images to transactions
- ⚡ **Smooth animations** — powered by Framer Motion

### Mobile
- 📱 **React Native (Expo)** — cross-platform mobile app (in development)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI |
| **Animations** | Framer Motion, Lucide Icons, React Icons |
| **Backend** | Express 5, Node.js |
| **Database** | MongoDB (Atlas) |
| **Auth** | Clerk |
| **Mobile** | React Native, Expo 57 |
| **Monorepo** | Bun workspaces, Turborepo |
| **Validation** | Zod |
| **File Uploads** | Cloudinary |
| **Deployment** | Vercel |

---

## Architecture

Kashly is a **Bun + Turborepo monorepo** with three apps and three shared packages:

```
Kashly/
├── apps/
│   ├── web/              # Next.js frontend (React 19, Tailwind, shadcn/ui)
│   ├── api/              # Express backend (Clerk webhooks, MongoDB)
│   └── mobile/           # React Native app (Expo)
│
├── packages/
│   ├── config/           # Shared TypeScript & tooling config
│   ├── ui/               # Shared UI components
│   └── validation/       # Shared Zod validation schemas
│
├── turbo.json
├── package.json
└── bun.lock
```

### Workspace packages

| Package | Description |
|---------|-------------|
| `@moneyflow/web` | Next.js web application |
| `@moneyflow/api` | Express API service |
| `@moneyflow/config` | Shared configuration |
| `@moneyflow/ui` | Shared UI component library |
| `@moneyflow/validation` | Shared validation schemas |

---

## Getting Started

### Prerequisites

- **Node.js** 22+
- **Bun** 1.3+
- **MongoDB** (local or Atlas connection string)
- **Clerk** account for authentication
- **Cloudinary** account for image uploads

### Installation

```bash
# Clone the repository
git clone https://github.com/TheMehediHQ/Kashly.git
cd Kashly

# Install all dependencies
bun install
```

### Environment Variables

**Web app** — create `apps/web/.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Clerk Webhook
CLERK_WEBHOOK_SECRET=your_webhook_secret

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kashly

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# URLs
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3000
```

**API service** — create `apps/api/.env.local`:

```env
# Clerk
CLERK_SECRET_KEY=your_secret_key

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kashly

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` files or secrets to version control.

### Development

```bash
# Start all apps (web + api) concurrently
bun run dev
```

- **Web** → [http://localhost:3000](http://localhost:3000)
- **API** → [http://localhost:5000](http://localhost:5000)
- **Mobile** → `cd apps/mobile && bun run start`

### Build

```bash
# Build all apps
bun run build

# Lint all apps
bun run lint
```

---

## Authentication Flow

```
Sign Up → Email Verification → Sign In → Clerk Session
                                         │
                                    JWT + Webhook
                                         │
                                    ┌────┴────┐
                                    │ MongoDB │
                                    └─────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          ▼              ▼              ▼
                      Dashboard       Wallet        Budgets
```

Kashly uses **Clerk** for authentication. When a user signs up or signs in, a Clerk webhook syncs user data to MongoDB. The API service validates Clerk tokens for protected routes.

---

## Project Structure

### Key directories

| Path | Purpose |
|------|---------|
| `apps/web/app/` | Next.js App Router pages and API routes |
| `apps/web/app/dashboard/` | Main dashboard views |
| `apps/web/lib/` | Auth, DB, services, and utilities |
| `apps/api/` | Express server and API endpoints |
| `apps/mobile/` | Expo React Native app |
| `packages/ui/` | Shared UI components |
| `packages/validation/` | Zod schemas shared between apps |

---

## Deployment

### Vercel (Web)

1. Connect your GitHub repo to Vercel.
2. Set the **Root Directory** to `apps/web`.
3. Add all environment variables from `.env.example`.
4. Deploy.

### API

The Express API can be deployed to any Node.js host (Railway, Render, Fly.io, etc.) or alongside the web app on Vercel as a serverless function.

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `bun install`
4. **Create** a feature branch: `git checkout -b feature/my-feature`
5. **Make** your changes
6. **Build & lint**: `bun run build && bun run lint`
7. **Commit**: `git commit -m "feat: add my feature"`
8. **Push** and open a **Pull Request**

Please follow the existing code style and keep commit messages conventional.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Author

**Mehedi Hasan** — [@TheMehediHQ](https://github.com/TheMehediHQ)

---

<p align="center">
  If you find Kashly useful, consider giving it a ⭐ on GitHub!
</p>
