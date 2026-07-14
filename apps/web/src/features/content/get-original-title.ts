import {
    type AnimeInfoResponse,
    ContentTypeEnum,
    type MangaInfoResponse,
    type NovelInfoResponse,
} from '@hikka/api';

type ContentInfo = AnimeInfoResponse | MangaInfoResponse | NovelInfoResponse;

export const getOriginalTitle = (data: ContentInfo): string | null =>
    data.data_type === ContentTypeEnum.ANIME
        ? data.title_ja
        : data.title_original;
