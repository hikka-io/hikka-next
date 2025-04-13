import { AnimeResponseWithWatch } from './anime';
import { PaginationResponse } from './common';
import { MangaResponseWithRead } from './manga';
import { NovelResponseWithRead } from './novel';
import { PersonResponse } from './people';

/**
 * Character response
 */
export interface CharacterResponse {
    data_type: string;
    name_ua: string | null;
    name_en: string | null;
    name_ja: string | null;
    image: string | null;
    slug: string;
    synonyms: string[];
}

/**
 * Character count response
 */
export interface CharacterCountResponse extends CharacterResponse {
    description_ua: string | null;
    voices_count: number;
    anime_count: number;
    manga_count: number;
    novel_count: number;
}

/**
 * Characters search query
 */
export interface QuerySearchArgs {
    query?: string | null;
}

/**
 * Paginated characters search response
 */
export interface CharactersSearchPaginationResponse {
    pagination: PaginationResponse;
    list: CharacterResponse[];
}

/**
 * Character anime response
 */
export interface CharacterAnimeResponse {
    main: boolean;
    anime: AnimeResponseWithWatch;
}

/**
 * Paginated character anime response
 */
export interface CharacterAnimePaginationResponse {
    pagination: PaginationResponse;
    list: CharacterAnimeResponse[];
}

/**
 * Character manga response
 */
export interface CharacterMangaResponse {
    main: boolean;
    manga: MangaResponseWithRead;
}

/**
 * Paginated character manga response
 */
export interface CharacterMangaPaginationResponse {
    pagination: PaginationResponse;
    list: CharacterMangaResponse[];
}

/**
 * Character novel response
 */
export interface CharacterNovelResponse {
    main: boolean;
    novel: NovelResponseWithRead;
}

/**
 * Paginated character novel response
 */
export interface CharacterNovelPaginationResponse {
    pagination: PaginationResponse;
    list: CharacterNovelResponse[];
}

/**
 * Character voice response
 */
export interface CharacterVoiceResponse {
    anime: AnimeResponseWithWatch;
    person: PersonResponse;
    language: string;
}

/**
 * Paginated character voices response
 */
export interface CharacterVoicesPaginationResponse {
    list: CharacterVoiceResponse[];
    pagination: PaginationResponse;
}
