# UI/Layout Component Audit — Final Report

## 1. Executive Summary

The audited surface (300 UI/layout components) is structurally healthy and follows a coherent feature-first architecture, but it carries a recurring tax from **per-content-type duplication**: nearly every place that handles anime/manga/novel ships three near-identical files instead of one adapter-driven component. This is the dominant theme by far — the home progress widgets alone account for ~1,000 lines of clone, and the catalog lists, appearance grids, and filter footers repeat the same triplet/duplicate pattern. The second theme is **missing UI primitives**: there is no shared `Spinner` (37 copy-pasted DaisyUI-style spans) and the `Skeleton` primitive is bypassed by most skeleton components, which reinvent it inline with a divergent border radius. A handful of genuine defects exist — a malformed dynamic Tailwind class that silently drops a border color, leftover `console.log` calls in render/select paths, and dead unreachable code — but these are small and isolated. Accessibility gaps are narrow but real: two interactive table patterns (sortable headers, clickable edit rows) are mouse-only. Notably, the widely-flagged `bg-${status}` "unsafe Tailwind" warnings are **false positives** — those classes are explicitly safelisted and are the intended convention, so no effort should be spent "fixing" them. Overall: low defect density, high consolidation opportunity, and a few quick correctness/a11y wins.

## 2. Top Priorities

| # | Theme | Files | Impact | Effort |
|---|-------|-------|--------|--------|
| 1 | Malformed status border class (real bug — border color never renders) | `features/common/watchlist-button/components/icon-watch-status-button.tsx:79` | High (visible defect) | Small |
| 2 | Home progress widgets triplicated (~1,000 LOC; behavior already silently diverged) | `features/home/profile/components/{anime-watchlist,manga-readlist,novel-readlist}.tsx` | High | Medium–Large |
| 3 | Leftover `console.log` in render/select paths | `features/content/franchise/index.tsx:52`, `features/users/profile/user-favorites/index.tsx:35-52` | Medium (prod noise + dead work) | Small |
| 4 | Sortable table headers mouse-only (no keyboard/SR) | `features/users/list/userlist/components/table-view/index.tsx` | Medium (a11y) | Small |
| 5 | Clickable EditRow mouse-only (no keyboard path) | `features/edit/edit-list/components/edit-row.tsx` | Medium (a11y) | Small |
| 6 | No shared `Spinner` primitive (37 ad-hoc spans + ported DaisyUI CSS) | `components/load-more-button.tsx`, `features/common/follow-button.tsx`, `features/auth/login-form.tsx`, `globals.css` | Medium | Large |
| 7 | Catalog list grids + skeletons triplicated | `features/{anime,manga,novel}/{anime,manga,novel}-list/index.tsx` + `*-list-skeleton.tsx` | Medium | Medium |
| 8 | `Skeleton` primitive bypassed by most skeletons (radius drift) | `components/ui/skeleton.tsx`, `content-card/tooltips/tooltip-skeleton.tsx`, `article-item/article-item-skeleton.tsx` | Medium | Medium |

## 3. Duplication & Merge Opportunities

### 3a. Per-content-type triplets (the big theme)

These all express the same anime/manga/novel variation and should converge on the established `CONTENT_CONFIG` adapter pattern.

