import { z } from 'zod';

// Helpers: normalize URL search param values
// TanStack Router parses ?key=a&key=b → ['a','b'] but ?key=a → 'a' (string, not array)
const stringArray = z.preprocess(
    (v) => (v == null ? undefined : Array.isArray(v) ? v : [v]),
    z.array(z.string()),
);

const numberArray = z.preprocess(
    (v) =>
        v == null
            ? undefined
            : Array.isArray(v)
              ? v.map(Number)
              : [Number(v)],
    z.array(z.number()),
);

const coerceBoolean = z.preprocess(
    (v) => v === 'true' || v === true || v === '1',
    z.boolean(),
);

// Composable schema fragments
const paginationSearch = {
    page: z.coerce.number().optional().catch(undefined),
};

const sortOrderSearch = {
    sort: stringArray.optional().catch(undefined),
    order: z.enum(['asc', 'desc']).optional().catch(undefined),
};

const textSearch = {
    search: z.string().optional().catch(undefined),
};

// Content catalog filters (shared by anime, manga, novel)
const contentFilterSearch = {
    genres: stringArray.optional().catch(undefined),
    types: stringArray.optional().catch(undefined),
    statuses: stringArray.optional().catch(undefined),
    years: numberArray.optional().catch(undefined),
    score: numberArray.optional().catch(undefined),
    only_translated: coerceBoolean.optional().catch(undefined),
};

// Anime-specific extensions
const animeFilterSearch = {
    ...contentFilterSearch,
    seasons: stringArray.optional().catch(undefined),
    ratings: stringArray.optional().catch(undefined),
    studios: stringArray.optional().catch(undefined),
    date_range: numberArray.optional().catch(undefined),
    date_range_enabled: coerceBoolean.optional().catch(undefined),
};

// Route-level schemas
export const animeSearchSchema = z.object({
    ...animeFilterSearch,
    ...sortOrderSearch,
    ...textSearch,
    ...paginationSearch,
});

export const mangaSearchSchema = z.object({
    ...contentFilterSearch,
    ...sortOrderSearch,
    ...textSearch,
    ...paginationSearch,
});

export const novelSearchSchema = z.object({
    ...contentFilterSearch,
    ...sortOrderSearch,
    ...textSearch,
    ...paginationSearch,
});

export const scheduleSearchSchema = z.object({
    season: z.string().optional().catch(undefined),
    year: z.string().optional().catch(undefined),
    status: stringArray.optional().catch(undefined),
    only_watch: coerceBoolean.optional().catch(undefined),
});

export const articlesSearchSchema = z.object({
    author: z.string().optional().catch(undefined),
    tags: stringArray.optional().catch(undefined),
    categories: stringArray.optional().catch(undefined),
    draft: coerceBoolean.optional().catch(undefined),
    ...sortOrderSearch,
    ...paginationSearch,
});

export const editSearchSchema = z.object({
    content_type: z.string().optional().catch(undefined),
    edit_status: z.string().optional().catch(undefined),
    author: z.string().optional().catch(undefined),
    moderator: z.string().optional().catch(undefined),
    ...sortOrderSearch,
    ...paginationSearch,
});

export const editNewSearchSchema = z.object({
    content_type: z.string().optional().catch(undefined),
    slug: z.string().optional().catch(undefined),
});

export const collectionsSearchSchema = z.object({
    sort: z
        .enum(['system_ranking', 'created'])
        .optional()
        .catch(undefined),
    ...paginationSearch,
});

export const userlistSearchSchema = z.object({
    status: z.string().optional().catch(undefined),
    view: z.string().optional().catch(undefined),
    ...contentFilterSearch,
    // Anime-specific (watchlist)
    seasons: stringArray.optional().catch(undefined),
    ratings: stringArray.optional().catch(undefined),
    studios: stringArray.optional().catch(undefined),
    // Readlist-specific
    magazines: stringArray.optional().catch(undefined),
    ...sortOrderSearch,
    ...paginationSearch,
});

export const feedSearchSchema = z.object({
    type: z
        .enum(['all', 'comments', 'articles', 'collections', 'activity'])
        .optional()
        .catch(undefined),
});

export const oauthSearchSchema = z.object({
    reference: z.string().optional().catch(undefined),
    scope: z.string().optional().catch(undefined),
});

// Type exports for consumers
export type AnimeSearch = z.infer<typeof animeSearchSchema>;
export type MangaSearch = z.infer<typeof mangaSearchSchema>;
export type NovelSearch = z.infer<typeof novelSearchSchema>;
export type ScheduleSearch = z.infer<typeof scheduleSearchSchema>;
export type ArticlesSearch = z.infer<typeof articlesSearchSchema>;
export type EditSearch = z.infer<typeof editSearchSchema>;
export type EditNewSearch = z.infer<typeof editNewSearchSchema>;
export type CollectionsSearch = z.infer<typeof collectionsSearchSchema>;
export type UserlistSearch = z.infer<typeof userlistSearchSchema>;
export type FeedSearch = z.infer<typeof feedSearchSchema>;
export type OAuthSearch = z.infer<typeof oauthSearchSchema>;
