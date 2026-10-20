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

| Device | Metro port | Phase 3 owner |
| --- | --- | --- |
| iPhone 17 Pro (iOS 26) | 8082 | Consolidation, then settings |
| iPhone 17 Pro Max (iOS 26) | 8083 | Profile and lists |
| iPhone 17 (iOS 26) | 8084 | Comments |
| iPhone Air (iOS 26) | 8086 | Collections and articles |
| iPhone 16e (iOS 26) | 8087 | Notifications and schedule |
| iPhone 16 Pro (iOS 18.2) | 8088 | Auth flows (signup, reset, activation) |
| Android emulator `Medium_Phone_API_36` | 8085 | Android QA pass |

## Phase 1: foundation (done, merged into `mobile/develop`)

`@hikka/core` (+ pure API helpers), auth (login sheet, secure token, profile tab), markdown viewer, Android verification with dev client, EAS and brand assets, design system (primitives, content cards, dev UI catalog at `hikka://dev/ui`).

## Phase 2: core loop (done, merged into `mobile/develop`)

Content detail, tracking (wired into the detail header), catalog with filters and multi-type search, home, characters/people/users. A consolidation pass then keeps one implementation of each shared piece the parallel tasks duplicated.

## Phase 3: the rest of the web (done, merged into `mobile/develop`)

Placeholder routes exist for every screen below in `src/app/(tabs)/(home,catalog,profile,search)/`. Each task replaces its placeholders, adds its paths to the in-app table in `components/markdown/links.ts`, and switches the matching Home "see all"/link-outs from the browser to the in-app screen.

| Task | Model | Owns |
| --- | --- | --- |
| Auth flows: signup, password reset, activation, email links | Sonnet | `features/auth/`, their root form-sheet routes |
| Profile and lists: own profile tab, user lists by status, history, favorites, follow/unfollow, followers/following | Opus | `(profile)/` (except `settings/`), `u/[username]/**`, `features/users/` |
| Comments: threads, write with mentions and spoilers, replies, votes, edit/delete/report, latest and own, preview on detail pages | Opus | `comments/**`, `features/comments/`, one comments section in `features/content/` |
| Collections and articles (read): lists, detail, article document renderer | Opus | `collections/**`, `articles/**`, `features/{collections,articles}/`, `components/article/` |
| Notifications and schedule: list, unread badge, mark read, schedule by day | Sonnet | `notifications.tsx`, `schedule.tsx`, `features/{notifications,schedule}/`, the badge in `(tabs)/_layout.tsx` |
| Settings and customization: profile, security, list, notification and UI preferences (title language, NSFW) | Sonnet | `(profile)/settings/**`, `features/settings/` |
| Android QA: every screen on the emulator, Android-only fixes | Sonnet | fixes only, after the merges |

Web-only for now: the edit/contribution system, the article and collection editors, OAuth app management.

## Phase 4: completeness and hardening (in progress)

| Task | Model | Owns |
| --- | --- | --- |
| Content gaps: favourite buttons, 18+ consent gate, anime media and movie banner sections, review stats on comments | Opus | `features/content/`, favourite button component, `features/comments/` review stats |
| Profile extras: list filters, random title, activity heatmap, articles and collections blocks | Sonnet | `features/users/` |
| Hardening: network error copy, root error boundary, offline banner, image viewer | Sonnet | `utils/`, `components/` additions, core `api-error-message` |
| End-to-end tests: Maestro flows for the core loop | Sonnet | `apps/mobile/e2e/` |
| Android QA: every screen on the emulator, Android-only fixes | Sonnet | fixes only, after the others merge |

Open for the owner: Turnstile production key in the WebView (error 300031), the Google ID-token endpoint, a comment report endpoint plus blocking users (App Store 1.2), apple-app-site-association and assetlinks.json on hikka.io for email links, push notification device registration.

## Phase 5: release

- Google sign-in (needs a backend ID-token endpoint), push notifications (needs device registration in the backend), offline query persistence, store listings and EAS submit.