- **Home progress widgets** (findings #1, #9) — the single largest duplication block. `manga-readlist.tsx` and `novel-readlist.tsx` are byte-identical after name normalization; `anime-watchlist.tsx` shares the structure but with a *different optimistic-update strategy* (anime debounces via local state + `useDebounce`; reads mutate immediately off `variables`/`isPending`).
  - **Phase 1 (low risk):** merge `manga-readlist.tsx` + `novel-readlist.tsx` into one `ReadlistWidget` taking `contentType: ContentTypeEnum.MANGA | NOVEL`; derive route, media-type map, and empty-state copy from a lookup (add `route`/`mediaTypeMap` to `CONTENT_CONFIG`). Behavior-preserving ~336-line deletion.
  - **Phase 2 (involved):** factor the shared shell into a `ProgressTrackerWidget` driven by an adapter. **Critical:** the adapter must abstract the mutation *strategy* — do not flatten anime's debounce into the read path's immediate-mutate (or vice versa) without confirming tolerance, or you change the +/- UX. Also fix the latent `||` bug in the read variants (use `??` so a chapter value of `0` is respected, as anime already does).

- **Catalog list grids** (finding #2) — `{anime,manga,novel}-list/index.tsx` are 88-line files identical except for card component, search hook, `queryKeys` namespace, and skeleton.
  - **Quick win:** delete the three 22-line `*-list-skeleton.tsx` (100% identical) → one shared `CatalogListSkeleton` in `components/`. Zero risk.
  - **Then:** extract a generic `CatalogList` taking `content_type`, resolving card renderer / search hook / `queryKeys` via `CONTENT_CONFIG`. Keep the per-type `build*SearchArgs`/`use*SearchQuery` hooks separate — their arg-shaping genuinely differs (anime: season/rating/studios/date_range; manga/novel: different enums + years tuple).

- **Character & Person appearance grids** (finding #3) — 7 ~60-line files (`features/characters/{anime,manga,novel}.tsx`, `features/people/{anime,manga,novel,characters}.tsx`) implement the identical `useParams → use*Media hook → Block > Header > Stack > slice(0,4) > LoadMoreButton` scaffold.
  - Extract a presentational `AppearanceGrid` in `features/common` with props `title`, `href`, the destructured query result, `extended?`, `renderItem`, and optional `stackClassName` (for the `grid-cols-3 sm:grid-cols-4` override used only by people/characters). Keep the hook call *inside each wrapper* to satisfy hook rules — each file becomes a thin wrapper.

### 3b. Two-copy duplicates

- **`CollectionCard` ×2** (finding #4) — same name, ~85% identical markup in `features/home/collections/components/collection-card.tsx` and `features/collections/collection-list/components/collection-card.tsx`. Merge into the more capable `features/collections` copy with a `variant: 'default' | 'compact'` prop controlling: responsive edge-to-edge wrapper, FollowButton sizing, avatar width (w-12 vs w-10), title element (`<h3>` vs `<Label>`), tag visibility, and Stack gap. **Decide intentionally** whether the merged card always shows preview titles (the home copy currently omits `getTitle`). Update both feature indexes and delete the home copy.

- **Filters footers ×2** (finding #5) — `AnimeFiltersFooter` (`features/watch/anime-filters.tsx`) and `ReadFiltersFooter` (`features/read/read-filters.tsx`) duplicate the full preset-builder logic (~95% identical). Extract one shared `FiltersFooter` in `features/filters` implementing the superset (include `date_range_enabled` coercion + pathname inference for `/anime`, `/manga`, `/novel`) — both extra branches are inert where they don't apply, so it's behavior-preserving. Keep `AnimeFiltersBody`/`ReadFiltersBody` as-is (genuinely distinct field lists).

### 3c. Partial overlap — keep separate

- **`ScheduleItem` ×2** (finding #13) — different surfaces (compact home widget vs full schedule grid), only ~3 lines of shared logic. Do **not** merge. Single safe win: move the `'Вийшло'` (elapsed) formatting out of the inline `getDuration()` in `features/schedule/schedule-list/components/schedule-item.tsx` into `getScheduleDuration` in `@/utils/i18n`.

- **Character vs content `Description`** (finding #14) — extract a shared `DescriptionBlock` (e.g. `components/content/description-block.tsx`) taking `title` + an `options` array of `{value,label,ariaLabel,text}`. It should filter empty/whitespace options, return `null` when none remain, and render the `ToggleGroup` only when >1 option survives — which removes the dead single-UA toggle in the character variant. Low priority, pure cleanup.

## 4. Consistency Issues

### Loading states
- **No shared `Spinner`** (finding #7) — 37 files use raw `<span className="loading loading-spinner">` (a hand-ported DaisyUI class in `globals.css` lines ~1155-1173, despite this being a shadcn/Tailwind 4 project), with inconsistent markup (`mr-2`, `size-5!`, self-closing vs not), while `sonner.tsx` uses lucide `<LoaderCircle className="animate-spin" />`. Create `components/ui/spinner.tsx` as a cva primitive with size variants that keeps `currentColor` inheritance; migrate all 37 spans mapping modifiers to variants; then delete the DaisyUI CSS blocks.
- **Home widgets render blank while loading** (finding #25) — `{anime-watchlist,manga-readlist,novel-readlist}.tsx` render nothing while `list` is `undefined`, unlike sibling sections. Add an `isLoading`/`isPending` branch rendering a `SkeletonCard` grid (the `range(0,8)` pattern from `ongoings.tsx`). The home Articles section has the same gap — fix in the same pass.

### Skeletons
- **`Skeleton` primitive bypassed** (finding #8) — most skeletons reinvent `bg-secondary/20 animate-pulse rounded-md` inline with raw divs using `rounded-lg` (radius drift); `tooltip-skeleton.tsx` has 35 raw divs and zero `<Skeleton>` usages. Migrate high-density offenders (`tooltip-skeleton.tsx`, `article-item-skeleton.tsx`, the per-card content-card skeleton) to `<Skeleton>`. Make a deliberate radius decision (most placeholders use `rounded-lg`) rather than flattening — keep `rounded-full`/squares where shape matters. Drop wrapper-level `animate-pulse` when migrating (the primitive already includes it).

### Styling / tokens
- **Hardcoded role hex colors** (findings #15, #26) — `text-[#d0bfff]` (admin) / `text-[#ffc9c9]` (moderator) duplicated verbatim across **three** files (`features/users/user-title.tsx`, `components/content-card/tooltips/user-tooltip.tsx`, `features/comments/comment.tsx`); `feed-item-header.tsx` `TYPE_BADGE_STYLES` is a separate instance (4 more hexes). These won't respond to theming. Minimal safe win: add semantic CSS vars (`--color-role-admin`, `--color-role-moderator`, feed type tokens) under `:root` + `.dark` and reference via `text-role-admin`/`text-role-moderator`. Optional second step: a `RoleBadge` component — but it must expose a `variant`/`className` for the two distinct wrappers (bordered chip in user-title/user-tooltip vs bare in comment.tsx) to avoid regressing a call site.
- **FALSE POSITIVE — do not act** (finding #16): the `bg-${status}` dynamic-class warnings are wrong. These are explicitly safelisted via `@source inline(...)` in `globals.css` (lines 7-39) with matching `--color-*` tokens and are the canonical convention in ~23 places. Do **not** convert to cva. The only real action here is keeping the safelist in sync and fixing the one malformed instance (see Quality §6).

### Prop API / exports
- **Ref-forwarding split** (finding #18) — 24 UI files use `forwardRef`, 40 use the React 19 ref-as-prop pattern. Adopt ref-as-prop as canonical, add a one-line rule to `CLAUDE.md`, and migrate incrementally starting with `button.tsx`/`input.tsx`/`textarea.tsx` (+ dependent wrappers like `load-more-button.tsx`). Low priority, no runtime impact.
- **Default vs named export mix** (finding #19) — documentation fix only. Add a `CLAUDE.md` exception: shadcn-derived multi-subcomponent primitives keep upstream named exports; custom single-purpose components default-export. Do **not** convert `Card` (65 import sites) or the other 9 default-exported files.

## 5. Structure & Organization

- **Data-fetching tooltips in `components/`** (finding #20) — `content-card/tooltips/*` fire `useAnimeBySlug`/`useUserByUsername`/etc. and `context-menu-overlay.tsx` gates on `useSession()`, contradicting the "components/ = no `@hikka/react` hooks" rule. The whole `content-card/` subtree already depends on `@hikka/react`. Recommended fix is **documentation**: amend `CLAUDE.md` + `MEMORY.md` to sanction `content-card/` (cards + data-aware tooltips) as an explicit data-aware exception, rather than splitting a cohesive module/barrel. The amendment should also acknowledge `markdown/link.tsx`, `markdown/viewer/components/mention.tsx`, and `plate/ui/image-group-add-image.tsx` as the same exception.
- **`markdown/` is data-coupled** (finding #21) — `mention.tsx` calls `useUserByUsername`; `link.tsx` imports the content-card tooltips + `useSession`. Simplest correct fix: move the markdown viewer into a feature folder (e.g. `features/markdown` or `features/comments`), resolved *jointly* with the tooltip placement decision. No behavior change needed; only pursue renderer-injection-via-props if a second markdown consumer with different needs emerges.
- **Naming violations** (findings #22, #23):
  - `features/common/search-modal/hooks/` — all 7 files are camelCase, the sole outlier. Rename to kebab-case. Only `index.tsx:21` (the `useSearchModal` import) needs updating. The 6 per-entity `use*SearchList` hooks have **zero importers** and appear to be dead code — consider **deleting** rather than renaming.
  - `components/markdown/viewer/MD-viewer.tsx` — only non-kebab component filename. Rename to `md-viewer.tsx` and update all 19 direct import paths (no barrel). Use `git mv` (macOS is case-insensitive) so the rename records correctly for case-sensitive CI.

## 6. Quality & Accessibility

### Correctness defects
- **Malformed status border class** (findings #6, #16) — `icon-watch-status-button.tsx:79` builds `bg-${watch.status} text-${watch.status}-foreground border- border${watch.status}-border` — a stray `border-` token and a missing hyphen mean the border color is **silently never applied**. Replace with the canonical form used by the sibling read button and 20+ call sites: `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`.
- **Leftover `console.log`** (finding #10) — delete `console.log('data', data)` from `franchise/index.tsx:52` (the `select` callback should just return the object); delete the entire `console.log(mergeUserUI(...))` block in `user-favorites/index.tsx:35-52` (it builds a full merged-UI object purely to log on every render) and remove the now-unused `DEFAULT_USER_UI` / `mergeUserUI` imports (lines 16-17).
- **Dead unreachable code** (findings #17, #24) — `article-item-skeleton.tsx` has a second `return (...)` block (lines 62-72) after the unconditional first return — delete it. Also drop the empty `interface Props {}` and convert to a no-prop arrow function.

### Accessibility
- **Sortable table headers mouse-only** (finding #11) — `userlist/.../table-view/index.tsx`: sortable `<TableHead>`s have `onClick` + `cursor-pointer` but no `tabIndex`/`onKeyDown`/`role`/`aria-sort`. Render the label as a real `<button type="button">` inside the `<th>`, add `aria-sort` computed from current state, and (since 5 headers share the pattern) extract a small `SortableHead` wrapper. This also resolves the color-only active-sort cue.
- **Clickable EditRow mouse-only** (finding #12) — `edit-list/components/edit-row.tsx`: whole `<TableRow>` navigates via `onClick`/`onAuxClick` with no keyboard path. Preferred fix (matches existing `Link` usage): wrap the edit-id cell (line 55) in a `Link` to `/edit/$editId`. The existing `closest('a, button')` guard in `handleRowClick` already prevents double-navigation.

## 7. Suggested Sequencing

**Wave 1 — Quick wins (small, low risk, high signal):**
1. Fix the malformed status border class (`icon-watch-status-button.tsx:79`).
2. Remove `console.log`s + unused imports (`franchise`, `user-favorites`).
3. Delete dead unreachable block + empty `Props` in `article-item-skeleton.tsx`.
4. A11y: make sortable headers keyboard/SR-accessible; add a `Link` to EditRow.
5. Delete the 3 identical `*-list-skeleton.tsx` → one `CatalogListSkeleton`.
6. Merge `manga-readlist.tsx` + `novel-readlist.tsx` → `ReadlistWidget` (Phase 1, behavior-preserving) and fix the `||` → `??` bug.

**Wave 2 — Mid-size consolidations:**
7. Extract `AppearanceGrid` (collapses 7 character/people files).
8. Extract generic `CatalogList` (extend `CONTENT_CONFIG`).
9. Merge the two `CollectionCard`s behind a `variant` prop.
10. Merge the two filters footers into one shared `FiltersFooter`.
11. Add home-widget loading skeletons; extract `DescriptionBlock`.
12. Token extraction for role colors (+ optional `RoleBadge`).

**Wave 3 — Larger / systemic (do after the dust settles):**
13. Create `components/ui/spinner.tsx` and migrate all 37 spans; delete DaisyUI CSS.
14. Migrate skeleton components onto the `<Skeleton>` primitive with a deliberate radius default.
15. Fold `anime-watchlist.tsx` into `ProgressTrackerWidget` (Phase 2) — only after confirming the mutation-strategy abstraction preserves anime's debounce.

**Wave 4 — Documentation & naming (batch, deferrable):**
16. Rename `MD-viewer.tsx` → `md-viewer.tsx` (`git mv`); rename/delete `search-modal/hooks/*`.
17. `CLAUDE.md`/`MEMORY.md` amendments: ref-as-prop rule, export-style exception, `content-card`/`markdown` data-aware exception.
18. Begin incremental `forwardRef` → ref-as-prop migration.
