import {
    ContentStatusEnum,
    ContentTypeEnum,
    ExternalResponse,
    GenreResponse,
    PaginatedResponse,
} from './common';
import { ContentAuthorResponse, MagazineResponse } from './manga';
import { ReadResponseBase, ReadStatsResponse } from './read';

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
    data_type: ContentTypeEnum.NOVEL;
    start_date: number | null;
    end_date: number | null;
    title_original: string | null;
    media_type: NovelMediaEnum | null;
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
 * Paginated novel response
 */
export interface NovelPaginationResponse
    extends PaginatedResponse<NovelResponse> {}

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
export interface NovelInfoResponse extends NovelResponse {
    authors: ContentAuthorResponse[];
    magazines: MagazineResponse[];
    external: ExternalResponse[];
    genres: GenreResponse[];
    stats: ReadStatsResponse;
    synopsis_en: string | null;
    synopsis_ua: string | null;
    updated: number;
    synonyms: string[];
    comments_count: number;
    has_franchise: boolean;
    mal_id: number;
    nsfw: boolean;
}
