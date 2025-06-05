import { AnimeResponse } from './anime';
import { CharacterResponse } from './characters';
import { CollectionContent, CollectionResponse } from './collections';
import { ContentTypeEnum, PaginationResponse } from './common';
import { MangaResponse } from './manga';
import { NovelResponse } from './novel';

/**
 * Favourite content type
 */
export type FavouriteContentType =
    | ContentTypeEnum.COLLECTION
    | ContentTypeEnum.CHARACTER
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;

/**
 * Favourite response
 */
export interface FavouriteResponse {
    reference: string;
    created: number;
}

/**
 * Favourite anime response
 */
export interface FavouriteAnimeResponse extends AnimeResponse {
    favourite_created: number;
}

/**
 * Favourite manga response
 */
export interface FavouriteMangaResponse extends MangaResponse {
    favourite_created: number;
}

/**
 * Favourite novel response
 */
export interface FavouriteNovelResponse extends NovelResponse {
    favourite_created: number;
}

/**
 * Favourite character response
 */
export interface FavouriteCharacterResponse extends CharacterResponse {
    favourite_created: number;
}

/**
 * Favourite collection response
 */
export interface FavouriteCollectionResponse
    extends CollectionResponse<CollectionContent> {
    favourite_created: number;
}

export type FavouriteItem =
    | FavouriteAnimeResponse
    | FavouriteMangaResponse
    | FavouriteNovelResponse
    | FavouriteCollectionResponse
    | FavouriteCharacterResponse;

/**
 * Favourite pagination response
 */
export interface FavouritePaginationResponse<TItem extends FavouriteItem> {
    list: TItem[];
    pagination: PaginationResponse;
}
