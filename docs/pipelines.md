# OrionSec CI/CD

## CI (Continuous Integration)

Workflow: `.github/workflows/ci.yml`

Runs on every push + pull request:
- Backend: `python -m compileall backend/app` (syntax/parse check only)
- Frontend: `npm ci` + `npm run build` in `frontend/`

## CD (Continuous Delivery)

Workflow: `.github/workflows/cd.yml`

Runs on:
- Manual trigger (`workflow_dispatch`)
- Version tags like `v1.0.0`

Builds the frontend and deploys to Vercel:
- Manual runs support `preview` or `production`
- Tag pushes (`v*`) deploy `production`

Required GitHub Actions secrets:
- `VERCEL_TOKEN` (Vercel personal token)
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Notes

- The workflow uses `npx vercel deploy --prebuilt`, so the output from `frontend/dist/` is what gets deployed.
- If you need environment variables (e.g. `VITE_API_BASE_URL`), set them in Vercel Project Settings (Environment Variables).
