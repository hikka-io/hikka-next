# Hikka mobile: stack and approach

Status: accepted, 2026-10-20; spike done (see "Spike results"). Based on a review of `hikka-next` (web) and `hikka` (backend).

## What the web app gives us

| Web piece | Reusable on mobile? |
| --- | --- |
| `@hikka/api` (hey-api client, Zod-validated SDK, TanStack Query options, `paginatedInfiniteOptions`, `HikkaApiError`, `API_LIMITS`) | Yes, as is. It is plain fetch + Zod + react-query, no DOM. This is about 22k lines we never write again. |
| `transport.ts` browser singleton (`configureBrowserClient`, `setAuthToken`, `auth` header) | Yes. Mobile is one long-lived client, same as the browser. The SSR per-request client is irrelevant. |
| `utils/labels`, `utils/i18n` (Ukrainian declension, word forms, number/relative time), `utils/title`, `utils/season`, `utils/text`, `utils/sort`, `utils/customization/{color,defaults}` | Moved into `@hikka/core`. `utils/form-schemas` stays in web (i18next). |
| `utils/api/patch-embedded.ts`, `tracking-args.ts`, `tracking-entry.ts`, `api-error-message.ts`, `query-id.ts`, `mutation-meta.ts` | Moved into `@hikka/core`. `invalidate-content-state.ts` and query defaults stay per app (they touch the QueryClient). |
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

Decided: `apps/mobile` (`@hikka/mobile`) inside `hikka-next`. `@hikka/api` and `@hikka/core` (runtime-agnostic labels, i18n, title, sort and markdown helpers shared with the web app) are consumed as `workspace:*`; further pure utils move into `packages/core` as features need them. Expo configures Metro for pnpm monorepos itself; no `watchFolders`.

## Spike results

Built and run on the iOS 26 simulator in Expo Go 57: Native Tabs (catalog + `role="search"` tab), large titles, `Stack.SearchBar` in the tab bar, infinite catalog via `paginatedInfiniteOptions(searchAnimeInfiniteOptions(...))`, search, anime detail, light and dark.

What it took:

- **Two React versions in one workspace.** Web runs React 19.3.0; Expo SDK 57 ships React Native 0.86 with a renderer built for React 19.2.3, and a mismatch is a hard runtime error. The root `pnpm.overrides` no longer force `react`/`react-dom`; each app pins its own. `@types/react` stays overridden to 19.3.0 (types only; `expo install --check` warns about it).
- **Metro pins the singletons.** `@hikka/api` resolves `@tanstack/react-query` through its own link, which is bound to React 19.3. `metro.config.js` resolves `react`, `react-dom` and `@tanstack/react-query` from the app, so the bundle carries exactly one React 19.2.3 and one react-query (checked in the full iOS bundle).
- **Optional `react-native` peers.** Once React Native is in the workspace, pnpm links it as an optional peer of `react-tracked` and `use-context-selector` (Plate → zustand-x) in the web graph. Two `"…>react-native": "-"` overrides cut that edge, so the web install and Docker builder do not fetch React Native.
- **Tokens.** `pnpm --filter @hikka/mobile tokens` regenerates `src/theme.css` from `apps/web/src/globals.css`: it follows the CSS cascade (`@theme static`, `:root`, `.dark`, the relative-oklch `@supports` block), resolves `var()` chains and `oklch(from var(--brand) …)`, and writes hex under Uniwind's `@variant light/dark`. Re-run it when web tokens change.
- **Since solved:** the markdown viewer (see "Markdown renderer choice"), the brand icon and splash, and the Android run (see "Android findings").

## Android findings

Run 2026-10-20 on the `Medium_Phone_API_36` emulator (1080x2400, 420 dpi, gesture navigation), Expo Go 57.0.0 installed by `CI=1 pnpm --filter @hikka/mobile android --port 8085`, light and dark via `adb shell cmd uimode night yes|no`. Screenshots (adb `screencap`) are kept outside the repo in the session notes folder `android-shots/` (`01`-`11`, light and dark).

