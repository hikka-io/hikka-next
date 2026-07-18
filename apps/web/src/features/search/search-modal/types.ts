import {
    type AnimeResponse,
    type CharacterResponse,
    ContentTypeEnum,
    type MangaResponse,
    type NovelResponse,
    type PersonResponse,
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

/** Ukrainian labels for the searchable types (toggle, history entries, etc.). */
export const SEARCH_TYPE_LABELS: Partial<Record<SearchTypeValue, string>> = {
    [SEARCH_TYPE_ALL]: 'Усе',
    [ContentTypeEnum.ANIME]: 'Аніме',
    [ContentTypeEnum.MANGA]: 'Манґа',
    [ContentTypeEnum.NOVEL]: 'Ранобе',
    [ContentTypeEnum.CHARACTER]: 'Персонаж',
    [ContentTypeEnum.PERSON]: 'Людина',
    [ContentTypeEnum.USER]: 'Користувач',
};
