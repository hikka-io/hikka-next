import { AnimeResponseWithWatch } from './anime';
import { CharacterResponse } from './characters';
import { PaginationResponse, RoleResponse } from './common';
import { MangaResponseWithRead } from './manga';
import { NovelResponseWithRead } from './novel';

/**
 * Person response
 */
export interface PersonResponse {
    data_type: string;
    name_native: string | null;
    name_ua: string | null;
    name_en: string | null;
    image: string | null;
    slug: string;
    description_ua: string | null;
    synonyms: string[];
}

/**
 * Person count response
 */
export interface PersonCountResponse extends PersonResponse {
    characters_count: number;
    anime_count: number;
    manga_count: number;
    novel_count: number;
}

/**
 * Paginated people search response
 */
export interface PersonSearchPaginationResponse {
    pagination: PaginationResponse;
    list: PersonResponse[];
}

/**
 * Person anime response
 */
export interface PersonAnimeResponse {
    roles: RoleResponse[];
    anime: AnimeResponseWithWatch;
}

/**
 * Paginated person anime response
 */
export interface PersonAnimePaginationResponse {
    pagination: PaginationResponse;
    list: PersonAnimeResponse[];
}

/**
 * Person manga response
 */
export interface PersonMangaResponse {
    roles: RoleResponse[];
    manga: MangaResponseWithRead;
}

/**
 * Paginated person manga response
 */
export interface PersonMangaPaginationResponse {
    pagination: PaginationResponse;
    list: PersonMangaResponse[];
}

/**
 * Person novel response
 */
export interface PersonNovelResponse {
    roles: RoleResponse[];
    novel: NovelResponseWithRead;
}

/**
 * Paginated person novel response
 */
export interface PersonNovelPaginationResponse {
    pagination: PaginationResponse;
    list: PersonNovelResponse[];
}

/**
 * Person characters response
 */
export interface PersonCharactersResponse {
    character: CharacterResponse;
    anime: AnimeResponseWithWatch;
    language: string;
}

/**
 * Paginated person characters response
 */
export interface PersonCharactersPaginationResponse {
    pagination: PaginationResponse;
    list: PersonCharactersResponse[];
}
