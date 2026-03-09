# rudrasahoo.live

Personal portfolio built with Next.js 16, Tailwind CSS, and deployed on Vercel.

**Live:** [www.rudrasahoo.live](https://www.rudrasahoo.live)

## Stack

- **Framework** — Next.js 16 (App Router)
- **Styling** — Tailwind CSS
- **Linting/Formatting** — Biome
- **Package Manager** — pnpm
- **Deployment** — Vercel (via GitHub Actions CI/CD)

## Development

```bash
pnpm install
pnpm dev
```

## Deploy

Deployments are automated via GitHub Actions on every push to the `production` branch. The pipeline runs a build check before deploying to Vercel.
