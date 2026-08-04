# fullstack-monorepo-starter

pnpm + Turborepo monorepo with a React app, a Vue app (both switchable/comparable side by side), and a FastAPI backend deployed to AWS Lambda.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **apps/react-app**: Vite, React 19, MUI, TanStack Query, Vitest, Storybook, ESLint
- **apps/vue-app**: Vite, Vue 3, Vuetify, TanStack Query (vue-query), Vitest, Storybook, ESLint
- **apps/backend**: FastAPI, uv, Mangum (Lambda adapter), Ruff, deployed via AWS SAM
- **packages/eslint-config**: shared flat ESLint config (base / react / vue)
- **packages/tsconfig**: shared base tsconfig
- **packages/tabular-input**: framework-agnostic CSV/TSV parse + validate + serialize core, used by the TabularImport samples in both apps — see [packages/tabular-input/README.md](packages/tabular-input/README.md)

## Getting started

```bash
pnpm install
```

```bash
pnpm dev:react     # http://localhost:5173
pnpm dev:vue       # http://localhost:5174
pnpm dev:backend   # http://localhost:8000
```

Copy `.env.example` to `.env` in each app as needed.

## Common tasks (run from repo root, orchestrated by Turborepo)

```bash
pnpm build       # build all apps (backend: exports requirements.txt only, no AWS CLI needed)
pnpm lint        # eslint (react-app, vue-app) + ruff (backend)
pnpm typecheck   # tsc / vue-tsc
pnpm test        # vitest (react-app, vue-app) + pytest (backend)
pnpm storybook   # run react-app's Storybook; use --filter to target vue-app instead
```

Scope any command to one app with `--filter`, e.g. `pnpm --filter react-app test`.

## Backend deploy

See [apps/backend/README.md](apps/backend/README.md) — requires the AWS SAM CLI and AWS credentials.

## License

MIT — see [LICENSE](LICENSE).
