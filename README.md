# MoneyFlow

> A modern full-stack personal finance management application for tracking income, expenses, budgets, transactions, and user accounts.

MoneyFlow is a full-stack finance application organized as a **Bun + Turborepo monorepo**. It uses Next.js for the web application, Express for the standalone API service, MongoDB for persistence, JWT-based authentication, and shared packages for reusable configuration, UI, and validation.

---

## ✨ Features

* 🔐 User registration and authentication
* ✉️ Email verification
* 🔑 JWT-based authentication
* 🔄 Resend verification email
* 🔒 Password hashing with bcrypt
* 💰 Income and expense tracking
* 📊 Transaction history
* 🎯 Budget management
* 📈 Financial dashboard
* 👤 User profile management
* 👥 User management
* 🌓 Light and dark theme support
* ☁️ Cloudinary image uploads
* 📧 Email-based authentication flows
* 📱 Responsive UI
* ⚡ Turborepo-powered development and builds

---

## 🏗️ Architecture

MoneyFlow is structured as a monorepo using **Bun workspaces** and **Turborepo**.

```text
moneyflow/
│
├── apps/
│   │
│   ├── web/                         # Next.js frontend application
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── auth/            # Next.js authentication routes
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify/
│   │   │   └── ...
│   │   │
│   │   ├── lib/
│   │   │   ├── auth/                # Authentication utilities
│   │   │   ├── db/                  # MongoDB connection
│   │   │   ├── services/            # Business logic
│   │   │   └── utils/               # Shared helpers
│   │   │
│   │   └── package.json
│   │
│   └── api/                         # Express backend service
│       ├── api/
│       │   ├── loginUser.js
│       │   ├── logoutUser.js
│       │   ├── register.js
│       │   ├── resendVerification.js
│       │   └── verify.js
│       │
│       ├── index.js
│       └── package.json
│
├── packages/
│   │
│   ├── config/                      # Shared configuration
│   ├── ui/                          # Shared UI components
│   └── validation/                  # Shared validation schemas
│
├── package.json                     # Root workspace configuration
├── bun.lock                         # Bun lockfile
├── turbo.json                       # Turborepo configuration
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 16**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion**
* **Lucide React**

### Backend

* **Node.js**
* **Express 5**
* **MongoDB**
* **JWT**
* **bcrypt**
* **Nodemailer**
* **Express Rate Limit**
* **CORS**

### Monorepo & Tooling

* **Bun**
* **Turborepo**
* **TypeScript**
* **Bun Workspaces**

### External Services

* **MongoDB Atlas** — database
* **Cloudinary** — image/file uploads
* **SMTP/Gmail** — transactional emails
* **Vercel** — deployment

---

## 📦 Workspace Structure

The project currently contains the following workspaces:

```text
@moneyflow/web
@moneyflow/api
@moneyflow/config
@moneyflow/ui
@moneyflow/validation
```

You can verify the workspace configuration with:

```bash
bun pm ls
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 22+
* Bun 1.3+
* MongoDB / MongoDB Atlas
* Git

Check your versions:

```bash
node -v
bun -v
git --version
```

---

## 📥 Installation

Clone the repository:

```bash
git clone git@github.com:TheMehediHQ/MoneyFlow.git
```

Move into the project:

```bash
cd MoneyFlow
```

Install all dependencies:

```bash
bun install
```

---

## 🔐 Environment Variables

### Web Application

Create:

```text
apps/web/.env.local
```

Example:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/My_Finance

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Application
PORT=5000
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3000

# Public API
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset
```

### API Service

Create:

```text
apps/api/.env.local
```

Example:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/My_Finance

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Server
PORT=5000

# Application URLs
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3000
```

> **Important:** Never commit `.env`, `.env.local`, API keys, passwords, JWT secrets, or other credentials to Git.

---

## 💻 Development

Start all applications and packages through Turborepo:

```bash
bun run dev
```

This starts the configured development tasks concurrently.

### Web Application

The Next.js application runs on:

```text
http://localhost:3000
```

### API Server

The Express API runs on:

```text
http://localhost:5000
```

---

## 🏗️ Production Build

Build the complete monorepo:

```bash
bun run build
```

Turborepo will build the required workspaces in dependency order.

A successful build should finish with:

```text
Tasks:    4 successful, 4 total
```

---

## 🧹 Lint

Run linting across the workspace:

```bash
bun run lint
```

---

