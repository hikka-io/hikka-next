# Hikka mobile roadmap

Goal: a native-feeling iOS and Android app that keeps the web app's structure and UX. Stack: [STACK.md](STACK.md). Design rules: [DESIGN.md](DESIGN.md).

## How work runs

- One task = one session = one git worktree and branch `mobile/<topic>` (or `refactor/<topic>` outside `apps/mobile`), cut from `main`.
- Nothing is pushed until the owner says so. Branches merge into `main` only on the owner's word, after a review pass.
- Each branch is review-sized: focused commits (conventional, no AI mentions), web gates green, screenshots described in the session's final report.
- Every UI task reads `DESIGN.md` first and records its decisions there in the same branch.
- Models: Opus for design and judgment-heavy work, Sonnet for well-specified execution and verification, Explore/Haiku subagents for searches.
- Lockfile conflicts between branches are resolved by taking `main`'s `pnpm-lock.yaml` and re-running `pnpm install`.

### Device and port allocation

Each running task owns one device and one Metro port so parallel tasks never collide. Port 8081 is taken locally.

| Task | Device | Metro port |
| --- | --- | --- |
| Auth and profile shell | iPhone 17 Pro (iOS 26) | 8082 |
| Design system foundation | iPhone 17 Pro Max (iOS 26) | 8083 |
| Markdown viewer | iPhone 17 (iOS 26) | 8084 |
| Android and build tooling | Android emulator `Medium_Phone_API_36` | 8085 |
| `@hikka/core` extraction | none (web gates only) | none |

## Phase 1: foundation (in progress, parallel)

| Task | Branch | Model | Depends on |
| --- | --- | --- | --- |
| Auth: Turnstile login, secure token, profile tab | `mobile/auth` | Opus | none |
| Design system: primitives, dev UI catalog, DESIGN.md values | `mobile/design-system` | Opus | none |
| `@hikka/core`: shared pure utils for web and mobile | `refactor/core-package` | Sonnet | none |
| Markdown viewer: comments and synopses, spoilers, mentions, in-app links | `mobile/markdown` | Sonnet | none |
| Android run, dev client, EAS profiles, app icon and splash | `mobile/android-tooling` | Sonnet | none |

## Phase 2: core loop (after phase 1 merges)

- Content detail for anime, manga and novel with the web's sections (header, stats, genres, synopsis, characters, staff, franchise, recommendations, comments preview).
- Tracking: watch/read status sheet, progress and score, full-snapshot PUT (`tracking-args`).
- Catalog with filters and sort per content type; multi-type search (content, characters, people, users).
- Home feed (web home widgets).
- Characters and people pages.

## Phase 3: social and lists

- User profile: lists by status, history, favourites, followers.
- Notifications (in-app), comments (read, plain write with mentions), collections (read), articles (read), schedule, settings and customization.

## Phase 4: release

- Google sign-in (needs a backend ID-token endpoint), push notifications (needs device registration in the backend), offline query persistence, store listings and EAS submit.
