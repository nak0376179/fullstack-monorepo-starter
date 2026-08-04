# backend

FastAPI backend, run locally with uvicorn and deployed to AWS Lambda (via Mangum) behind an API Gateway HTTP API, defined in `template.yaml` (AWS SAM).

## Local development

```bash
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Or from the repo root: `pnpm dev:backend`.

## Lint / test

```bash
uv run ruff check .
uv run pytest
```

## Deploy to AWS

Requires the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) and configured AWS credentials. `pnpm build` (part of the workspace-wide `pnpm build`) only exports `requirements.txt` and never requires the SAM CLI, so it stays safe to run without it installed.

```bash
pnpm package        # requirements.txt export + sam build
sam deploy --guided # first time; subsequent deploys: pnpm deploy
```
