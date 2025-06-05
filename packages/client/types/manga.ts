import {
    ContentStatusEnum,
    ContentTypeEnum,
    ExternalResponse,
    GenreResponse,
    PaginatedResponse,
    RoleResponse,
} from './common';
import { PersonResponse } from './people';
import { ReadResponseBase, ReadStatsResponse } from './read';

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
    data_type: ContentTypeEnum.MANGA;
    start_date: number | null;
    end_date: number | null;
    title_original: string | null;
    media_type: MangaMediaEnum | null;
    title?: string;
    title_ua: string | null;
    title_en: string | null;
    chapters: number | null;
    volumes: number | null;
    translated_ua: boolean;
    status: ContentStatusEnum | null;
    image: string | null;
    year: number | null;
    scored_by: number;
    score: number;
    slug: string;
    read: ReadResponseBase[];
    comments_count: number;
}

/**
 * Paginated manga response
 */
export interface MangaPaginationResponse
    extends PaginatedResponse<MangaResponse> {}

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
 * Detailed manga info response
 */
export interface MangaInfoResponse extends MangaResponse {
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
    chapters: number | null;
    volumes: number | null;
    updated: number;
    synonyms: string[];
    comments_count: number;
    has_franchise: boolean;
    translated_ua: boolean;
    scored_by: number;
    mal_id: number;
}
