# 🐾 L.A.M.A. Pet Care Frontend

Frontend for the **L.A.M.A. pet care** platform, built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com).  
This project enables pet owners, caretakers, and veterinarians to manage reservations, payments, profiles, reviews, and pet tracking.

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org) (version 18 or higher recommended)
- [pnpm](https://pnpm.io/) package manager

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

---

## 🔒 Branch Rules for `main`

The `main` branch is protected with the following rules:

1. **Require a pull request before merging**
   - Direct pushes to `main` are blocked.
   - All changes must be submitted via pull request (PR).
2. **Require status checks to pass before merging**
   - PRs must pass automated checks (build, lint, tests) before they can be merged.
3. **Require branches to be up to date before merging**
   - The PR branch must be rebased or merged with the latest `main` before merging.
4. **No bypass allowed**
   - These rules apply to everyone, including administrators.

These rules ensure `main` always contains production-ready, tested, and reviewed code.

---

## 🌿 Branch Naming Scheme

Format:

```
<type>/<short-description>
```

**Types:**

- **feat/** – New features (e.g., `feat/add-appointment-page`)
- **fix/** – Bug fixes (e.g., `fix/responsive-layout`)
- **chore/** – Maintenance tasks, dependency updates, config changes (e.g., `chore/update-tailwind-config`)
- **refactor/** – Code refactoring without changing functionality (e.g., `refactor/dashboard-layout`)
- **remove/** – Removing unused code, dependencies, or features (e.g., `remove/prisma`)

**Examples:**

```
feat/user-profile
fix/login-validation
chore/update-readme
refactor/api-service
remove/old-api-endpoints
```

---

## 📚 Learn More

To learn more about Next.js:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
