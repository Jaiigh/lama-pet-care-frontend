# L.A.M.A. Pet Care Frontend

Frontend for the L.A.M.A. pet care platform, built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com).  
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

---

## 🔒 Branch Rules for Main

The `main` branch is protected with the following rules:

1. **Require a pull request before merging**

   - Direct pushes to `main` are blocked.
   - All changes must be submitted via pull request (PR).
   - The PR must have **at least 1 approval** before it can be merged.

2. **Require status checks to pass before merging**

   - PRs must pass automated checks (build, lint, tests) before they can be merged.

3. **Require branches to be up to date before merging**

   - The PR branch must be rebased or merged with the latest `main` before merging.

4. **No bypass allowed**
   - These rules apply to everyone, including administrators.

These rules ensure `main` always contains production-ready, tested, and reviewed code.

---

## 🏷 Branch Naming Scheme

Follow this format:

```
<name>/<type>/<short-description>
```

### Example:

```
jay/feat/resume-button
```

### Types:

- **feat/** – New features (e.g., `jay/feat/add-appointment-page`)
- **fix/** – Bug fixes (e.g., `alex/fix/responsive-layout`)
- **chore/** – Maintenance tasks, dependency updates, config changes (e.g., `sam/chore/update-tailwind-config`)
- **refactor/** – Code refactoring without changing functionality (e.g., `lee/refactor/dashboard-layout`)
- **remove/** – Removing unused code, dependencies, or features (e.g., `jay/remove/prisma`)

### More Examples:

- `mike/feat/user-profile`
- `anna/refactor/api-service`
- `jay/remove/old-api-endpoints`

---

## 📚 Learn More

To learn more about Next.js:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

To learn more about React:

- [Quick Start](https://react.dev/learn)
- [Learn React with Interactive Designing](https://react.dev/learn/describing-the-ui)
