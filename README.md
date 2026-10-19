# The Valkyrie of Avalon

A modern e-commerce storefront for **The Valkyrie of Avalon** built with [Next.js](https://nextjs.org), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com), and [Stripe](https://stripe.com).

---

## 📋 Table of Contents

1. [Getting Started (Local Development)](#-getting-started-local-development)
2. [Makefile Commands](#-makefile-commands)
3. [Quality & Automation](#-quality--automation)
4. [CI & Dependency Management](#-ci--dependency-management)

---

## 💻 Getting Started (Local Development)

### Prerequisites

- Node.js `v20.x` or `v22.x`
- `npm`
- Git
- `uv` (recommended for pre-commit runner)
- Docker (optional, for local Super-Linter)

### Running Locally

Install dependencies and start the development server using `make`:

```bash
make install
make dev
```

Or using `npm` directly:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the storefront.

### Environment Variables

Create a `.env.local` file (gitignored). Without Stripe keys the shop runs in demo mode with mock products.

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe API key (`sk_test_...` / `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/api/webhook` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used for checkout redirects. Required in production |

### Production Build

```bash
make build
make start
```

---

## 🛠 Makefile Commands

The repository includes a standard `Makefile` for common development tasks:

| Target | Description |
| --- | --- |
| `make check-env` | Verifies Node.js and npm availability |
| `make install` | Installs dependencies via npm |
| `make dev` | Starts the Next.js development server |
| `make build` | Builds production assets into `.next/` |
| `make start` | Starts the production server |
| `make preview` | Alias for `make start` |
| `make clean` | Removes build outputs and cache artifacts |
| `make lang` | Runs textlint on project documentation |
| `make lang-fix` | Runs textlint with autofix |
| `make setup-precommit` | Installs Git pre-commit hooks via uv |
| `make precommit` | Runs pre-commit checks across all files |
| `make super-linter` | Runs GitHub Super-Linter locally in Docker |
| `make super-linter-fix` | Runs GitHub Super-Linter with autofix in Docker |

---

## 🔍 Quality & Automation

### Pre-commit Hooks

Pre-commit hooks ensure all committed files pass linting and build checks before pushing:

```bash
# One-time setup
make setup-precommit

# Run manually
make precommit
```

### Super-Linter

GitHub Super-Linter runs on pull requests and pushes via GitHub Actions. You can run the exact same checks locally:

```bash
make super-linter-fix
```

The Makefile automatically resolves Git worktree paths so that Docker mounts function seamlessly in bare worktrees.

---

## 🤖 CI & Dependency Management

- **Dependabot**: Configured in `.github/dependabot.yml` for weekly dependency updates with cooldown buffers.
- **GHWM (GitHub Workflow Manager)**: Workflow definitions and linters are managed via `ghwm.yml`. Run `ghwm audit` to check security scores.
- **APM (Agent Package Manager)**: Configured in `apm.yml` for AI agent skills and context packaging.