What works as is, with no code change:

- **Native Tabs render as Material 3 bottom navigation** with the pill active indicator; `md` icons (`grid_view`, `search`) and the Ukrainian labels show correctly. Edge-to-edge is right: the status bar draws over the opaque header, the list scrolls to the tab bar, and the tab bar sits above the gesture bar with the system inset.
- **Catalog and detail**: the FlashList renders posters, scores and type/year; tapping a row pushes the detail with the native back arrow; the system Back gesture and `adb input keyevent BACK` pop it. The detail opens the same from the search tab.
- **Dark mode** follows the system (content is pure black like the web; header and tab bar take the Material dark surface, see below). The `bg-card`/`bg-secondary` surfaces and the pink score chip read well in both schemes.
- **Search**: `Stack.SearchBar` becomes a search action in the header; tapping it expands a native search field (placeholder "Назва аніме", clear button) and the results list fills the screen. Typing `frieren` returns the right anime and the debounce via `useDeferredValue` behaves.

Differences from iOS, to accept or fix:

1. **`role="search"` is a plain tab on Android.** The search tab is a normal bottom-navigation item with a `search` icon, and it also has the header search action, so there are two entry points to the same screen. This is acceptable (Material apps do this) and needs no fix; the header action is the real field.
2. **No large title.** `<Stack.Title large>` is ignored on Android: both tab roots show a small left-aligned title in the header. That is the Material top app bar and is the intended native look (DESIGN.md section 8). Keep `large` for iOS; do not fake a large title on Android.
3. **Tab bar rides above the keyboard.** When the search field is focused the bottom navigation moves up with the keyboard (`adjustResize`), so with the keyboard open the results area is only about a third of the screen. This is the platform default for Native Tabs; the fix is in `src/app/_layout.tsx`: set `NativeTabs` `hidden` while the keyboard is visible on Android (a `Keyboard` show/hide listener in the layout), or set `android.softwareKeyboardLayoutMode` to `pan` in `app.json` (not recommended: it moves the header out of view).
4. **Tab indicator and ripple use the default Material tint**, not the brand pink. `NativeTabs` accepts `indicatorColor`, `rippleColor`, `iconColor` and `labelStyle` (Android props). Route fix in `src/app/_layout.tsx`: pass `indicatorColor` and `rippleColor` from the `primary` token (light `#ffe6f5`, dark `#0f0b0d`) and `iconColor`/`labelStyle.selected.color` from `primary-foreground` (light `#a3287e`, dark `#ef71c3`), read through `useCSSVariable` from Uniwind so no hex is hard-coded.
5. **Header and tab bar are not pure black in dark.** Material draws them as the dark surface (about `#1c1b1f`), so there is a visible step against the black content area. Decision in DESIGN.md section 8: leave native chrome on the system surface; do not force the header or tab bar to black. If the owner prefers a flush look, pass `backgroundColor` to `NativeTabs` and `headerStyle` to the stacks from the `background` token on Android only.
6. **Duplicate title on detail.** The header showed the title and the content showed it again at the top. Fixed by the content detail task: the header title starts empty and appears once the hero title scrolls under the bar (DESIGN.md section 12), on both platforms.
7. **Synopsis shows raw Markdown** (`[text](https://hikka.io/…)`, `**bold**`), as on iOS; the markdown viewer task owns the fix. Also visible: the synopsis links `https://hikka.io/character/…` (singular) in one title, a data issue, not an app bug.
Expo Go on Android specifics:

- Expo Go's floating **Tools button** (gear, top right) sits exactly on the header search action, so the first tap opens the dev menu instead of search. Turn it off once in the dev menu (Tools button toggle); it does not exist in a dev client build. It also appears over the header in screenshots.
- The first launch shows the Expo Go developer-menu sheet; dismiss it with the close button.
- `adb shell input text` types Latin only; Cyrillic queries need the on-screen keyboard, so search was verified with a Latin query.

