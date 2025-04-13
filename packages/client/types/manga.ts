import {
    ContentStatusEnum,
    ExternalResponse,
    GenreResponse,
    PaginationResponse,
    RoleResponse,
} from './common';
import { PersonResponse } from './people';

/**
 * Manga media types
 */
export enum MangaMediaEnum {
    ONE_SHOT = 'one_shot',
    DOUJIN = 'doujin',
    MANHUA = 'manhua',
    MANHWA = 'manhwa',
    MANGA = 'manga',
}

/**
 * Base manga response
 */
export interface MangaResponse {
    data_type: string;
    start_date: number | null;
    end_date: number | null;
    title_original: string | null;
    media_type: string | null;
    title_ua: string | null;
    title_en: string | null;
    chapters: number | null;
    volumes: number | null;
    translated_ua: boolean;
    status: string | null;
    image: string | null;
    year: number | null;
    scored_by: number;
    score: number;
    slug: string;
}

/**
 * Read status base response
 */
export interface ReadResponseBase {
    reference: string;
    note: string | null;
    updated: number;
    created: number;
    status: string;
    chapters: number;
    volumes: number;
    rereads: number;
    score: number;
}

/**
 * Manga response with read status
 */
export interface MangaResponseWithRead extends MangaResponse {
    read: ReadResponseBase[];
}

/**
 * Paginated manga response
 */
export interface MangaPaginationResponse {
    pagination: PaginationResponse;
    list: MangaResponseWithRead[];
}

/**
 * Manga search parameters
 */
export interface MangaSearchArgs {
    years?: [number | null, number | null];
    media_type?: MangaMediaEnum[];
    status?: ContentStatusEnum[];
    only_translated?: boolean;
    magazines?: string[];
    genres?: string[];
    score?: [number | null, number | null];
    query?: string;
    sort?: string[];
}

/**
 * Magazine response
 */
export interface MagazineResponse {
    name_en: string;
    slug: string;
}

/**
 * Content author response
 */
export interface ContentAuthorResponse {
    roles: RoleResponse[];
    person: PersonResponse;
}

/**
 * Read statistics response
 */
export interface ReadStatsResponse {
    completed: number;
    reading: number;
    planned: number;
    dropped: number;
    on_hold: number;
    score_1: number;
    score_2: number;
    score_3: number;
    score_4: number;
    score_5: number;
    score_6: number;
    score_7: number;
    score_8: number;
    score_9: number;
    score_10: number;
}

/**
 * Detailed manga info response
 */
export interface MangaInfoResponse {
    data_type: string;
    authors: ContentAuthorResponse[];
    magazines: MagazineResponse[];
    external: ExternalResponse[];
    start_date: number | null;
    end_date: number | null;
    genres: GenreResponse[];
    title_original: string | null;
    stats: ReadStatsResponse;
    synopsis_en: string | null;
    synopsis_ua: string | null;
    media_type: string | null;
    chapters: number | null;
    title_en: string | null;
    title_ua: string | null;
    updated: number;
    synonyms: string[];
    comments_count: number;
    has_franchise: boolean;
    translated_ua: boolean;
    volumes: number | null;
    status: string | null;
    image: string | null;
    year: number | null;
    scored_by: number;
    score: number;
    mal_id: number;
    nsfw: boolean;
    slug: string;
}
