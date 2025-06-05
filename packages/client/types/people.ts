import { AnimeResponse } from './anime';
import { CharacterResponse } from './characters';
import {
    ContentTypeEnum,
    PaginatedResponse,
    PaginationResponse,
    RoleResponse,
} from './common';
import { MangaResponse } from './manga';
import { NovelResponse } from './novel';

/**
 * Person response
 */
export interface PersonResponse {
    data_type: ContentTypeEnum.PERSON;
    name_native: string | null;
    name_ua: string | null;
    name_en: string | null;
    title?: string;
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
export interface PersonSearchPaginationResponse
    extends PaginatedResponse<PersonResponse> {}

/**
 * Person anime response
 */
export interface PersonAnimeResponse {
    roles: RoleResponse[];
    anime: AnimeResponse;
}

/**
 * Paginated person anime response
 */
export interface PersonAnimePaginationResponse
    extends PaginatedResponse<PersonAnimeResponse> {}

/**
 * Person manga response
 */
export interface PersonMangaResponse {
    roles: RoleResponse[];
    manga: MangaResponse;
}

/**
 * Paginated person manga response
 */
export interface PersonMangaPaginationResponse
    extends PaginatedResponse<PersonMangaResponse> {}

/**
 * Person novel response
 */
export interface PersonNovelResponse {
    roles: RoleResponse[];
    novel: NovelResponse;
}

/**
 * Paginated person novel response
 */
export interface PersonNovelPaginationResponse
    extends PaginatedResponse<PersonNovelResponse> {}

/**
 * Person characters response
 */
export interface PersonCharactersResponse {
    character: CharacterResponse;
    anime: AnimeResponse;
    language: string;
}

/**
 * Paginated person characters response
 */
export interface PersonCharactersPaginationResponse {
    pagination: PaginationResponse;
    list: PersonCharactersResponse[];
}
