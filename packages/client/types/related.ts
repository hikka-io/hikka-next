import type { AnimeResponse } from './anime';
import type { ContentTypeEnum } from './common';
import type { MangaResponse } from './manga';
import type { NovelResponse } from './novel';

/**
 * Related content types
 */
export type RelatedContentType =
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;

/**
 * Franchise response
 */
export interface FranchiseResponse {
    anime: AnimeResponse[];
    manga: MangaResponse[];
    novel: NovelResponse[];
}
