import { AnimeResponseWithWatch } from './anime';
import { CharacterResponse } from './characters';
import { CollectionResponse } from './collections';
import { PaginationResponse } from './common';
import { MangaResponseWithRead } from './manga';
import { NovelResponseWithRead } from './novel';

/**
 * Favourite content type enum
 */
export enum FavouriteContentTypeEnum {
    COLLECTION = 'collection',
    CHARACTER = 'character',
    ANIME = 'anime',
    MANGA = 'manga',
    NOVEL = 'novel',
}

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
export interface FavouriteAnimeResponse extends AnimeResponseWithWatch {
    data_type: string;
    favourite_created: number;
}

/**
 * Favourite manga response
 */
export interface FavouriteMangaResponse extends MangaResponseWithRead {
    data_type: string;
    favourite_created: number;
}

/**
 * Favourite novel response
 */
export interface FavouriteNovelResponse extends NovelResponseWithRead {
    data_type: string;
    favourite_created: number;
}

/**
 * Favourite character response
 */
export interface FavouriteCharacterResponse extends CharacterResponse {
    data_type: string;
    favourite_created: number;
}

/**
 * Favourite collection response
 */
export interface FavouriteCollectionResponse extends CollectionResponse {
    data_type: string;
    favourite_created: number;
}

/**
 * Favourite pagination response
 */
export interface FavouritePaginationResponse {
    list: Array<
        | FavouriteAnimeResponse
        | FavouriteMangaResponse
        | FavouriteNovelResponse
        | FavouriteCollectionResponse
        | FavouriteCharacterResponse
    >;
    pagination: PaginationResponse;
}
