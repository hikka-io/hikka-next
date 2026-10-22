# @hikka/mobile

Expo (SDK 57) app for iOS and Android. Stack and approach: [STACK.md](STACK.md).

## Run

```bash
pnpm install
pnpm build:api
pnpm --filter @hikka/mobile ios
```

`ios` and `android` pass `--go` (Expo Go) on purpose: once `expo-dev-client` is installed, a bare `expo start` targets the dev client instead. `ios` starts Metro and opens the app in Expo Go on a booted simulator (Expo Go 57 is installed if needed). When port 8081 is taken, add `--port <n>`: `pnpm --filter @hikka/mobile ios --port 8082`. Point at another API with `EXPO_PUBLIC_API_URL`.

## Android

Start an emulator (`~/Library/Android/sdk/emulator/emulator -avd Medium_Phone_API_36`), then:

```bash
pnpm --filter @hikka/mobile android --port 8085
```

Expo Go 57 is installed on the emulator if needed. Expo Go's floating Tools button covers the header's search action; switch it off once in the dev menu.

## Dev client and EAS builds

Expo Go is enough while the app uses only the native modules bundled in Expo Go. It stops being enough as soon as a dependency needs custom native code or config that Expo Go does not ship: `react-native-mmkv` (planned for prefs and the query cache), a native Google Sign-In module, push notifications with a project of our own, universal links on our domain, or any config plugin. Then build a dev client, which is the same app plus the dev menu and Metro connection, with our own native modules.

Local build (needs Xcode for iOS, Android Studio JDK 21 and the Android SDK for Android; `ios/` and `android/` are generated and gitignored):

```bash
pnpm --filter @hikka/mobile exec expo run:ios --port 8085
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ANDROID_HOME=~/Library/Android/sdk pnpm --filter @hikka/mobile exec expo run:android --port 8085
```

The first build takes several minutes; it installs the app on the booted simulator or emulator and starts Metro. After that, start Metro alone with `pnpm --filter @hikka/mobile dev-client --port 8085` and open the installed "Hikka" app. Rebuild only when native dependencies, `app.json` or the icon assets change. Do not run two Gradle builds at once.

EAS (`eas.json`, needs an Expo account and `eas login`, not set up in this repository yet):

| Profile | Use | Output |
| --- | --- | --- |
| `development` | dev client | iOS simulator build, Android APK |
| `preview` | internal testing | Android APK, iOS ad hoc (internal distribution) |
| `production` | store release | Android AAB, iOS App Store build, auto-incremented version |

```bash
eas build --profile development --platform android
eas build --profile development --platform ios   # simulator .app
```

Install the Android APK by opening the build's link on the device, or `adb install <file>.apk`; drag the iOS simulator `.app` onto the simulator. Device builds for iOS need an Apple Developer account and registered devices (`eas device:create`).

## App icon and splash

`pnpm --filter @hikka/mobile icons` renders `apps/web/public/logo-icon.svg` into `assets/images/` (app icon, Android adaptive foreground/background/monochrome, splash icon) with colors from `src/theme.css`, and syncs the adaptive icon and splash background colors into `app.json`. Re-run it when the logo or brand token changes and commit the PNGs. Icons and splash only show in a native build (dev client or store), not in Expo Go.

Against the local backend (`./dev.sh start` in the backend repo, API on :8888), set the captcha bypass to the backend's `captcha.test` value; it only works in development builds:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8888 EXPO_PUBLIC_CAPTCHA_BYPASS=fake_captcha pnpm --filter @hikka/mobile ios --port 8082
```

## End-to-end tests (Maestro)

[Maestro](https://maestro.mobile.dev) flows in `e2e/` drive the app through Expo Go on an iOS simulator. They are a review and regression tool for the core loop, run by hand; they are not in CI because they need a simulator, Metro and (for the signed-in suite) the local backend.

Install (needs Java 17+; no admin rights). The official `curl -Ls "https://get.maestro.mobile.dev" | bash` also appends a PATH line to `~/.bash_profile` and `~/.zshrc`; to skip that, download and run the script with its "Installing" section removed. It unpacks Maestro 2.x into `~/.maestro`. `scripts/e2e.sh` adds `~/.maestro/bin` to `PATH` itself; for ad-hoc `maestro` commands add it yourself.

Layout:

- `e2e/public/`: read-only flows against production: Home, Catalog (open a title and back), Latin search, a character, a public user and their list, a collection, an article, the schedule, the 18+ gate on an NSFW title (`E2E_NSFW_SLUG`), the image viewer from an article image (`E2E_IMAGE_ARTICLE`), a title's statistics block. They assume a signed-out app.
- `e2e/local/`: signed-in flows against the local backend: login, add to planned and edit progress and score and delete, post and edit and delete a comment, follow and unfollow, notifications, favourite and unfavourite a title, logout. Each flow signs in on its own when needed; `config.yaml` fixes the order.
- `e2e/subflows/`: `launch` (stop Expo Go, open the Metro URL, wait for Home), `tab`, `back`, `login`, `logout`, `ensure-login`, `open-anime`, `open-first-card`, `remove-from-list`.

Flows target visible Ukrainian copy and accessibility labels. Tabs are tapped by their icon label (`home`, `Grid view`, `account`, `Search`) because the tab titles repeat as screen headers; Back is the navigation `BackButton` id. Lists whose first item changes over time use regexes or relative selectors (`below`, `rightOf`).

Run (Metro for the app under test must already be running; Expo Go 57 installed on the simulator, which `pnpm --filter @hikka/mobile ios` does once):

```bash
# Production API, signed out
pnpm --filter @hikka/mobile dev --port 8086
METRO_URL=exp://localhost:8086 E2E_DEVICE=<simulator UDID> pnpm --filter @hikka/mobile e2e

