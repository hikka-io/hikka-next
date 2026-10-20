import { API_LIMITS, ContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPES } from '@hikka/core';

export const SEARCH_SCOPES = [
    'all',
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
    ContentTypeEnum.USER,
] as const;

export type SearchScope = (typeof SEARCH_SCOPES)[number];

export type SearchType = Exclude<SearchScope, 'all'>;

export const SEARCH_TYPES = SEARCH_SCOPES.filter(
    (scope): scope is SearchType => scope !== 'all',
);

/** The web's search type labels (`features/search/types.ts`): "Усе", then core content type names. */
export const SEARCH_SCOPE_LABELS = {
    all: 'Усе',
    ...Object.fromEntries(
        SEARCH_TYPES.map((type) => [type, CONTENT_TYPES[type].title_ua]),
    ),
} as Record<SearchScope, string>;

/** Section headings of the "Усе" scope, like the web's `CONTENT_TYPES[type].plural`. */
export const SEARCH_SECTION_TITLES = Object.fromEntries(
    SEARCH_TYPES.map((type) => [type, CONTENT_TYPES[type].plural]),
) as Record<SearchType, string>;

/** User search needs a longer query than content search (`userSearchQuery`). */
function minQueryLength(type: SearchType) {
    return type === ContentTypeEnum.USER
        ? API_LIMITS.userSearchQuery.min
        : API_LIMITS.searchQuery.min;
}

/** Trims to the API's maximum and reports whether the query is long enough to send. */
export function searchQuery(text: string, type: SearchType) {
    const query = text.trim().slice(0, API_LIMITS.searchQuery.max);

    return query.length >= minQueryLength(type) ? query : null;
}
