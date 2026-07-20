# Repo Guide

- `frontend/` is the Vite + React app; `backend/` is the NestJS server. There is no root npm workspace or root scripts, so run commands inside the package you are touching.
- Use npm in each package (`package-lock.json` exists in both dirs).
- Frontend commands: `npm run start:dev` (Vite on `0.0.0.0:3334`), `npm run start:build` or `cb`, `npm run start:preview`, `npm run typecheck`, `npm run lint`, `npm run prettier:write`.
- Backend commands: `npm run start:dev`, `npm run build`, `npm run start:prod`, `npm run lint`, `npm run lint:fix`, `npm run lint:fix:imports`, `npm run format`.
- There is no repo test script and no checked-in `*.spec.ts`; verify changes with `typecheck`, `lint`, and the relevant package build instead of searching for `npm test`.
- The root `Dockerfile` copies `frontend/dist/` into the image but does not build the frontend. Build the frontend before `docker compose build` or `docker compose up --build`.
- Backend startup is env-validated in `backend/src/common/config/app-config/config.schema.ts`; `REMNAWAVE_PANEL_URL`, `REMNAWAVE_API_TOKEN`, and `INTERNAL_JWT_SECRET` are required, `APP_PORT` defaults to `3010`, `TRUST_PROXY` defaults to `1`, and `MARZBAN_LEGACY_LINK_ENABLED=true` requires `MARZBAN_LEGACY_SECRET_KEY`.
- `frontend/index.html` is an EJS template, and `metaTitle`, `metaDescription`, and `panelData` are injected at runtime. Keep the placeholder syntax intact.
- `frontend/public/assets/app-config.json` is shipped with the app, not generated.
- Follow the package-local formatter/lint config; frontend formatting differs from backend/root formatting.