# Local backend: serve the bundle with the local API and the captcha bypass
EXPO_PUBLIC_API_URL=http://localhost:8888 EXPO_PUBLIC_CAPTCHA_BYPASS=fake_captcha pnpm --filter @hikka/mobile dev --port 8086
E2E_USERNAME=<user> E2E_PASSWORD=<password> E2E_FOLLOW_USER=<other user> METRO_URL=exp://localhost:8086 E2E_DEVICE=<simulator UDID> pnpm --filter @hikka/mobile e2e:local
```

`EXPO_PUBLIC_*` values are baked into the bundle, so the production and the local suite need different Metro instances (restart with `--clear` when switching). Run one flow with `pnpm --filter @hikka/mobile e2e -- e2e/public/05-user-list.yaml` (extra arguments replace the suite directory).

| Variable | Used by | Meaning |
| --- | --- | --- |
| `METRO_URL` | both | Metro URL as Expo Go opens it, default `exp://localhost:8081` |
| `E2E_DEVICE` | both | Simulator UDID or name; default is the booted device |
| `E2E_PUBLIC_USER` | `e2e` | Public username for the profile flow, default `olexh` |
| `E2E_USERNAME`, `E2E_PASSWORD` | `e2e:local` | Throwaway local account (required) |
| `E2E_FOLLOW_USER` | `e2e:local` | A second local account to follow and unfollow (required) |
| `E2E_ANIME_QUERY` | `e2e:local` | Search query that finds an anime, default `frieren` |

Local accounts: sign up two throwaway users in the app or with `POST /auth/signup` (header `captcha: fake_captcha`). Commenting needs an activated account: read the activation token from `service_email_messages` in the local Postgres and `POST /auth/activation`. Never commit credentials; pass them through the environment.

The public suite also passes on the iOS 18.2 simulator (iPhone 16 Pro): the `tab` and `back` subflows fall back to the tab title and a tap by position, since iOS 18 has no icon labels or `BackButton` id, and the Search tab is pulled down first because iOS 18 collapses its header field on the first visit. Expo Go's floating tools button on that simulator covers the image viewer's close button, so that flow dismisses the viewer by dragging.

Notes for writing flows: the iOS "Save Password?" system prompt appears after login (the `login` subflow dismisses it); a text match is a full-string, case-insensitive regex, so list rows with composite labels (`Title, subtitle, status`) need `.*`; Maestro's `text` also matches the search field's own contents. The tracking and follow flows first undo leftovers of an aborted run, and every mutating flow cleans up after itself; the comment flow deletes its own comment.

## Layout

- `src/app/` — Expo Router routes. The root is a stack holding `(tabs)` and the `login` form sheet. `(tabs)/(home)`, `(catalog)`, `(profile)` and `(search)` are the native tabs, each with its own stack. Screens reachable from every tab (content, characters, people, user pages) live once in `(tabs)/(home,catalog,profile,search)/` and push onto whichever tab's stack is active.
- `src/components/`, `src/utils/` — non-route code.
- `src/theme.css` — generated from `apps/web/src/globals.css` by `pnpm --filter @hikka/mobile tokens`; do not edit.
- `src/uniwind-types.d.ts` — generated by Metro (Uniwind `className` types); committed so `tsc` works without Metro.

## Rules

- Native chrome (tabs, headers, search, sheets, menus, pickers) comes from Expo Router and `@expo/ui`; Tailwind classes (Uniwind) style only our own content components.
- Add Expo packages with `npx expo install <pkg>` so versions match the SDK.
- This app is on React 19.2.3 and the web app on 19.3.0. Never add `react`/`react-dom` back to the root `overrides` in `pnpm-workspace.yaml`; `metro.config.js` keeps the bundle on one React.
