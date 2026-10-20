# Hikka mobile design system

The single record of design decisions for `apps/mobile`. Every task reads it before building UI and updates it in the same branch when it makes or changes a decision. A decision that is not written here is not settled: ask, then write it down.

Status legend: **Decided** (follow it), **Open** (the named task decides and records it).

## 1. Principles (Decided)

1. **Native chrome, Hikka content.** Navigation, headers, tab bar, search, sheets, menus, pickers, switches, sliders, date pickers and alerts come from Expo Router and `@expo/ui` (SwiftUI on iOS, Jetpack Compose on Android) and look like the platform. Our own components draw only content: posters, cards, rows, badges, score and status chips, section headers, markdown.
2. **Same product as the web.** Same entities, section order on detail pages, Ukrainian copy, labels, sort and filter options as `apps/web`. When the web has a pattern, the mobile app has the native equivalent of that pattern, not a new one.
3. **Never restyle native chrome to look like the web.** No custom tab bars, fake headers, JS bottom sheets or hand-built dropdowns.
4. **Platform differences are allowed only in chrome.** Content components render the same on iOS and Android; chrome differs where the platforms differ (section 8).

## 2. Tokens (Decided)

- Colors come only from `src/theme.css`, generated from `apps/web/src/globals.css` by `pnpm --filter @hikka/mobile tokens`. Never edit it, never hard-code a hex in a component.
- The generator also emits the web's radius scale (`--radius-lg/md/sm/xs`), the surface fills (`surface`, `surface-inset`, `surface-inset-border`, including the web's `color-mix` translucency) and `--shadow-card` per scheme, so `rounded-*`, `bg-surface*` and `shadow-card` mean the same thing in both apps.
- Uniwind only compiles class names it finds as literals: never build a class from a variable (`bg-${status}`). Map values to literal classes (the badge `status` variant does this).
- A new semantic color goes into the web `globals.css` first (so both apps share it), then the generator is re-run. A token that only makes sense on mobile goes in `src/global.css` under `@layer theme` with a line here explaining why.
- Usage follows the web: `background` page, `card` grouped content surfaces, `muted`/`secondary` chips and inset fills, `primary`/`primary-foreground`/`primary-border` brand accents (score chip, active state), `border` hairlines, status tokens (`watching`, `planned`, `completed`, `on_hold`, `dropped`, `reading`, `ongoing`, `finished`, `announced`, `discontinued`, `paused`) for list and release status.
- Native chrome tint: `primary-foreground` of the current scheme (pink). Everything else in chrome stays system default.
- Dark mode follows the system (`userInterfaceStyle: automatic`). Dark background is pure black, like the web.

## 3. Typography (Decided)