Dev client and brand assets (verified the same day): `npx expo run:android --port 8085` built a debug dev client in about 5 minutes (JDK 21 from Android Studio, JDK 24 on the PATH was not used), installed it and connected to Metro; the pink adaptive icon shows correctly in the launcher (circle mask), the dev launcher and dev menu show the logo, the Expo Go Tools button is absent, and the app behaves as in Expo Go. The light splash (brand-pink X on white, centered) was captured on cold start; the dark splash was verified through the generated `values-night/colors.xml` (`#000000`) and `drawable-night-*` images because the cold-start window is too short to screenshot reliably. With `expo-dev-client` installed a bare `expo start` targets the dev client, so the `dev`, `ios` and `android` scripts pass `--go` and `dev-client` was added.

Not covered: tablets and foldables, 3-button navigation, font scale above 1.0, predictive back (disabled in `app.json`), screen readers.

## Auth (milestone 2)

Built and run on the iOS 26 simulator against the local backend:

- **Feature.** Everything lives in `src/features/auth/` (barrel `index.ts`); `src/app/login.tsx` and `src/app/(tabs)/(profile)/index.tsx` only compose it.
- **Login sheet.** `src/app/login.tsx` is a root-stack route presented as a native `formSheet` (`fitToContents`, grabber) over the tabs, so the tabs moved into `src/app/(tabs)/`. Username or email + password through TanStack Form, like the web login: an identifier containing `@` is sent as `email`, anything else as `username`. Zod schemas are copied from the web `form-schemas.ts` (bounds from `API_LIMITS`). `HikkaApiError` messages are shown as returned (already Ukrainian); anything else gets a Ukrainian fallback. After login the sheet goes back, or replaces to `/` when it was deep-linked.
- **Token.** `auth-token.ts` keeps it in `expo-secure-store`. The root layout reads it synchronously (`readStoredAuthToken`, `SecureStore.getItem` in a try/catch) and passes it as `authToken` to `configureBrowserClient`, so the token is set before the first query with no splash gating. `signIn`/`signOut` (`session.ts`) write or delete it, call `setAuthToken` and reset every query, since cached responses can carry viewer state. The web logout only clears cookies; there is no revoke endpoint to call.
- **Session.** `useSession()` (`use-session.ts`) wraps `profileOptions()`, enabled by a reactive token (`useSyncExternalStore`). The Profile tab (`ProfileSummary`) shows the avatar, username and email, with logout as a header toolbar button whenever a token is stored. A dead token signs out: the backend answers a revoked or expired token with HTTP 400 and `auth:invalid_token` / `auth:token_expired` (not 401), so `isDeadTokenError` checks those codes plus 401.
- **Captcha.** `captcha.tsx` renders Turnstile in `react-native-webview` from an inline page whose `baseUrl` is `https://hikka.io`. In development, `EXPO_PUBLIC_CAPTCHA_BYPASS` (the backend `captcha.test` value) skips the widget, mirroring the web `VITE_CAPTCHA_BYPASS`; it is gated on `__DEV__`.

Verified: sign in with a username and with an email, wrong password, an expired token signing out on launch, validation messages, token restored after a cold start, logout persisted after a cold start. The WebView bridge was checked with Cloudflare's always-pass test key (`1x00000000000000000000AA`): the token reaches the form.

