# Hikka mobile roadmap

Goal: a native-feeling iOS and Android app that keeps the web app's structure and UX. Stack: [STACK.md](STACK.md). Design rules: [DESIGN.md](DESIGN.md).

## How work runs

- **Integration branch: `mobile/develop`** (worktree `.claude/worktrees/mobile-develop`). Every task branch is cut from it and merges back into it after review. Mobile work never merges into `main`.
- One task = one session = one git worktree and branch.
- Nothing is pushed until the owner says so.
- Each branch is review-sized: focused commits (conventional, no AI mentions), gates green, screenshots listed in the session's final report.
- Every UI task reads `DESIGN.md` first and records its decisions there (sections plus the decision log) in the same branch.
- Models: Opus for design and judgment-heavy work, Sonnet for well-specified execution and verification, Explore/Haiku subagents for searches.
- Lockfile conflicts are resolved by taking one side's `pnpm-lock.yaml` and re-running `pnpm install`.
- Each task owns the files listed for it below. A file owned by another task is only touched when the brief says so, and only minimally (one `Stack.Screen` line, one import).

### Device and port allocation

Each running task owns one device and one Metro port so parallel tasks never collide. Port 8081 is taken locally.

| Task | Device | Metro port |
| --- | --- | --- |
| Content detail | iPhone 17 Pro (iOS 26) | 8082 |
| Tracking | iPhone 17 Pro Max (iOS 26) | 8083 |
| Catalog and search | iPhone 17 (iOS 26) | 8084 |
| Home | iPhone Air (iOS 26) | 8086 |
| Characters, people, users | iPhone 16e (iOS 26) | 8087 |
| Android QA (after merges) | Android emulator `Medium_Phone_API_36` | 8085 |

## Phase 1: foundation (done, merged into `mobile/develop`)

`@hikka/core` (+ pure API helpers), auth (login sheet, secure token, profile tab), markdown viewer, Android verification with dev client, EAS and brand assets, design system (primitives, content cards, dev UI catalog at `hikka://dev/ui`).

## Phase 2: core loop (in progress, parallel)

Route skeleton: tabs `(home)`, `(catalog)`, `(profile)`, `(search)`; screens reachable from every tab live once in `src/app/(tabs)/(home,catalog,profile,search)/`.

| Task | Model | Owns |
| --- | --- | --- |
| Content detail: anime, manga, novel with the web's sections | Opus | `(home,catalog,profile,search)/{anime,manga,novel}/`, `features/content/` |
| Tracking: watch/read status sheet, progress, score, full-snapshot PUT | Opus | `components/tracking/`, its sheet route, `utils/api/invalidate-content-state.ts` |
| Catalog and search: all three content types, filter sheet, sort, multi-type search, Android tab fixes | Opus | `(catalog)/`, `(search)/`, `(tabs)/_layout.tsx`, `features/{catalog,filters,search}/`, `components/anime-*` |
| Home: the web's home widgets, Home as the initial tab | Sonnet | `(home)/`, `features/home/` |
| Characters, people, public user pages | Sonnet | `(home,catalog,profile,search)/{characters,people,u}/`, `features/{entities,users}/` |

Shared touch points: `src/app/_layout.tsx` (a task adds its own `Stack.Screen`), `components/markdown/links.ts` (a task adds the routes it builds to the in-app table), `DESIGN.md`, `package.json`.

## Phase 3: social and lists

- User profile: lists by status, history, favourites, followers.
- Notifications (in-app), comments (read, plain write with mentions), collections (read), articles (read), schedule, settings and customization.

## Phase 4: release

- Google sign-in (needs a backend ID-token endpoint), push notifications (needs device registration in the backend), offline query persistence, store listings and EAS submit.
