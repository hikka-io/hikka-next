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

/** Union of the main searchable content types (keeps card props well-typed). */
export type SearchContent =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | CharacterResponse
    | PersonResponse;
