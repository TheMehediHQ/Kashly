# Contributing to Kashly

Thanks for your interest in contributing! 🎉 Kashly is an open-source money management app, and we welcome help from the community.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/Kashly.git
   cd Kashly
   ```
3. **Install** dependencies:
   ```bash
   bun install
   ```
4. Copy the env files and fill in your own values (never commit real secrets):
   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env.local
   ```
5. **Create** a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

## Development

```bash
# Start all apps (web + api) concurrently
bun run dev
```

## Making Changes

- Follow the existing code style and conventions.
- Keep commit messages [conventional](https://www.conventionalcommits.org/) (e.g. `feat:`, `fix:`, `docs:`).
- Add or update tests where relevant.
- Before opening a PR, make sure it builds and lints:
  ```bash
  bun run build && bun run lint
  ```

## Submitting a Pull Request

1. Push your branch to your fork.
2. Open a Pull Request against `main`.
3. Describe what you changed and why.
4. Make sure CI passes and review comments are addressed.

## Reporting Bugs & Security Issues

- For general bugs, open a [GitHub Issue](https://github.com/TheMehediHQ/Kashly/issues).
- For security vulnerabilities, please follow our [Security Policy](SECURITY.md) — do **not** open a public issue.

By contributing, you agree that your contributions will be licensed under the MIT License.
