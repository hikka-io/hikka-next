import {
    ContentStatusEnum,
    ExternalResponse,
    GenreResponse,
    PaginationResponse,
} from './common';
import {
    ContentAuthorResponse,
    MagazineResponse,
    ReadResponseBase,
    ReadStatsResponse,
} from './manga';

/**
 * Novel media types
 */
export enum NovelMediaEnum {
    LIGHT_NOVEL = 'light_novel',
    NOVEL = 'novel',
}

/**
 * Base novel response
 */
export interface NovelResponse {
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
 * Novel response with read status
 */
export interface NovelResponseWithRead extends NovelResponse {
    read: ReadResponseBase[];
}

/**
 * Paginated novel response
 */
export interface NovelPaginationResponse {
    pagination: PaginationResponse;
    list: NovelResponseWithRead[];
}

/**
 * Novel search parameters
 */
export interface NovelSearchArgs {
    years?: [number | null, number | null];
    media_type?: NovelMediaEnum[];
    status?: ContentStatusEnum[];
    only_translated?: boolean;
    magazines?: string[];
    genres?: string[];
    score?: [number | null, number | null];
    query?: string;
    sort?: string[];
}

/**
 * Detailed novel info response
 */
export interface NovelInfoResponse {
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
