import { API_LIMITS, ContentTypeEnum } from '@hikka/api';

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

/** The web's search type labels (`features/search/types.ts`). */
export const SEARCH_SCOPE_LABELS: Record<SearchScope, string> = {
    all: 'Усе',
    [ContentTypeEnum.ANIME]: 'Аніме',
    [ContentTypeEnum.MANGA]: 'Манґа',
    [ContentTypeEnum.NOVEL]: 'Ранобе',
    [ContentTypeEnum.CHARACTER]: 'Персонаж',
    [ContentTypeEnum.PERSON]: 'Людина',
    [ContentTypeEnum.USER]: 'Користувач',
};

/** Section headings of the "Усе" scope, like the web's `CONTENT_TYPES[type].plural`. */
export const SEARCH_SECTION_TITLES: Record<SearchType, string> = {
    [ContentTypeEnum.ANIME]: 'Аніме',
    [ContentTypeEnum.MANGA]: 'Манґа',
    [ContentTypeEnum.NOVEL]: 'Ранобе',
    [ContentTypeEnum.CHARACTER]: 'Персонажі',
    [ContentTypeEnum.PERSON]: 'Люди',
    [ContentTypeEnum.USER]: 'Користувачі',
};

/** User search needs a longer query than content search (`userSearchQuery`). */
export function minQueryLength(type: SearchType) {
    return type === ContentTypeEnum.USER
        ? API_LIMITS.userSearchQuery.min
        : API_LIMITS.searchQuery.min;
}

/** Trims to the API's maximum and reports whether the query is long enough to send. */
export function searchQuery(text: string, type: SearchType) {
    const query = text.trim().slice(0, API_LIMITS.searchQuery.max);

    return query.length >= minQueryLength(type) ? query : null;
}
