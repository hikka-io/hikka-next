import type {
    AnimeResponse,
    AnimeResponseWithWatch,
    MangaResponse,
    MangaResponseWithRead,
    NovelResponse,
    NovelResponseWithRead,
} from '@hikka/api';

export type MediaTooltipItem =
    | AnimeResponse
    | AnimeResponseWithWatch
    | MangaResponse
    | MangaResponseWithRead
    | NovelResponse
    | NovelResponseWithRead;

export type MediaTooltipItemOf<T extends MediaTooltipItem['data_type']> =
    Extract<MediaTooltipItem, { data_type: T }>;