**Open: the production site key in the WebView.** The WebView only loads hikka.io in the top frame and challenges.cloudflare.com in subframes; other https links open externally, and messages are accepted only from the hikka.io origin. With that configuration the real key renders the interactive "Підтвердьте, що ви людина" checkbox; whether a person's tap passes has not been tested (an agent must not solve captchas). Before it, the challenge ended in error `300031` (widget crashed) and stayed on "Перевірка…". Safari on the same simulator passes on hikka.io/login. Loading a real hikka.io document instead of an inline page did not help, and neither did a Safari user-agent suffix or shared/third-party cookies. Next: try a physical device (the simulator WKWebView may be what Cloudflare rejects); check the widget's mode and pre-clearance settings in the Cloudflare dashboard; if WebViews stay unreliable, ask Cloudflare about their mobile guidance or let the backend accept another proof for first-party mobile clients (App Attest / Play Integrity).

### Google sign-in: backend endpoint needed

Not implemented. The current flow (`GET /auth/oauth/google` for a redirect URL, then `POST /auth/oauth/google` with `{ code }`) exchanges a web authorization code bound to the web redirect URI, so a native app cannot use it. Native Google Sign-In (iOS SDK / Android Credential Manager) returns an ID token instead. Proposed endpoint:

- `POST /auth/oauth/google/id-token` with body `{ "id_token": "<JWT>" }`, returning `TokenResponse` (same as the code flow).
- Verify the JWT against Google's keys (`google.oauth2.id_token.verify_oauth2_token`): `iss` is `accounts.google.com`, `aud` is one of the configured iOS / Android / web client IDs (new setting, for example `oauth.google.audiences`), `exp`, and `email_verified`.
- Then reuse the code flow unchanged: the JWT `sub` is the same Google user id that `userinfo/v2/me` returns as `id`, so `get_oauth_by_id(sub, "google")` finds already linked accounts; keep the `email-exists` check, `create_oauth_user`, `update_oauth_timestamp`, the `LOG_LOGIN_OAUTH` log and `create_auth_token`.
- No captcha, like the existing OAuth flow. It needs an iOS and an Android OAuth client in the Google Cloud project.

## Auth flows: signup, password reset, activation

Built in `src/features/auth/` and verified on the iPhone 16 Pro / iOS 18.2 simulator against the local backend (captcha bypass, throwaway account, tokens read from `service_email_messages`).

- **Routes.** Root-stack `formSheet`s: `signup`, `reset` (request), `auth/reset/[token]` (confirm), `auth/activate/[token]`. The login sheet links to `signup` ("Зареєструйтесь зараз") and `reset` ("Забули пароль?") with `router.replace`, so only one sheet is ever open. `reset/[token]` is a redirect alias to `auth/reset/[token]`, because the web serves its form at `/reset/<token>`.
- **Email links.** The backend templates (`app/sync/data/*.markup`) send `https://hikka.io/auth/activate/<token>` and `https://hikka.io/auth/reset/<token>`; the file routes match those paths, so one route table serves the custom scheme (`hikka://auth/activate/<token>`), Expo Go (`exp://<host>/--/auth/...`) and universal links. Activation calls `POST /auth/activation` and signs the user in with the returned token; reset confirm calls `POST /auth/password/confirm` and signs in too. Both close the whole sheet stack (`useCloseAuthFlow`: `dismissAll`, then back, then replace to `/`), since a link may open over another auth sheet. The root layout sets `unstable_settings.anchor = '(tabs)'` so a link that cold-starts the app keeps the tabs under the sheet instead of showing the sheet as the only screen.
- **Signup.** Username (`usernameSchema`, the API pattern `^[A-Za-z][A-Za-z0-9_]{4,63}$`), email (`emailSchema`, no `+`, signup only: login keeps the free-form identifier), password and confirmation (`matchFields`), Turnstile. After success the user is signed in and sees a toast; the not-activated notice (`ActivationAlert`, web copy) sits in the Profile tab.
- **Resend.** `POST /auth/activation/resend` needs the session and fails with `auth:activation_valid` while the previous token is still valid; the notice maps that to the web's "link still active" toast. The web's code `auth-modal:activation_valid` is stale; the backend sends `auth:activation_valid`.
- **Password reset request has no captcha.** The backend `POST /auth/password/reset` has no `check_captcha` dependency and the web form has no captcha either, so the mobile form sends none. Only login and signup use Turnstile.
- **Expiry.** Activation links stay valid for as long as `activation_expire` says; an invalid or expired token shows the backend message ("Поганий токен активації") in the sheet with a close button, where the web silently redirects home.

