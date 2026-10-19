# Hikka mobile: stack and approach

Status: accepted, 2026-10-20; spike done (see "Spike results"). Based on a review of `hikka-next` (web) and `hikka` (backend).

## What the web app gives us

| Web piece | Reusable on mobile? |
| --- | --- |
| `@hikka/api` (hey-api client, Zod-validated SDK, TanStack Query options, `paginatedInfiniteOptions`, `HikkaApiError`, `API_LIMITS`) | Yes, as is. It is plain fetch + Zod + react-query, no DOM. This is about 22k lines we never write again. |
| `transport.ts` browser singleton (`configureBrowserClient`, `setAuthToken`, `auth` header) | Yes. Mobile is one long-lived client, same as the browser. The SSR per-request client is irrelevant. |
| `utils/labels`, `utils/i18n` (Ukrainian declension, word forms, number/relative time), `utils/title`, `utils/season`, `utils/text`, `utils/sort`, `utils/form-schemas`, `utils/customization/color.ts` | Yes, if moved out of `apps/web` into a shared package. Pure TS. |
| `utils/api/invalidate-content-state.ts`, `patch-embedded.ts`, `tracking-args.ts`, query defaults | Logic yes; needs a small split from web-only bits. |
| TanStack Form + Zod schemas, Zustand stores | Yes. Both libraries work unchanged in React Native. |
| `components/ui` (Base UI + shadcn + cva), Plate editor, react-markdown, dnd-kit, Turnstile widget, react-photo-view | No. All DOM. Rebuild the UI layer. |
| Design tokens in `globals.css` (oklch, `oklch(from var(--brand) …)` for user brand colors) | Token names and values yes. React Native does not parse oklch or relative color syntax, so the tokens must be compiled to hex/rgb at build time, and the user brand color must be derived in JS at runtime. |

Conclusion: the data layer is the expensive part and it is already portable. The UI layer is not portable and should not be ported; it should be rebuilt in native idioms.

## Backend constraints found

- `POST /auth/login` and `/auth/signup` require a Cloudflare Turnstile token in the `captcha` header. Mobile needs Turnstile rendered in a WebView, which loads a small page from a hostname allowed for the site key.
- Google sign-in (`/auth/oauth/{provider}` + token exchange) is built around the web redirect. Mobile needs one of two things: an https redirect on hikka.io that hands the code back through a universal/app link, or a new endpoint that accepts a Google ID token from native Google Sign-In. The second gives the native account sheet and is the better UX. Either way it is a backend change.
- The third-party OAuth flow (`/auth/token/request`) issues `forbid_thirdparty`-restricted tokens. The app is first-party, so it should use the normal login token, not OAuth.
- There is no push-device registration endpoint. Push notifications are a later phase and need backend work.

## Recommended stack

| Concern | Choice | Why |
| --- | --- | --- |
| Runtime | Expo SDK 57 (React Native 0.86, New Architecture), dev client + EAS Build/Update | Current SDK; 57 also fixes the SDK 56 Hermes memory regression with Reanimated. |
| Navigation | Expo Router: native Stack + Native Tabs | Real `UINavigationController`/`UITabBar` (Liquid Glass on iOS 26) and Material bottom navigation on Android, for free. This is most of what makes an app feel native. |
| Native controls | `@expo/ui` (SwiftUI / Jetpack Compose, stable since SDK 56) for menus, context menus, pickers, switches, sliders, date pickers, settings forms | Platform-correct controls without hand-building them per OS. |
| Sheets | Expo Router `presentation: 'formSheet'` with detents | Native sheets instead of a JS bottom-sheet library. |
| Server state | TanStack Query v5 + `@hikka/api` | Same as web. Add `focusManager` (AppState) and `onlineManager` (NetInfo), plus query persistence to MMKV for instant cold starts. |
| Client state | Zustand | Same as web. |
| Storage | `expo-secure-store` for the auth token, `react-native-mmkv` for prefs and the query cache | |
| Lists | FlashList v2 | Catalog, lists, comments and feeds are long; FlatList is not enough. |
| Images | `expo-image` | Disk cache, blurhash/placeholder, recycling-friendly. Keep imgproxy sizing from `utils/imgproxy.ts`. |
| Styling | Uniwind (free tier) for our own content components; no styling layer on native controls | See next section. |
| Animation / gestures | Reanimated 4, Gesture Handler, `expo-haptics` | |
| Forms | TanStack Form + the shared Zod schemas | Same as web, minus the DOM field components. |
| Markdown (comments, synopses) | `marked` lexer (same library and 12.x line as the web) with custom extensions for `:::spoiler`, `:spoiler[...]`, `~~` and `@mentions`, rendered by our own small React Native renderer (`components/markdown`); read-only in v1, plain `TextInput` for writing comments | Plate is DOM-only. The mention wire format `[@user](<site>/u/<ref>)` must be preserved on write. See "Markdown renderer choice". |
| Compiler | React Compiler (Expo supports it) | Same as web. |

