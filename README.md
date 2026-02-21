# Agentic AI Live

A single-file Node.js autonomous chat interface with animated live 3D geometry.

## Run locally

```bash
npm start
```

Then open `http://localhost:3000`.

## Deploy (Option #2: Render)

This repo includes `render.yaml` and a `Dockerfile`, so deployment is one-click after linking the repo.

1. Push this branch to your Git provider.
2. In Render, create a new **Blueprint** and select this repo.
3. Set `OPENAI_API_KEY` in Render environment variables.
4. Deploy.

Render will build from `Dockerfile`, expose port `3000`, and keep `/` as the health check.


## Checks

```bash
npm test
```

This runs a syntax validation of `server.js` to catch merge/regression issues early.
