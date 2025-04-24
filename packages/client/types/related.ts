import { AnimeResponse } from './anime';
import { ContentTypeEnum } from './common';
import { MangaResponse } from './manga';
import { NovelResponse } from './novel';

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