### Universal links and Android App Links (not enabled, server untouched)

The custom scheme works today. Opening the same `https://hikka.io/auth/...` links from the mail app straight in the app needs both sides:

1. `app.json`, iOS: `"ios": { "associatedDomains": ["applinks:hikka.io"] }` (EAS adds the Associated Domains capability to the App ID).
2. `app.json`, Android: under `"android"`, `"intentFilters": [{ "action": "VIEW", "autoVerify": true, "data": [{ "scheme": "https", "host": "hikka.io", "pathPrefix": "/auth/activate" }, { "scheme": "https", "host": "hikka.io", "pathPrefix": "/auth/reset" }], "category": ["BROWSABLE", "DEFAULT"] }]`. Keep the prefixes narrow so the rest of the site stays in the browser.
3. hikka.io must serve `https://hikka.io/.well-known/apple-app-site-association` (no extension, `application/json`, no redirect): `{ "applinks": { "details": [{ "appIDs": ["<TEAMID>.io.hikka.app"], "components": [{ "/": "/auth/activate/*" }, { "/": "/auth/reset/*" }] }] } }`.
4. hikka.io must serve `https://hikka.io/.well-known/assetlinks.json`: `[{ "relation": ["delegate_permission/common.handle_all_urls"], "target": { "namespace": "android_app", "package_name": "io.hikka.app", "sha256_cert_fingerprints": ["<release signing key SHA-256>", "<Play app-signing key SHA-256 if used>"] } }]`.
5. The web app's `/auth/activate/$token` server route currently consumes the token in the browser and sets the cookie; with universal links on, the OS opens the app first and the server route is never hit, so the token is spent by the app. Both can coexist: a device without the app falls through to the website.

Universal links do not work in Expo Go or the simulator without a dev build signed with the domain entitlement; test with `xcrun simctl openurl booted hikka://auth/activate/<token>` (dev build) or the `exp://` form (Expo Go).

### iOS 18.2 findings (iPhone 16 Pro simulator, no Liquid Glass)

- Form sheets are plain full-width sheets with the system corner radius, not the floating glass card of iOS 26. A `fitToContents` sheet leaves a light-gray strip under the content (the screen's own background below the measured height); the iOS 26 card shows the same strip. Not fixed here: it needs a `contentStyle` background on the sheet screens in the root layout.
- A `sheetAllowedDetents: [1]` sheet whose root is a plain `View` showed a gray area under the form on iOS 18; the signup form is a `ScrollView` with `flex-1`, which fills the sheet and also handles the keyboard (`automaticallyAdjustKeyboardInsets`).
- **Strong Password autofill wedges two new-password fields.** With `textContentType="newPassword"` on both password and confirmation, iOS 18.2 laid its yellow "Automatic Strong Password cover view text" over both fields and typing stopped working. Only the first field keeps `newPassword` (so iOS can still offer to generate and save a password); the confirmation field has no content type and only gets `autoComplete="new-password"` on Android, because RN maps `autoComplete` onto `textContentType` on iOS. Reset-confirm does the same.
- Dismissing or replacing a sheet that holds a filled password field makes iOS offer "Save Password?" (also after a failed login). That is the system's normal credential-capture behaviour with `textContentType="password"`; it is left on because saving the account is the point on a successful login.
- Dark mode: tokens, inputs, the secondary button and the destructive text all render correctly; the sheet background follows the theme.
- Simulator input quirk: `control text` returns before the characters render, and a tap during that window drops the rest of the text. Wait a few seconds between fields.

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
2. Auth: done, except Turnstile with the production key (see "Auth") and Google sign-in (needs the backend endpoint above).
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
