# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| older   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Kashly, please **do not** open a public GitHub issue.

Instead, report it privately by:

- Opening a [private security advisory](https://github.com/TheMehediHQ/Kashly/security/advisories/new) on GitHub, **or**
- Emailing the maintainer directly.

Please include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigation (if known)

We will acknowledge your report as soon as possible and work with you on a fix and coordinated disclosure.

## Secrets & Environment Variables

Kashly relies on environment variables for secrets (database URI, auth keys, webhooks). These live in `.env` / `.env.local` files, which are **gitignored** and must never be committed.

If you believe a secret may have been exposed:

1. Rotate / revoke it immediately in the relevant provider (MongoDB Atlas, Clerk, Cloudinary).
2. Update your local `.env` files.
3. If it was ever committed, purge it from history and rotate the credential.

The repo's `.env.example` files contain only placeholders — real credentials are never included.
