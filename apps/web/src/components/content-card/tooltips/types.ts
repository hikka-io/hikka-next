import type {
    AnimeResponseWithWatch,
    MangaResponseWithRead,
    NovelResponseWithRead,
} from '@hikka/api';

export type MediaTooltipItem =
    | AnimeResponseWithWatch
    | MangaResponseWithRead
    | NovelResponseWithRead;
