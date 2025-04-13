import { AnimeResponse } from './anime';
import { MangaResponse } from './manga';
import { NovelResponse } from './novel';

/**
 * Related content types enum
 */
export enum RelatedContentTypeEnum {
    ANIME = 'anime',
    MANGA = 'manga',
    NOVEL = 'novel',
}

/**
 * Franchise response
 */
export interface FranchiseResponse {
    anime: AnimeResponse[];
    manga: MangaResponse[];
    novel: NovelResponse[];
}
