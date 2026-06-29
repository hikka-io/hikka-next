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
 * Union of the main searchable content types. The all-search-list and
 * search-modal only narrow on `.slug`, but the full union keeps card props
 * well-typed at the call sites.
 */
export type SearchContent =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | CharacterResponse
    | PersonResponse;
