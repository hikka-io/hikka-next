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
- The generator also emits the web's surface fills per scheme (`surface`, `surface-inset`, `surface-inset-border`, including the web's `color-mix` translucency) and, in a static `@theme` block, the radius scale (`--radius-lg/md/sm/xs`) and the light `--shadow-card`, so `rounded-*`, `bg-surface*` and `shadow-card` mean the same thing in both apps. Uniwind themes only colors per scheme (a non-color variable inside `@variant` resolves to `unset`), so the web's dark shadow (none) is applied as `dark:shadow-none` on the card; the generator fails if the web's dark shadow ever stops being none.
- Uniwind only compiles class names it finds as literals: never build a class from a variable (`bg-${status}`). Map values to literal classes (the badge `status` variant does this).
- A new semantic color goes into the web `globals.css` first (so both apps share it), then the generator is re-run. A token that only makes sense on mobile goes in `src/global.css` under `@layer theme` with a line here explaining why.
- Usage follows the web: `background` page, `card` grouped content surfaces, `muted`/`secondary` chips and inset fills, `primary`/`primary-foreground`/`primary-border` brand accents (score chip, active state), `border` hairlines, status tokens (`watching`, `planned`, `completed`, `on_hold`, `dropped`, `reading`, `ongoing`, `finished`, `announced`, `discontinued`, `paused`) for list and release status.
- Native chrome tint: `primary-foreground` of the current scheme (pink). Everything else in chrome stays system default.
- Dark mode follows the system (`userInterfaceStyle: automatic`). Dark background is pure black, like the web.

## 3. Typography (Decided)

