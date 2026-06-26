import type {
    AnimeResponse,
    CharacterResponse,
    ContentTypeEnum,
    MangaResponse,
    NovelResponse,
    PersonResponse,
} from '@hikka/api';

export type SearchTypeValue = ContentTypeEnum | 'all';

export const SEARCH_TYPE_ALL = 'all' as const;

/**
 * Main searchable content (replaces the old `the legacy client` `MainContent`
 * union). The all-search-list and search-modal only narrow on `.slug`, but the
 * full union keeps card props well-typed at the call sites.
 */
export type SearchContent =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | CharacterResponse
    | PersonResponse;
