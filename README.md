<div align="center">
   <a href="https://github.com/hikka-io/hikka-next">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/web/public/logo-dark.svg">
  <img alt="Logo" src="apps/web/public/logo.svg" width="120" height="80">
</picture>
</a>
  <p align="center">
    Ukrainian online anime encyclopedia. The entire list of anime, detailed content information, flexible and clean interface. Complete your own watch list, customize your profile and share with friends.
    <br />
    <br />
    <a href="https://hikka.io">View Project</a>
    ·
    <a href="https://github.com/hikka-io/hikka-next/issues">Report Bug</a>
    ·
    <a href="https://github.com/hikka-io/hikka-next/issues">Request Feature</a>
    ·
    <a href="https://github.com/hikka-io/hikka">Backend</a>
  </p>
</div>

## About The Project

### Built With

- [TanStack Start](https://tanstack.com/start) — full-stack React framework (Vite + Nitro)
- [TanStack Router](https://tanstack.com/router) — type-safe file-based routing
- [TanStack Query](https://tanstack.com/query) — server state management
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Monorepo Structure

```
apps/web/             → TanStack Start frontend (@hikka/web)
packages/client/      → TypeScript API client (@hikka/client)
packages/react/       → React hooks & query options (@hikka/react)
```

**Package manager**: pnpm 10.33.4  
**Build orchestration**: Turborepo  
**Library builds**: tsup

## Getting Started

### Prerequisites

- Node.js >= 20.15.0
- Corepack enabled (ships with Node.js)

### Installation

1. Clone the repo

```sh
  git clone https://github.com/hikka-io/hikka-next.git
```

2. Enable Corepack and activate pnpm

```sh
  corepack enable pnpm
```

3. Install dependencies

```sh
  pnpm install
```

4. Start the development server

```sh
  pnpm dev
```

This starts all packages in dev/watch mode. The web app will be available at `http://localhost:3000`.

### Scripts

```bash
# Development
pnpm dev              # Start all packages in dev mode
pnpm dev:web          # Start TanStack Start dev server
pnpm dev:client       # Watch-build @hikka/client
pnpm dev:react        # Watch-build @hikka/react

# Building
pnpm build            # Build everything
pnpm build:web        # Build web app
pnpm start:web        # Run production build

# Code Quality
pnpm lint             # Biome lint across all packages
pnpm lint:fix         # Biome lint with auto-fix
pnpm format           # Biome format all files
pnpm format:check     # Check formatting without writing
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Hikka is distributed under [AGPL-3.0-only](LICENSE). See `LICENSE` for more information.