- **System font** (SF Pro on iOS, Roboto on Android) for native feel; the web's Geist is not used. Headers use the native large title on top-level screens.
- Sizes use Tailwind's scale, mapped to the web's `Header` variants: page `text-2xl leading-8 font-bold`, section `text-lg leading-7 font-bold`, subsection `text-base leading-6 font-semibold`; body `text-base`, secondary `text-sm text-muted-foreground`, meta `text-xs`.
- Dynamic Type is respected (font scaling on). Dense rows (badges, chips, stat items, poster and horizontal card meta, header counts, toasts) cap scaling with `maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}` = **1.3** (`components/ui/typography.ts`), roughly the largest non-accessibility size; titles and body text scale freely. Controls never clip their label: buttons use `min-h-*`, so the box grows with the text, and fixed-height chips and stat items only hold capped dense text.
- Text never inherits styles from a `View` in React Native. Primitives that carry text (Button, Badge, Chip, StatItem, HorizontalCardDescription) provide their text classes through `TextClassContext`, and our `Text` (`components/ui/text`) merges them; string children are wrapped automatically, so `<Button>Зберегти</Button>` works like the web. Content icons use `<Icon as={Glyph} />` (`components/ui/icon`), which takes its color from the inherited text class and its size from `IconClassContext` (the web's `[&_svg]:size-*`) or its own `size-*` class.

## 4. Layout, shape, elevation (Decided)

- 4 px spacing scale (Tailwind). Screen gutter `px-4`. Gap between sections `gap-6`, inside a section `gap-3`.
- Radii from the web (`--radius` 0.625rem): `rounded-lg` 10 for cards, surfaces and buttons, `rounded-md` 8 for posters, chips, `md`/`lg` buttons, `rounded-sm` 6 for badges, `rounded-full` for avatars. Small posters in horizontal cards use `rounded-lg` like the web's `--base-radius`.
- Poster ratio is **0.7** (width / height, `DEFAULT_CONTAINER_RATIO` in `content-card/image-presets.ts`, same constant as the web), poster box `rounded-md bg-muted`, missing image shows the `ImageOff` glyph.
- Elevation: `Card` `surface` is `border-border bg-surface shadow-card dark:shadow-none`. In light, `shadow-card` is the web's two-layer soft shadow (`0 1px 3px` 8% + `0 1px 2px` 5%); in dark it resolves to none and surfaces lift by fill, as on the web. `inset` uses `bg-surface-inset` (muted at 60% light / 45% dark) with its own border; `plain` is border only. The web's `glass` variant has no mobile equivalent: floating bars are native chrome (Liquid Glass), not cards.
- Touch targets: every pressable primitive is a real 44 pt layout box, not a `hitSlop` (on Android a touch outside the parent's bounds never reaches the child). Button, Chip and StatItem render through `TouchTarget` (`components/ui/touch-target`): a transparent `min-h-11 min-w-11` Pressable around the smaller visual, so a row holding a 32 pt button is 44 pt tall. Their `className` styles the visual like the web; `containerClassName` lays out the hit box (`self-stretch` + `w-full` for a full-width button). A linked `HeaderTitle` is `min-h-11`; poster cards and rows are already larger.
- Pressed state replaces hover: the web's `hover:` colour becomes the pressed colour (`bg-primary` → `bg-primary-border`, ghost/outline → `bg-accent`, applied from the Pressable's `pressed` state); whole cards and rows dim with `active:opacity-70`.
- Accessibility: icon-only buttons (`icon`, `icon-md`, `icon-sm`) must pass `accessibilityLabel` (enforced by the type). A linked `HeaderTitle` keeps the header role (`role="heading"`; double tap still opens it). A selected `Chip` sets `accessibilityState.selected` and the primary tint, which the chip row (`ChipTabs` equivalent) builds on. Cards and rows are one element; anything interactive on them sits outside that element: `PosterCard` `overlay` is an absolute sibling over the poster box (as on the web), `HorizontalCard` `action` sits after the row. `children` and `titleMeta` are decoration only.

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
| `ui/chip` | `ui/chip` (pressable when `onPress` is set, static otherwise; `selected`) | Done |
| `ui/button` (`buttonVariants`) | `ui/button` (all 9 variants; sizes `default`, `sm`, `md`, `lg`, `icon`, `icon-md`, `icon-sm`) | Done |
| `ui/skeleton` (+ `SkeletonText`) | `ui/skeleton` (Reanimated pulse matching `animate-pulse`; `SkeletonText` reads font size and line height from its classes) | Done |
| `ui/avatar` (`Avatar`, `AvatarImage`, `AvatarFallback`) | `ui/avatar` (same names; fallback shows until the image loads or when it fails) | Done |
| `ui/empty-state` | `ui/empty-state` (same props and sizes) | Done |
| `ui/stat-item` (+ `StatItemGroup`) | `ui/stat-item` | Done |
| `ui/separator` | `ui/separator` | Done |
| `ui/sonner` (`Toaster`) | `ui/toaster` (mounted once in the root layout; loading toasts spin an `ActivityIndicator`) | Done |
| — | `ui/touch-target` (44 pt hit box for Button, Chip, StatItem) | Done (mobile-only) |
| `ui/image` | `ui/image` (`expo-image` with `className`) | Done |
| — | `ui/text` (`Text`, `TextClassContext`, `wrapText`), `ui/icon` (`Icon`, `IconClassContext`), `ui/typography.ts` | Done (mobile-only: React Native has no style inheritance) |
| `content-card/poster-card` (+ `poster-card-skeleton`) | `content-card/poster-card` (+ `poster-card-skeleton`; ratio `DEFAULT_CONTAINER_RATIO` from `@hikka/core`, shared with the web) | Done; `status` overlay, image presets and tooltips left for the tracking/content tasks |
| `horizontal-card` | `horizontal-card` (same five exports; the row itself takes `href`/`onPress`, interactive content goes in `action`) | Done |
| `markdown` (`MDViewer`) | `markdown` (`MDViewer`, `Link`, `Mention`, `Spoiler`, `SpoilerInline`) | Decided: see section 11 |
| `tracking` (`WatchListButton`/`ReadListButton` → `ListStatusButton`, `IconStatusButton`, `ListEntryEditDialog` + `watch-edit-form`/`read-edit-form`, `use-tracking-mutations`) | `tracking` (`ListStatusButton` with `contentType`, `IconStatusButton`, `ListEntrySheet` on the `list-entry/[content_type]/[slug]` form sheet, `useSaveListEntry`/`useDeleteListEntry`, `useListEntry`) | Decided: see section 12 |

Deliberate differences from the web, all for touch:

- Button drops `xs`, `icon-xs` and `badge` sizes: 24 pt controls are too small to read as buttons on a phone, and pill filters are `Chip`.
- `HorizontalCard` links the whole row (`href`/`onPress` on the root) instead of separate image and title links: one 44 pt target per row, one VoiceOver element, with an `action` slot outside it. `PosterCard` is likewise one pressable for poster and title.
- Sensitive posters (`imageBlur`/`titleBlur`) reveal on the first tap and navigate on the next, like the web: the `Link` stays mounted and the first press calls `preventDefault`, so the card never remounts or flashes. The image blur is `expo-image` `blurRadius`. A hidden title is `opacity-0` instead of the web's `spoiler-blur-sm`, because React Native has no text blur; its space is kept so the grid does not shift. While hidden, the card announces "Прихований вміст" instead of the title, with the hint "Торкніться, щоб показати".

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
- Link routing (`links.ts`, one `IN_APP_ROUTES` table): a hikka.io link to `/<segment>/<slug>` pushes the matching Expo Router route only when that segment is in the table (today `anime`, `manga`, `novel`); every other hikka.io link, listed hosts (`myanimelist.net`, `anilist.co`, `mikai.me`, `watari-anime.com`, `aniage.net`) and mention taps open in `expo-web-browser`, and any other host asks first through a native `Alert` (the web's `AlertDialog` copy). Adding a route later is one line in the table. Only `http(s)` links are followed (`data:`, `intent:`, `file:`, custom schemes are inert); `//host` counts as an unknown external host.
- Inline spoiler (`:spoiler[...]`): hidden as a `bg-muted-foreground/30` block with transparent text, tap reveals in place (`bg-muted-foreground/10`); no re-hide, like the web.
- Block spoiler (`:::spoiler`): `bg-muted` card with `border-border`, content clamped to 88 px and hidden (opacity 0, hidden from accessibility) behind a centered "Спойлер" pill; tap reveals everything and shows "Приховати спойлер". Hiding is an opaque overlay, not a blur, so it looks the same on iOS and Android.
- Images: `https` only (relative URLs resolve against `https://hikka.io`; `http:`, `data:`, `file:` are dropped), full width, `rounded-lg`, aspect ratio taken from the loaded image (16:9 placeholder), a linked image opens its link.
- Literal text, as on the web: code spans and fences, tables, task-list markers (`- [x]`), bare-url autolinks and raw HTML (tags are shown as typed). Headings render as paragraphs. The lexer runs `marked` with `gfm: false` and its own `~~` extension.
- State: spoiler reveal and image size live in the component, so a caller that can reuse the instance for different content (FlashList cell reuse, a screen reused across slugs) must key `MDViewer` by the content id, for example `key={anime.slug}`.

## 12. Content detail (Decided)

Anime, manga and novel share one detail system in `src/features/content/` (`ContentDetailPage`, barrel `index.ts`); the three routes in `(home,catalog,profile,search)/{anime,manga,novel}/[slug].tsx` only read the slug and pass `ContentTypeEnum`.

- **One typed dispatcher.** `contentInfoOptions(type, slug)` (`queries.ts`) maps the type to `animeSlugOptions`/`mangaInfoOptions`/`novelInfoOptions` with one return type, so the page holds one observer. The section list is config: `DETAIL_SECTIONS` (`satisfies Record<MainContentTypeEnum, …>`) names the sections per type, `SECTIONS` maps each name to its component; a section takes the loaded `content`. Type differences live inside the section that has them (watch vs read details, anime staff endpoint vs `authors` from the info response), as on the web.
- **Order follows the web's single-column layout:** poster, title and original title, genres, scores, tracking slot, then synopsis, details, franchise, main characters, staff, recommendations (anime only), links. Not built yet, parity gaps against the web: followings, collections, articles, list stats, the anime-only `ContentMovieBanner` (after the synopsis) and `ContentMedia` (videos and OST, after staff), and comments (phase 3). Recommendations are a mobile addition from the phase 2 brief; the web detail page does not show them.
- **Header title appears on scroll.** The native header starts with an empty title and shows the content title once the hero title has scrolled under the bar (`useScrolledPast` on the hero title's bottom edge), like the App Store and Music detail pages. This fixes the Android finding "duplicate title on detail" on both platforms and keeps the title in chrome when it is useful. The header is opaque, so the scroll offset is already in content coordinates (measured: `contentOffset.y` 0 at rest, `contentInset.top` 0). No large title on detail screens.
- **Share** is a header `Stack.Toolbar` button: SF `square.and.arrow.up` on iOS, the Material `share` symbol rendered to an image source (`unstable_getMaterialSymbolSourceAsync`) on Android, which only takes image sources. If that render fails or returns nothing, a bundled 1x/2x/3x PNG of the same glyph (`assets/images/share.png`) is used, so the action never disappears. It calls `Share.share` with `https://hikka.io` + `contentPath(type, slug)` (`url` on iOS, `message` + `title` on Android). Shown only once the content has loaded.
- **Tracking slot.** `tracking-slot.tsx` renders under the scores (the web's `ContentActions` position) and returns `null` until the tracking branch wires `components/tracking` in at merge. It receives `contentType`, `slug` and `totals` (`episodes_total` for anime, `chapters`/`volumes` otherwise) for the COMPLETED auto-fill.
- **Images** go through imgproxy at the web's preset sizes (`IMAGE_PRESET_SIZES` and `buildImgproxyUrl` in `@hikka/core`, `presetImageUrl(src, preset)` in `components/content-card/image-presets.ts`, base `EXPO_PUBLIC_IMGPROXY_URL`, default `https://img.hikka.io`): `cardLg` (480x686) for the detail hero, `cardSm` (320x458) for row and grid cards, `cardXs` (112x160) for thumbnails such as the studio logo. Non-CDN sources pass through unchanged.
- **Hero.** Centered `PosterCard` `w-48`, title sized by length like the web (`text-2xl`, `text-xl` over 40, `text-lg` over 80 characters), original title (`title_ja` for anime, `title_original` otherwise), genres as `secondary` badges (not links yet: the catalog filter params belong to the catalog task). Scores: MAL and Hikka logos as `react-native-svg` ports of the web icons, filled `text-yellow-400` star, `formatCompactNumber` counts; one score hugs its content, two share the row.
- **Synopsis** uses `MDViewer` keyed by slug and language, `selectable`, inside a show-more clamp (208 pt, "Показати більше..." / "Згорнути...", no animation) with a bottom fade (`experimental_backgroundImage` linear gradient, the web's `gradient-mask-b-90`) that ends at the color the eye sees: a translucent surface such as the card's `bg-surface` is composited over `bg-background` first, so there is no lighter band. The UA/EN switch is the native segmented control from `@expo/ui/community/segmented-control` (UISegmentedControl / Material segmented buttons), full width on its own row under the section header (the web's "full width under the header in narrow cards"), with no fixed width so labels grow with Dynamic Type; shown only when both languages exist.
- **Details** is a `Card` with separator-split groups of icon + label + value rows, the same rows and copy as the web's `WatchDetails`/`ReadDetails`. The next episode shows its date and the relative `getScheduleDuration` under it (the web's tooltip). Synonyms show the first three; with more, the value shows a muted `+N`, is a 44 pt button and expands in place instead of the web's modal. Episode count, duration, next episode, the original title, the blank-synopsis check and the link grouping come from `@hikka/core`, shared with the web. Season, year and studio are plain text until the catalog filters exist.
- **Poster rows** (`poster-row.tsx`): characters, staff, franchise and recommendations are horizontal `FlatList` rows of `w-28` `PosterCard`s bleeding to the screen edges (`-mx-4`, `px-4`), header above. Characters show the main cast of the first page (the web's "Головні персонажі"); staff show the first role as the card description; franchise shows every other title of the franchise oldest first with media type and year (relation labels need the web's franchise model in `@hikka/core` first); recommendations show media type and year.
- **Links** card: general links for everyone, watch/read links only when signed in, switched by the segmented control, deduplicated by URL, platform icons from `getPlatformIcon` (moved from the web into `@hikka/core`) loaded from `https://hikka.io`, letter tile otherwise, clamped to 160 pt. The segmented control sits on its own row like the synopsis one. Only `http(s)` URLs open, in `expo-web-browser`; a failure shows an error toast.
- **Requests.** Builders and page sizes live in `queries.ts` (`CHARACTERS_PREVIEW_SIZE`, `STAFF_PREVIEW_SIZE`, `RECOMMENDATIONS_PREVIEW_SIZE` = 15). The info query loads first; every section below the hero has its own observer gated by `useVisibleOnce()` (`detail-scroll.tsx`: the section's layout `y` against the scroll viewport, latched once it comes within one screen), so a section fetches only when it is about to be seen. Franchise is also gated by `has_franchise`. No stale or retry policy in components.
- **Pull to refresh** is a `RefreshControl` on the page `ScrollView`; it refetches every mounted query whose key carries this slug (`utils/api/refetch-content-detail.ts`), so the info and the sections that have loaded refresh together.
- **States.** Loading renders `ContentDetailSkeleton` (poster box, title and original title lines at their real sizes, genre chips, scores box, synopsis header and lines, details card); unloaded rows render `PosterCardSkeleton` cells in the real row with the loaded card's title line count (two lines when the card has no subtitles). A 404 shows `EmptyState` "Не знайдено"; other errors show the message with "Повторити"; a failed section shows "Не вдалося завантажити" with a retry instead of disappearing. Empty sections are omitted, as on the web.

## 12. Tracking (Decided)

`src/components/tracking` is the native `components/tracking`. Cache writes go only through `src/utils/api/invalidate-content-state.ts`, a thin re-export of the watch/read writers in `@hikka/core` (`content-cache.ts`: the id lists, `applyWatchMutation`/`applyReadMutation`/`apply*Deletion`), which the web's file re-exports too; components never call `setQueryData` or `invalidateQueries`. A watch or read write also stale-marks `userWatchStats`/`userReadStats` and `userHistory`. Shared with the web through core as well: the entry read (`listEntryOptions`, 404 to `null`), the COMPLETED fill (`completedWatchFill`/`completedReadFill`) and the list date helpers (`unixToLocalDate`/`localDateToUnix`).

- **Data contract.** Watch/read PUT is full-replace. A status change spreads `carryOver*Args` plus the COMPLETED fill through `omitUndefined` (`buildStatusBody`); the sheet sends every field of its draft (`buildEditBody`: status, score, progress, repeats, note trimmed or `null`, both dates as UTC-midnight unix seconds), never a partial body. "Add to planned" sends `{ status: 'planned' }` only from a known-untracked state.
- **Entry states** (`useListEntry`, decided by the pure `resolveListEntry`): `signed-out`, `loading`, `error`, `untracked`, `tracked`. A 404 resolves to `null`; every other read failure is `error` with a retry, and no control writes from it. A supplied (embedded) entry wins over the per-title cache, like the web's `entryProp || entryQuery`; when both are entries the newer `updated` wins. When the two disagree on tracked vs untracked (a cached `null` from an earlier visit while a refetched list embeds an entry added elsewhere, or the reverse), the entry is re-read and the state is `loading` until that read lands, then the re-read value wins; a failed re-read is `error`. Acting on the stale `null` would PUT `{ status: 'planned' }` over the real entry. A dead token (401, or 400 with `auth:invalid_token`/`auth:token_expired`) on a tracking read or write signs out through `features/auth`, so the controls fall back to the login button instead of a retry or toast loop.
- **Stale-write guards.** Status writes take the snapshot at tap time and the controls are disabled while a write is pending. Pending is slug-bound and shared (`useSavePending(slug)`, `useIsMutating` on the save key filtered by slug): a recycled FlashList cell never shows or blocks on another title's write, and the header button and a poster overlay for the same title wait for each other's write. The sheet is keyed by `content_type/slug` and builds its draft once, only after the content query succeeded (a 404 shows "Тайтл не знайдено.", no form, and the episode cap never falls back to the API maximum while totals load) and no save for the slug is in flight, so a draft is never built from a pre-write entry; the form is also disabled while any save for the slug is pending, and a `sentRef` keeps one draft from being sent twice (reset on error); after a delete succeeds the form stays disabled until the sheet closes, so a save cannot re-create the entry. The web's debounced progress pattern (pending `{slug, total, args}` + `sentRef`) belongs to the progress editor on the detail page and the home trackers, which reuse `useSaveListEntry`.
- **Header button** (`ListStatusButton`): the web's split control. Untracked: "Додати у список" (adds to planned) plus a chevron that opens the native status menu. Tracked: a status-tinted segment (status glyph, title, "- score") that opens the menu (statuses with a checkmark on the current one, then an inline "Налаштування" section) plus a settings button that opens the sheet. Signed out: one button that pushes `/login`. Error: an outline "Не вдалося завантажити список" button that retries. Menus go through `NativeMenu` (`native-menu.ios.tsx`: a SwiftUI `Menu` in a `Host` with our React Native view as its label; `native-menu.tsx`: the community `MenuView`, a Material dropdown, on Android). Triggers are plain views because the menu owns the tap. On iOS the SwiftUI menu button is the VoiceOver element (`accessibilityLabel` modifier) and the hosted trigger is hidden from accessibility, so a double tap opens the menu; on Android TalkBack focuses the trigger and its tap reaches the `MenuView` pressable.
- **Poster overlay** (`IconStatusButton`, `icon-sm` by default): untracked adds to planned, tracked opens the sheet (status-tinted, the web's `bg-{status}` classes as a literal map), error retries, signed out opens login. Lists pass the embedded entry (`item.watch[0] ?? null`) so cards do not fetch one by one.
- **Edit sheet**: a root-stack `formSheet` at `list-entry/[content_type]/[slug]`, detents `[0.75, 1]`, grabber, opened with `listEntryHref(contentType, slug)`. Content: title, a grouped card (status picker row through the native menu, progress steppers: episodes, or chapters and volumes, score 0-10, rewatches/rereads), a card with the two dates, the note with a counter, then Видалити (destructive, only when tracked) and Зберегти. Steppers are our content (−, typed number, +, "/ total"), clamped to `API_LIMITS`; anime episodes stop at a known `episodes_total` because the backend rejects more, chapters and volumes do not. Dates use `@expo/ui/community/datetime-picker`: the compact picker on iOS, a dialog on Android, "Вказати" for an empty date and a clear button; the end date cannot precede the start (backend rule). No schema validation: every control is bounded. An untracked title opens the same form with status planned and creates the entry on save.
- **Feedback**: success haptic on every tracking write (save, status change, delete), warning haptic before the destructive `Alert` confirm, selection haptic on the sheet's status pick, error haptic plus `toast.error` with the backend message on a failed write. Save shows the web's "{title} успішно оновлено." toast, delete the web's "Аніме/Контент успішно видалено.".
- **Native menu sizing (iOS)**: the community `MenuView` hosts a React Native trigger with `matchContents`, which leaves the `Host` zero-sized in Yoga: siblings overlap it and touches never reach the menu. `NativeMenu` gives the `Host` and the label an explicit box (`width`, `height` 44) instead, and callers measure the width with `onLayout` when the trigger fills a row. Any future native menu with a custom trigger uses `NativeMenu`, not `MenuView`. Simulator note: the iOS Simulator tool's default tap is too short to open a SwiftUI `Menu`; use a 0.2 s press.
- **Glyphs**: the web's filled status icons (`components/icons/list-status`) are ported as path data (`status-glyphs.ts`) and drawn by `StatusIcon`, which resolves colour and size like `Icon`.
- **Session**: the components read the token through `useAuthToken` from `features/auth`, a component-to-feature import that stays until session hooks move to `src/services/` (decision log, auth).

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
- 2026-10-20: Review pass: real 44 pt boxes through `TouchTarget` instead of `hitSlop` (Android ignores touches outside the parent), buttons grow with Dynamic Type (`min-h-*`), icon buttons require `accessibilityLabel`, linked headers keep the header role, `Chip` gets `selected`, card and row actions sit outside the card's single accessible element; the auth form fields, submit and profile summary now use `Text`, `Button` and `Avatar`. (design-system)
- 2026-10-20: Uniwind cannot theme non-color variables per scheme, so radii and the light card shadow are static `@theme` keys and the card uses `dark:shadow-none`; verified on device (radius 10.1 pt measured, shadow visible in light, none in dark). (design-system)
- 2026-10-20: Tracking: section 12. Status menus are `NativeMenu` (SwiftUI `Menu` with an explicitly sized host on iOS, the community `MenuView` on Android; the community `MenuView` with a React Native trigger is zero-sized and untappable on iOS), dates `@expo/ui/community/datetime-picker` (cross-platform wrappers of the SwiftUI and Compose controls), steppers and the note field are content; the edit sheet is the root `list-entry/[content_type]/[slug]` form sheet; an entry read error blocks every write; `expo-haptics` added. (tracking)
- 2026-10-20: Tracking review: supplied entry wins and a tracked/untracked disagreement is re-read before any write; the sheet waits for the content and for in-flight saves; dead tokens sign out; entry read, COMPLETED fill, list dates and the watch/read cache writers moved into `@hikka/core` and the web imports them; stats and history stale-marked on writes; SwiftUI menu owns VoiceOver. (tracking)
- 2026-10-20: `<Toaster />` is mounted once in `src/app/_layout.tsx`; loading toasts use `ActivityIndicator` (section 7). The poster ratio moved to `@hikka/core` (`DEFAULT_CONTAINER_RATIO`) and the web imports it from there. (design-system)
- 2026-10-20: Content detail is one config-driven system in `features/content` (typed `contentInfoOptions` dispatcher, `DETAIL_SECTIONS` per type), in the web's single-column order plus anime recommendations; comments wait for phase 3. (content-detail)
- 2026-10-20: The detail header title starts empty and appears once the hero title scrolls under the bar; this replaces the duplicate title on Android and iOS. Share is a `Stack.Toolbar` button (SF symbol on iOS, Material symbol image on Android). (content-detail)
- 2026-10-20: Web `Tabs` for UA/EN and link groups map to `@expo/ui`'s community `SegmentedControl`; show-more clamps keep the web's heights and fade with `experimental_backgroundImage`. (content-detail)
- 2026-10-20: Below-the-fold sections fetch through `useVisibleOnce` (layout `y` against the scroll viewport, one screen ahead); pull to refresh refetches the mounted queries keyed by the slug. (content-detail)
- 2026-10-20: `formatCompactNumber` falls back to a hand-rolled compact format when `Intl` ignores `notation: 'compact'` (Hermes prints "657,496"); `getPlatformIcon` moved from the web into `@hikka/core`. (content-detail)
- 2026-10-20: Review pass: detail helpers (original title, blank description, episode formatting, link grouping) and imgproxy presets live in `@hikka/core` and the web uses them too; segmented controls sit full width under the section header with no fixed width; the collapse fade composites translucent surfaces over the page; Android share falls back to a bundled PNG; the tracking slot gets progress totals. (content-detail)
