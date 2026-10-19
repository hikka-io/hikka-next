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
- A new semantic color goes into the web `globals.css` first (so both apps share it), then the generator is re-run. A token that only makes sense on mobile goes in `src/global.css` under `@layer theme` with a line here explaining why.
- Usage follows the web: `background` page, `card` grouped content surfaces, `muted`/`secondary` chips and inset fills, `primary`/`primary-foreground`/`primary-border` brand accents (score chip, active state), `border` hairlines, status tokens (`watching`, `planned`, `completed`, `on_hold`, `dropped`, `reading`, `ongoing`, `finished`, `announced`, `discontinued`, `paused`) for list and release status.
- Native chrome tint: `primary-foreground` of the current scheme (pink). Everything else in chrome stays system default.
- Dark mode follows the system (`userInterfaceStyle: automatic`). Dark background is pure black, like the web.

## 3. Typography (Decided, scale Open)

- **System font** (SF Pro on iOS, Roboto on Android) for native feel; the web's Geist is not used. Headers use the native large title on top-level screens.
- Sizes use Tailwind's scale, mapped to the web's `Header` variants: page `text-2xl leading-8 font-bold`, section `text-lg leading-7 font-bold`, subsection `text-base leading-6 font-semibold`; body `text-base`, secondary `text-sm text-muted-foreground`, meta `text-xs`.
- Dynamic Type is respected (font scaling on). Dense rows cap scaling with `maxFontSizeMultiplier` (value: Open, design-system task).

## 4. Layout, shape, elevation (Decided, exact values Open)

- 4 px spacing scale (Tailwind). Screen gutter `px-4`. Gap between sections `gap-6`, inside a section `gap-3`.
- Radii from the web: `rounded-lg` (10) for cards and surfaces, `rounded-md` (8) for posters and chips, `rounded-sm` (6) for badges.
- Posters keep the web's ratio (design-system task confirms the value from `components/content-card/poster-card.tsx` and records it here).
- Elevation: borders and fills, no shadows in dark; light mode may use the web's soft `shadow-card` equivalent (Open).

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
| Toast (`sonner`) | Open: native-feeling toast library chosen by the design-system task |
| Pagination widget | Infinite scroll |
| Sidebar filters | Filter sheet (formSheet) |

## 9. Component inventory (Open: design-system task fills it)

Names match the web component with the same role, so reviewers can compare side by side. Primitives live in `src/components/ui/`, content groups in `src/components/<group>/` (same groups as the web: `content-card`, `markdown`, `tracking`, `badges`, `list-items`).

| Web | Mobile | Status |
| --- | --- | --- |
| `ui/card` | `ui/card` | Open |
| `ui/header` | `ui/header` | Open |
| `ui/badge`, `ui/chip` | `ui/badge`, `ui/chip` | Open |
| `ui/button` (`buttonVariants`) | `ui/button` | Open |
| `ui/skeleton` (+ `SkeletonText`) | `ui/skeleton` | Open |
| `ui/avatar` | `ui/avatar` | Open |
| `ui/empty-state` | `ui/empty-state` | Open |
| `ui/stat-item` | `ui/stat-item` | Open |
| `content-card/poster-card` | `content-card/poster-card` | Open |
| `horizontal-card` | `horizontal-card` | Open |
| `markdown` (`MDViewer`) | `markdown` | Open (markdown task) |

## 10. Code structure (Decided)

Mirrors the web so reviews read the same way:

- `src/app/` holds thin route files: screen composition and stack options only, importing from feature barrels.
- `src/features/<feature>/` with one `index.ts` barrel, feature names matching the web (`content`, `catalog`, `home`, `users`, `auth`, `search`, …).
- `src/components/ui/` stateless primitives; `src/components/<group>/` shared groups; `src/services/` session and storage hooks; `src/utils/` pure helpers.
- Web rules apply: flat until three files, no `hooks/`/`types/`/`constants/` folders, `type Props`, `FC`, default exports for components, named for hooks/utils, kebab-case files, very few comments.
- Pure logic shared with the web lives in `@hikka/core` (`packages/core`), never copied.
- `src/app/dev/ui.tsx` (dev builds only) shows every primitive in light and dark for visual review.

## Decision log

Append one line per decision: date, decision, task.

- 2026-10-20: Initial principles, tokens, typography, icons, motion, states, pattern map and structure. (planning)
- 2026-10-20: Login is a root-stack route presented as a native `formSheet` (`fitToContents`, grabber) over the tabs; tabs live in `src/app/(tabs)/`. Form fields are a minimal `features/auth/text-field.tsx` (label, `TextInput`, error line) and the submit is a plain primary-token `Pressable`; both move onto `ui/` primitives after the design-system branch merges. Field errors show after blur or the first submit; backend errors show inline under the form as returned. (auth)
- 2026-10-20: The Profile tab is the third native tab (between catalog and search). Signed out: muted copy plus a login button that opens the sheet; signed in: avatar, username, email. Logout is a header `Stack.Toolbar` button (SF `rectangle.portrait.and.arrow.right`), not a content button. The summary lives in `features/auth` until the `users` feature exists. (auth)
- 2026-10-20: Session state is in `features/auth` (`useSession`, `signIn`/`signOut`, token storage), as the parent plan asked, not in `src/services/` as section 10 suggests; move it if `services/` becomes the home for session hooks. (auth)
