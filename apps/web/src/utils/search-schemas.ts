import { z } from 'zod';

import { COMMENT_SORT_VALUES } from '@/utils/constants/comment-sort';

// Helpers: normalize URL search param values
// TanStack Router parses ?key=a&key=b → ['a','b'] but ?key=a → 'a' (string, not array)
const stringArray = z.preprocess(
    (v) => (v == null ? undefined : Array.isArray(v) ? v : [v]),
    z.array(z.string()),
);

const numberArray = z.preprocess(
    (v) =>
        v == null ? undefined : Array.isArray(v) ? v.map(Number) : [Number(v)],
    z.array(z.number()),
);

const coerceBoolean = z.preprocess(
    (v) => v === 'true' || v === true || v === '1',
    z.boolean(),
);

const optionalTrue = z.preprocess(
    (v) => (v === 'true' || v === true || v === '1' ? true : undefined),
    z.literal(true).optional(),
);

// Composable schema fragments
const paginationSearch = {
    page: z.coerce.number().optional().catch(undefined),
};

const sortOrderSearch = {
    sort: z.string().optional().catch(undefined),
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

export const editContentSearchSchema = z.object({
    tab: z
        .enum(['anime', 'manga', 'novel', 'character', 'person'])
        .optional()
        .catch(undefined),
    title_ua: coerceBoolean.optional().catch(undefined),
    title_en: coerceBoolean.optional().catch(undefined),
    title_original: coerceBoolean.optional().catch(undefined),
    synopsis_ua: coerceBoolean.optional().catch(undefined),
    synopsis_en: coerceBoolean.optional().catch(undefined),
    media_type: z.string().optional().catch(undefined),
    mal_id: z.coerce.number().optional().catch(undefined),
    name_ua: coerceBoolean.optional().catch(undefined),
    name_en: coerceBoolean.optional().catch(undefined),
    name_original: coerceBoolean.optional().catch(undefined),
    description_ua: coerceBoolean.optional().catch(undefined),
    content_type: z
        .enum(['anime', 'manga', 'novel'])
        .optional()
        .catch(undefined),
    content_slug: z.string().optional().catch(undefined),
    ...paginationSearch,
});

export const editNewSearchSchema = z.object({
    content_type: z.string().optional().catch(undefined),
    slug: z.string().optional().catch(undefined),
});

export const commentsSearchSchema = z.object({
    comment_type: z.enum(['comment', 'review']).optional().catch(undefined),
    recommended: z.enum(['yes', 'no', 'maybe']).optional().catch(undefined),
    first_level_only: optionalTrue.catch(undefined),
    sort: z.enum(COMMENT_SORT_VALUES).optional().catch(undefined),
    order: z.enum(['asc', 'desc']).optional().catch(undefined),
});

export const collectionsSearchSchema = z.object({
    sort: z.enum(['system_ranking', 'created']).optional().catch(undefined),
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
        .enum(['all', 'comments', 'articles', 'collections'])
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
export type CommentsSearch = z.infer<typeof commentsSearchSchema>;
export type EditSearch = z.infer<typeof editSearchSchema>;
export type EditContentSearch = z.infer<typeof editContentSearchSchema>;
export type UserlistSearch = z.infer<typeof userlistSearchSchema>;