## Styling: NativeWind or not

Tailwind-style classes are worth keeping: the team reads them fluently, the web tokens (`bg-background`, `text-muted-foreground`, `bg-watching`, …) carry over by name, and `cva` + `tailwind-merge` patterns still work.

The engine matters more than the syntax:

- NativeWind v4 (npm `latest`) is built on Tailwind v3. The web is on Tailwind v4 with CSS-first `@theme` config, so we would maintain a second config format.
- NativeWind v5 (Tailwind v4) is at 5.0.0-rc as of September 2026, not stable yet.
- Uniwind is a Tailwind v4 engine for React Native, MIT-licensed, Expo-only (fine for us), and documented as production-ready. It reads the same CSS-first config as the web. A paid Pro tier adds a C++ engine with zero re-renders; we can upgrade to it later if profiling calls for it.

Recommendation: Uniwind, with a hard rule that classes style only our own content components (cards, posters, rows, badges, score chips). Native chrome (tabs, headers, sheets, menus, switches, pickers) comes from Expo Router and `@expo/ui` and is never restyled to look like the web. The biggest native-feel risk with any Tailwind engine is copying web class strings onto custom-built controls and getting a web app in a shell.

The spike confirmed this: the web tokens compile to hex for light and dark, content rows render in a FlashList, and the theme follows the system appearance. If Uniwind falls short later, the fallback is NativeWind v5 once it is stable.

## Design first or features first

Neither extreme. Do not do a full Figma pass up front, and do not port screens one-to-one from the web either.

1. **Feature map** (1-2 days): list every web route and feature, and mark each one MVP / later / web-only. Proposed MVP: home feed, catalog with filters, search, anime/manga/novel detail, characters and people, watch/read tracking, user profile with lists, history, favourites, notifications (in-app), comments (read + plain write), login. Later: collections, articles (read), settings and customization, push notifications. Web-only for now: the edit/contribution system, the article editor, OAuth app management.
2. **Platform conventions decide the shell**: tab bar layout (for example Home, Catalog, Search, Lists, Profile), stack navigation, large titles on iOS, native sheets and menus. No design work needed; this is Apple HIG and Material 3.
3. **A small design pass on the brand surfaces only**: the content card, the detail page header (poster, backdrop, scores, status), the list row, and the tracking sheet. These carry Hikka's identity and appear on every screen. Three or four screens in Figma, or designed directly in code against the tokens.
4. Build vertically, one feature end to end at a time, starting with detail + tracking, since that is the core loop and it exercises the API, auth, caching and cache invalidation together.

## Repository layout

Decided: `apps/mobile` (`@hikka/mobile`) inside `hikka-next`. `@hikka/api` is consumed as `workspace:*`; pure utils move into a shared `packages/core` as features need them (the spike keeps a local `getTitle` copy). Expo configures Metro for pnpm monorepos itself; no `watchFolders`.

## Spike results

Built and run on the iOS 26 simulator in Expo Go 57: Native Tabs (catalog + `role="search"` tab), large titles, `Stack.SearchBar` in the tab bar, infinite catalog via `paginatedInfiniteOptions(searchAnimeInfiniteOptions(...))`, search, anime detail, light and dark.

What it took:

- **Two React versions in one workspace.** Web runs React 19.3.0; Expo SDK 57 ships React Native 0.86 with a renderer built for React 19.2.3, and a mismatch is a hard runtime error. The root `pnpm.overrides` no longer force `react`/`react-dom`; each app pins its own. `@types/react` stays overridden to 19.3.0 (types only; `expo install --check` warns about it).
- **Metro pins the singletons.** `@hikka/api` resolves `@tanstack/react-query` through its own link, which is bound to React 19.3. `metro.config.js` resolves `react`, `react-dom` and `@tanstack/react-query` from the app, so the bundle carries exactly one React 19.2.3 and one react-query (checked in the full iOS bundle).
- **Optional `react-native` peers.** Once React Native is in the workspace, pnpm links it as an optional peer of `react-tracked` and `use-context-selector` (Plate → zustand-x) in the web graph. Two `"…>react-native": "-"` overrides cut that edge, so the web install and Docker builder do not fetch React Native.
- **Tokens.** `pnpm --filter @hikka/mobile tokens` regenerates `src/theme.css` from `apps/web/src/globals.css`: it follows the CSS cascade (`@theme static`, `:root`, `.dark`, the relative-oklch `@supports` block), resolves `var()` chains and `oklch(from var(--brand) …)`, and writes hex under Uniwind's `@variant light/dark`. Re-run it when web tokens change.
- **Not solved yet:** the app icon and splash are Expo placeholders (web icons top out at 180 px, 1024 px is needed); Android has not been run.