- **System font** (SF Pro on iOS, Roboto on Android) for native feel; the web's Geist is not used. Headers use the native large title on top-level screens.
- Sizes use Tailwind's scale, mapped to the web's `Header` variants: page `text-2xl leading-8 font-bold`, section `text-lg leading-7 font-bold`, subsection `text-base leading-6 font-semibold`; body `text-base`, secondary `text-sm text-muted-foreground`, meta `text-xs`.
- Dynamic Type is respected (font scaling on). Dense rows (badges, chips, stat items, poster and horizontal card meta, header counts, toasts) cap scaling with `maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}` = **1.3** (`components/ui/typography.ts`), roughly the largest non-accessibility size; titles and body text scale freely.
- Text never inherits styles from a `View` in React Native. Primitives that carry text (Button, Badge, Chip, StatItem, HorizontalCardDescription) provide their text classes through `TextClassContext`, and our `Text` (`components/ui/text`) merges them; string children are wrapped automatically, so `<Button>Зберегти</Button>` works like the web. Content icons use `<Icon as={Glyph} />` (`components/ui/icon`), which takes its color from the inherited text class and its size from `IconClassContext` (the web's `[&_svg]:size-*`) or its own `size-*` class.

## 4. Layout, shape, elevation (Decided)

- 4 px spacing scale (Tailwind). Screen gutter `px-4`. Gap between sections `gap-6`, inside a section `gap-3`.
- Radii from the web (`--radius` 0.625rem): `rounded-lg` 10 for cards, surfaces and buttons, `rounded-md` 8 for posters, chips, `md`/`lg` buttons, `rounded-sm` 6 for badges, `rounded-full` for avatars. Small posters in horizontal cards use `rounded-lg` like the web's `--base-radius`.
- Poster ratio is **0.7** (width / height, `DEFAULT_CONTAINER_RATIO` in `content-card/image-presets.ts`, same constant as the web), poster box `rounded-md bg-muted`, missing image shows the `ImageOff` glyph.
- Elevation: `Card` `surface` is `border-border bg-surface shadow-card`. In light, `shadow-card` is the web's two-layer soft shadow (`0 1px 3px` 8% + `0 1px 2px` 5%); in dark it resolves to none and surfaces lift by fill, as on the web. `inset` uses `bg-surface-inset` (muted at 60% light / 45% dark) with its own border; `plain` is border only. The web's `glass` variant has no mobile equivalent: floating bars are native chrome (Liquid Glass), not cards.
- Touch targets: every pressable primitive reaches 44 pt. Buttons below 44 pt (`sm`, `md`, `icon-sm`, `icon-md`) get a computed `hitSlop`; chips and stat items get `hitSlop` 6; a linked `HeaderTitle` is `min-h-11` with negative margins so the header row keeps the web's 32 pt height.
- Pressed state replaces hover: the web's `hover:` colour becomes `active:` (`bg-primary` → `active:bg-primary-border`, ghost/outline → `active:bg-accent`); whole cards and rows dim with `active:opacity-70`.

## 5. Icons (Decided)

- Chrome icons (tabs, header buttons, menus): SF Symbols on iOS, Material Symbols on Android (`expo-symbols`, `NativeTabs.Trigger.Icon sf/md`).
- Content icons (inside cards, stats, badges): `lucide-react-native`, the same glyph the web uses for the same concept.

## 6. Motion and feedback (Decided)

- Screen transitions, sheets and menus animate natively; no custom navigation animations.
- Reanimated only for small content interactions. No expand/collapse animations on text (same rule as the web).
- Haptics (`expo-haptics`): selection on segmented/filter changes, success on tracking writes, warning on destructive confirms.
- Lists support pull-to-refresh.

## 7. States (Decided)

- Loading: skeletons built on the `Skeleton` primitive that match the loaded layout (same rule as the web: same box, row count from the page size, text lines at the real font size). Inline busy state: `ActivityIndicator` only.
- Empty: `EmptyState` with the web's copy for the same case.
- Error: message plus retry; an error never renders as empty or "not tracked".

## 8. Web pattern to native pattern (Decided)

| Web | Mobile |
| --- | --- |
| Page header + breadcrumbs | Native stack header, large title on tab roots |
| `ResponsiveModal` / `Drawer` / `Sheet` | Route with `presentation: 'formSheet'` and detents |
| `DropdownMenu`, `ContextMenu` | `@expo/ui` menu / context menu |
| `Tabs` (2-3 options, one block) | Native segmented control (`@expo/ui`) |
| `ChipTabs` (which list a section shows) | Horizontal chip row (our component) |
| `ToggleGroup` (view/sort settings) | Native menu or segmented control |
| `Select`, `Switch`, `Slider`, `DatePicker` | `@expo/ui` equivalents |
| `Tooltip`, `HoverCard` | Long-press context menu with preview, or nothing |
| Toast (`sonner`) | `sonner-native` through `Toaster` in `components/ui/toaster` (top-center, themed from tokens); same `toast.success/error/info` API as the web |
| Pagination widget | Infinite scroll |
| Sidebar filters | Filter sheet (formSheet) |

### Android chrome (Decided, verified on Android 16 / API 36, see STACK.md "Android findings")

- Tabs: Material 3 bottom navigation from Native Tabs, `md` icons. The active indicator and ripple use the `primary` token and the active icon and label the `primary-foreground` token (same pink as the iOS tint), through Uniwind's `useCSSVariable`, never a hex. Applied in `_layout.tsx` by the auth task or a follow-up.
- Titles: a small, left-aligned Material top app bar on tab roots and detail screens. `Stack.Title large` is iOS-only and stays; never emulate a large title on Android.
- Search: `Stack.SearchBar` is the header's expandable search field; the `role="search"` tab is just a tab with a search icon. Keep both (platform convention), no custom field.
- Dark: the header and bottom navigation keep the Material dark surface; only content uses pure black. Do not force chrome to black.
- Keyboard: the bottom navigation rides above the keyboard by default. Hide it while the keyboard is open on screens with a text field (search, comment writing); do not switch the app to `pan` resize.
- Edge-to-edge is on (Android 15+): content scrolls under the system bars only through the native header and tab bar; custom bottom-anchored UI uses the safe-area bottom inset.

## 9. Component inventory (Decided)

Names match the web component with the same role, so reviewers can compare side by side. Primitives live in `src/components/ui/`, content groups in `src/components/<group>/` (same groups as the web: `content-card`, `markdown`, `tracking`, `badges`, `list-items`).

| Web | Mobile | Status |
| --- | --- | --- |
| `ui/card` (`variant` surface/inset/glass/plain) | `ui/card` (surface/inset/plain) | Done |
| `ui/header` (`Header`, `HeaderTitle` page/section/subsection with `count`/`countPending`/link, `HeaderActions`) | `ui/header` (same names; link is `href` or `onPress`) | Done |
| `ui/badge` (incl. `status`) | `ui/badge` (`variant="status" status="watching"`, literal class map) | Done |
| `ui/chip` | `ui/chip` (pressable when `onPress` is set, static otherwise) | Done |
| `ui/button` (`buttonVariants`) | `ui/button` (all 9 variants; sizes `default`, `sm`, `md`, `lg`, `icon`, `icon-md`, `icon-sm`) | Done |
| `ui/skeleton` (+ `SkeletonText`) | `ui/skeleton` (Reanimated pulse matching `animate-pulse`; `SkeletonText` reads font size and line height from its classes) | Done |
| `ui/avatar` (`Avatar`, `AvatarImage`, `AvatarFallback`) | `ui/avatar` (same names; fallback shows until the image loads or when it fails) | Done |
| `ui/empty-state` | `ui/empty-state` (same props and sizes) | Done |
| `ui/stat-item` (+ `StatItemGroup`) | `ui/stat-item` | Done |
| `ui/separator` | `ui/separator` | Done |
| `ui/sonner` (`Toaster`) | `ui/toaster` | Done, not mounted yet (see decision log) |
| `ui/image` | `ui/image` (`expo-image` with `className`) | Done |
| — | `ui/text` (`Text`, `TextClassContext`, `wrapText`), `ui/icon` (`Icon`, `IconClassContext`), `ui/typography.ts` | Done (mobile-only: React Native has no style inheritance) |
| `content-card/poster-card` (+ `poster-card-skeleton`) | `content-card/poster-card` (+ `poster-card-skeleton`) | Done; `status` overlay, image presets and tooltips left for the tracking/content tasks |
| `horizontal-card` | `horizontal-card` (same five exports; the row itself takes `href`/`onPress`) | Done |
| `markdown` (`MDViewer`) | `markdown` (`MDViewer`, `Link`, `Mention`, `Spoiler`, `SpoilerInline`) | Decided: see section 11 |

Deliberate differences from the web, all for touch:

- Button drops `xs`, `icon-xs` and `badge` sizes: 24 pt controls are too small to read as buttons on a phone, and pill filters are `Chip`.
- `HorizontalCard` links the whole row (`href`/`onPress` on the root) instead of separate image and title links: one 44 pt target per row, one VoiceOver element. `PosterCard` is likewise one pressable for poster and title.
- Sensitive posters (`imageBlur`/`titleBlur`) reveal on the first tap and navigate on the next, like the web; the blur is `expo-image` `blurRadius`.

## 10. Code structure (Decided)

Mirrors the web so reviews read the same way:

- `src/app/` holds thin route files: screen composition and stack options only, importing from feature barrels.
- `src/features/<feature>/` with one `index.ts` barrel, feature names matching the web (`content`, `catalog`, `home`, `users`, `auth`, `search`, …).
- `src/components/ui/` stateless primitives; `src/components/<group>/` shared groups; `src/services/` session and storage hooks; `src/utils/` pure helpers.
- Web rules apply: flat until three files, no `hooks/`/`types/`/`constants/` folders, `type Props`, `FC`, default exports for components, named for hooks/utils, kebab-case files, very few comments.
- Pure logic shared with the web lives in `@hikka/core` (`packages/core`), never copied.
- `src/app/dev/ui.tsx` (dev builds only, redirects home otherwise) shows every primitive and variant for visual review at `hikka://dev/ui`. It is a root Stack route next to `dev/markdown`.

## 11. Markdown (Decided)

`MDViewer` (`src/components/markdown`) renders the web's markdown dialect read-only. Renderer choice and rejected alternatives: STACK.md "Markdown renderer choice".

- Text: `text-base leading-6 text-foreground` by default (`textClassName` overrides it for dense uses, for example a comment row); blocks are spaced `gap-4`, like the web's `mb-4`. `selectable` is opt-in (off in lists).
- Links and mentions: `text-primary-foreground`, no underline. Links to hosts that need a signed-in user (`toloka.to`, `anitube.in.ua`) are `text-muted-foreground` plain text unless `authenticated` is passed. Mentions show the user's current username and a 20 px avatar from `userReferenceOptions`/`userProfileOptions`, like the web.
- Link routing (`links.ts`, one `IN_APP_ROUTES` table): a hikka.io link to `/<segment>/<slug>` pushes the matching Expo Router route only when that segment is in the table (today `anime`); every other hikka.io link, listed hosts (`myanimelist.net`, `anilist.co`, `mikai.me`, `watari-anime.com`, `aniage.net`) and mention taps open in `expo-web-browser`, and any other host asks first through a native `Alert` (the web's `AlertDialog` copy). Adding a route later is one line in the table. Only `http(s)` links are followed (`data:`, `intent:`, `file:`, custom schemes are inert); `//host` counts as an unknown external host.
- Inline spoiler (`:spoiler[...]`): hidden as a `bg-muted-foreground/30` block with transparent text, tap reveals in place (`bg-muted-foreground/10`); no re-hide, like the web.
- Block spoiler (`:::spoiler`): `bg-muted` card with `border-border`, content clamped to 88 px and hidden (opacity 0, hidden from accessibility) behind a centered "Спойлер" pill; tap reveals everything and shows "Приховати спойлер". Hiding is an opaque overlay, not a blur, so it looks the same on iOS and Android.
- Images: `https` only (relative URLs resolve against `https://hikka.io`; `http:`, `data:`, `file:` are dropped), full width, `rounded-lg`, aspect ratio taken from the loaded image (16:9 placeholder), a linked image opens its link.
- Literal text, as on the web: code spans and fences, tables, task-list markers (`- [x]`), bare-url autolinks and raw HTML (tags are shown as typed). Headings render as paragraphs. The lexer runs `marked` with `gfm: false` and its own `~~` extension.
- State: spoiler reveal and image size live in the component, so a caller that can reuse the instance for different content (FlashList cell reuse, a screen reused across slugs) must key `MDViewer` by the content id, for example `key={anime.slug}`.

## Decision log

Append one line per decision: date, decision, task.

- 2026-10-20: Initial principles, tokens, typography, icons, motion, states, pattern map and structure. (planning)
- 2026-10-20: Poster ratio 0.7 (web `DEFAULT_CONTAINER_RATIO`); radii 10/8/6/2 from the web's `--radius`, now emitted by the token generator. (design-system)
- 2026-10-20: Light elevation is the web's `shadow-card`, dark has none; `Card` variants surface/inset/plain, `inset` keeps the web's translucent muted fill (generator resolves `color-mix`). (design-system)
- 2026-10-20: Dense rows cap Dynamic Type at `maxFontSizeMultiplier` 1.3 (`DENSE_MAX_FONT_SCALE`). (design-system)
- 2026-10-20: Toasts use `sonner-native` (0.27, active, pure JS on Reanimated/Gesture Handler/Screens/SVG we already ship, runs in Expo Go, same API as the web's `sonner`, swipe to dismiss, renders above sheets via `FullWindowOverlay`). Rejected `burnt`: native system toasts, but last released March 2025, needs a dev build, and on Android falls back to the bare system Toast (no description, no action). The root layout mounts `<Toaster />` once; until then only the dev catalog mounts it, and that local mount goes when the root one lands. (design-system)
- 2026-10-20: Text and icon styling flows through `TextClassContext`/`IconClassContext` with our `Text` and `Icon` primitives; string children are auto-wrapped. (design-system)
- 2026-10-20: Touch adaptations: 44 pt minimum via `hitSlop`, `hover:` becomes `active:`, Button drops `xs`/`icon-xs`/`badge`, cards and rows are a single pressable. (design-system)
- 2026-10-20: Android chrome decisions: Material 3 bottom navigation tinted from `primary`/`primary-foreground`, small Material title (no fake large title), header search field plus search tab kept, dark chrome stays on the system surface, tab bar hidden while the keyboard is open. (android-tooling)
- 2026-10-20: Login is a root-stack route presented as a native `formSheet` (`fitToContents`, grabber) over the tabs; tabs live in `src/app/(tabs)/`. Form fields are a minimal `features/auth/text-field.tsx` (label, `TextInput`, error line) and the submit is a plain primary-token `Pressable`; both move onto `ui/` primitives after the design-system branch merges. Field errors show after blur or the first submit; backend errors show inline under the form as returned. (auth)
- 2026-10-20: The Profile tab is the third native tab (between catalog and search). Signed out: muted copy plus a login button that opens the sheet; signed in: avatar, username, email. Logout is a header `Stack.Toolbar` button (SF `rectangle.portrait.and.arrow.right`), not a content button. The summary lives in `features/auth` until the `users` feature exists. (auth)
- 2026-10-20: Session state is in `features/auth` (`useSession`, `signIn`/`signOut`, token storage), as the parent plan asked, not in `src/services/` as section 10 suggests; move it if `services/` becomes the home for session hooks. (auth)
- 2026-10-20: Markdown viewer is a `marked` lexer with directive/mention/strikethrough extensions and an own React Native renderer, not `react-native-marked` or a native text view; web dialect kept (no code/tables/autolinks); block spoiler hides behind an opaque pill, not a blur. (markdown task)