## 🔍 Useful Commands

### Install dependencies

```bash
bun install
```

### Start development

```bash
bun run dev
```

### Build everything

```bash
bun run build
```

### Run lint

```bash
bun run lint
```

### Check workspaces

```bash
bun pm ls
```

### Clean Next.js build

```bash
rm -rf apps/web/.next
```

### Rebuild from scratch

```bash
rm -rf apps/web/.next
bun install
bun run build
```

---

## 🔐 Authentication Flow

MoneyFlow uses JWT-based authentication.

The authentication system includes:

```text
Register
   │
   ▼
Email Verification
   │
   ▼
Login
   │
   ▼
JWT Authentication
   │
   ├── Dashboard
   ├── Wallet
   ├── Budgets
   ├── Profile
   └── User Management
```

Authentication-related functionality includes:

* Registration
* Login
* Logout
* Email verification
* Resend verification email
* Password hashing
* JWT generation
* Token validation

---

## 🗄️ Database

MoneyFlow uses **MongoDB** as its primary database.

The application currently works with collections including:

```text
usersData
transactions
budgets
```

The database connection is handled through the application's MongoDB utility layer.

---

## 📊 Main Application Areas

### Dashboard

Provides an overview of the user's financial activity.

### Wallet

Handles:

* Current balance
* Income
* Expenses
* Transactions
* Transaction history

### Budgets

Allows users to:

* Create budgets
* Track spending
* Review budget history
* Monitor financial limits

### Profile

Users can manage their personal profile information.

### User Management

Provides administrative user management functionality.

---

## 📁 API Routes

The Next.js application currently exposes authentication route handlers:

```text
/api/auth/login
/api/auth/logout
/api/auth/register
/api/auth/resend-verification
/api/auth/verify
```

The standalone Express API is located under:

```text
apps/api
```

---

## ⚡ Turborepo

Turborepo is used to coordinate development and production tasks across the monorepo.

Configured tasks include:

```text
dev
build
lint
```

Run a task across the repository with:

```bash
bun run <task>
```

For example:

```bash
bun run build
```

---

## 🧩 Shared Packages

### `@moneyflow/config`

Contains shared project configuration.

### `@moneyflow/ui`

Contains reusable UI components and shared frontend utilities.

### `@moneyflow/validation`

Contains reusable validation schemas used across applications.

---

## 🔒 Security

Security considerations include:

* Password hashing with bcrypt
* JWT-based authentication
* HTTP authentication cookies where applicable
* Rate limiting
* Environment-based secrets
* MongoDB connection credentials stored outside source control
* CORS configuration
* Email verification

### Never commit secrets

The following files should remain local:

```text
.env
.env.local
.env.production
```

Check Git before committing:

```bash
git status
```

---

## 🌐 Deployment

The project can be deployed using Vercel or another Node.js-compatible hosting platform.

### Web

The Next.js application is located at:

```text
apps/web
```

For a Vercel deployment, configure the project according to the repository's monorepo structure.

### API

The standalone backend is located at:

```text
apps/api
```

It can be deployed independently when required.

---

## 🧪 Production Checklist

Before deploying:

```bash
bun install
bun run build
```

Then verify:

* [ ] MongoDB URI is configured
* [ ] JWT secret is configured
* [ ] Email credentials are configured
* [ ] Cloudinary credentials are configured
* [ ] API URLs are correct
* [ ] CORS configuration is correct
* [ ] Production environment variables are configured
* [ ] No secrets are committed to Git
* [ ] Authentication flows work correctly
* [ ] Database connection works correctly

---

## 📌 Project Status

MoneyFlow is actively being developed as a modern full-stack finance management platform.

The project is structured to support:

* Scalable development
* Shared packages
* Independent applications
* Fast local development
* Cached builds
* Type-safe development
* Production deployment

---

## 🤝 Contributing

Contributions, improvements, and bug fixes are welcome.

### Development workflow

1. Fork or clone the repository.
2. Create a feature branch.
3. Install dependencies with Bun.
4. Make your changes.
5. Run the build.
6. Run linting.
7. Commit your changes.
8. Open a pull request.

Example:

```bash
git checkout -b feature/your-feature
```

```bash
bun install
bun run build
bun run lint
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Mehedi Hasan**

GitHub:

`https://github.com/TheMehediHQ`

---

## ⭐ Support

If you find MoneyFlow useful, consider giving the repository a ⭐ on GitHub.