## Markdown renderer choice

Decided 2026-10-20 (markdown task). The viewer must render the web's dialect: `:::spoiler` containers and `:spoiler[text]` inline directives, `[@name](<site>/u/<ref>)` mentions with live avatars, `~~` strikethrough, hikka.io links that open in-app, and no code, tables or bare-url autolinks (the web disables them too).

| Option | Verdict |
| --- | --- |
| `react-native-marked` 8.3 (marked 18, actively released, New Architecture, selectable text) | Rejected. Its `Parser` is a fixed `switch` over marked token types: a custom token type (directive, spoiler) falls to `default: return null`, so directives can only be smuggled through the `html` token. Inline children are flattened to `renderer.text(token.raw)`, which loses a nested stateful spoiler or mention inside a paragraph. It also needs `react-native-svg` and seven runtime dependencies, and the default `Markdown` component is a `FlatList` (nested virtualized list in a `ScrollView` or `FlashList` row; only `useMarkdown` avoids that). |
| `react-native-enriched-markdown` 1.1 (Software Mansion, native cmark text view, active) | Rejected for now. Best selection and performance, New Architecture only, but it needs native code and does not run in Expo Go (our current loop), has no extension point for custom directives, and cannot embed a React view (avatar) in running text. Revisit if long comment threads are slow. |
| `react-native-markdown-display` / `@ronradtke/react-native-markdown-display` (markdown-it) | Rejected. The original is unmaintained since 2023; the fork is maintained but markdown-it plugins for container directives would still be a second parser with different edge cases than the web's `marked`/micromark behaviour, plus `react-native-fit-image` and an icon font dependency. |
| `react-native-remark` (unified) | Rejected. Last release 2025-06, pulls the whole unified stack and a syntax highlighter; Hermes parse cost per comment row is the worst of the set. |
| **`marked` lexer + own renderer (chosen)** | `marked.lexer` with four small extensions gives a plain token tree; a ~200 line recursive renderer maps it to `Text`/`View`. Pure JS (New Architecture irrelevant, works in Expo Go), the same library the web already depends on, no native module, no `react-native-svg`. Nested `Text` keeps selection and lets spoilers, links and mentions live inside a paragraph. Lexing is memoised per source string, cheap enough for FlashList rows. |

Web-dialect decisions that follow from the web's remark pipeline (`remark-disable-tokenizer`, no `remark-gfm`): the lexer runs with `gfm: false`, so tables, task-list markers and bare-url autolinks stay literal text, as do code and fenced blocks; headings render as plain paragraphs; raw HTML stays literal text (react-markdown shows it as text); soft line breaks collapse to a space (HTML does the same), hard breaks (two trailing spaces or backslash) are real breaks.

## First milestones

1. ~~Spike~~: done.
2. Auth: Turnstile WebView login, token in SecureStore, `setAuthToken` on boot. Agree on the Google sign-in backend endpoint.
3. Detail + tracking (watch/read status sheet, full-snapshot PUT via `tracking-args`).
4. Catalog + search + filters.
5. Profile, lists, history, notifications.
6. Internal TestFlight / Play internal testing via EAS.

## Sources

- Expo SDK 57 changelog: https://expo.dev/changelog/sdk-57
- Expo UI stable in SDK 56: https://expo.dev/blog/expo-ui-stable-sdk-56
- Expo Router v56: https://expo.dev/blog/expo-router-v56-decoupling-from-react-navigation
- Expo Router v55 (native tabs, toolbars, zoom transitions): https://expo.dev/blog/expo-router-v55-more-native-navigation-more-powerful-web
- NativeWind releases (v5 RC): https://github.com/nativewind/nativewind/releases
- NativeWind v5 release plan: https://github.com/nativewind/nativewind/discussions/1818
- Uniwind free vs Pro: https://docs.uniwind.dev/pro-version
- Uniwind vs NativeWind: https://uniwind.dev/vs-nativewind
