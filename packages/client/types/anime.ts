import { CharacterResponse } from './characters';
import {
    ExternalResponse,
    GenreResponse,
    PaginationResponse,
    RoleResponse,
    SeasonEnum,
    SourceEnum,
} from './common';
import { PersonResponse } from './people';

/**
 * Anime media types
 */
export enum AnimeMediaEnum {
    SPECIAL = 'special',
    MOVIE = 'movie',
    MUSIC = 'music',
    OVA = 'ova',
    ONA = 'ona',
    TV = 'tv',
}

/**
 * Anime age ratings
 */
export enum AnimeAgeRatingEnum {
    R_PLUS = 'r_plus',
    PG_13 = 'pg_13',
    PG = 'pg',
    RX = 'rx',
    G = 'g',
    R = 'r',
}

/**
 * Anime status enum
 */
export enum AnimeStatusEnum {
    ANNOUNCED = 'announced',
    FINISHED = 'finished',
    ONGOING = 'ongoing',
}

/**
 * Base anime response
 */
export interface AnimeResponse {
    data_type: string;
    media_type: string | null;
    title_ua: string | null;
    title_en: string | null;
    title_ja: string | null;
    episodes_released: number | null;
    episodes_total: number | null;
    image: string | null;
    status: string | null;
    scored_by: number;
    score: number;
    slug: string;
    start_date: number | null;
    end_date: number | null;
    translated_ua: boolean;
    season: string | null;
    source: string | null;
    rating: string | null;
    year: number | null;
}

/**
 * Watch status base response
 */
export interface WatchResponseBase {
    reference: string;
    note: string | null;
    updated: number;
    created: number;
    status: string;
    rewatches: number;
    duration: number;
    episodes: number;
    score: number;
}

/**
 * Anime response with watch status
 */
export interface AnimeResponseWithWatch extends AnimeResponse {
    watch: WatchResponseBase[];
}

/**
 * Paginated anime response
 */
export interface AnimePaginationResponse {
    list: AnimeResponseWithWatch[];
    pagination: PaginationResponse;
}

/**
 * Anime search parameters
 */
export interface AnimeSearchArgs {
    years?: [number | null, number | null];
    include_multiseason?: boolean;
    only_translated?: boolean;
    score?: [number | null, number | null];
    media_type?: AnimeMediaEnum[];
    rating?: AnimeAgeRatingEnum[];
    status?: AnimeStatusEnum[];
    source?: SourceEnum[];
    season?: SeasonEnum[];
    producers?: string[];
    studios?: string[];
    genres?: string[];
    query?: string;
    sort?: string[];
}

/**
 * Character in content response
 */
export interface ContentCharacterResponse {
    main: boolean;
    character: CharacterResponse;
}

/**
 * Paginated content characters response
 */
export interface ContentCharacterPaginationResponse {
    pagination: PaginationResponse;
    list: ContentCharacterResponse[];
}

/**
 * Anime staff member response
 */
export interface AnimeStaffResponse {
    roles: RoleResponse[];
    person: PersonResponse;
    weight: number | null;
}

/**
 * Paginated anime staff response
 */
export interface AnimeStaffPaginationResponse {
    pagination: PaginationResponse;
    list: AnimeStaffResponse[];
}

/**
 * Anime episode response
 */
export interface AnimeEpisodeResponse {
    aired: number | null;
    title_ua: string | null;
    title_en: string | null;
    title_ja: string | null;
    index: number;
}

/**
 * Paginated anime episodes response
 */
export interface AnimeEpisodesListResponse {
    pagination: PaginationResponse;
    list: AnimeEpisodeResponse[];
}

/**
 * Company response
 */
export interface CompanyResponse {
    image: string | null;
    slug: string;
    name: string;
}

/**
 * Company type enum
 */
export enum CompanyTypeEnum {
    PRODUCER = 'producer',
    STUDIO = 'studio',
}

/**
 * Anime company response
 */
export interface AnimeCompanyResponse {
    company: CompanyResponse;
    type: CompanyTypeEnum;
}

/**
 * Anime video response
 */
export interface AnimeVideoResponse {
    url: string;
    title: string | null;
    description: string | null;
    video_type: string;
}

/**
 * Anime OST response
 */
export interface AnimeOSTResponse {
    index: number;
    title: string | null;
    author: string | null;
    spotify: string | null;
    ost_type: string;
}

/**
 * Anime statistics response
 */
export interface AnimeStatsResponse {
    completed: number;
    watching: number;
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
 * Detailed anime info response
 */
export interface AnimeInfoResponse {
    data_type: string;
    companies: AnimeCompanyResponse[];
    genres: GenreResponse[];
    start_date: number | null;
    end_date: number | null;
    updated: number;
    comments_count: number;
    episodes_released: number | null;
    episodes_total: number | null;
    synopsis_en: string | null;
    synopsis_ua: string | null;
    media_type: string | null;
    title_ua: string | null;
    title_en: string | null;
    title_ja: string | null;
    duration: number | null;
    image: string | null;
    status: string | null;
    source: string | null;
    rating: string | null;
    has_franchise: boolean;
    scored_by: number;
    score: number;
    nsfw: boolean;
    slug: string;
    season: string | null;
    year: number | null;
    synonyms: string[];
    external: ExternalResponse[];
    videos: AnimeVideoResponse[];
    ost: AnimeOSTResponse[];
    stats: AnimeStatsResponse;
    schedule: any[];
    translated_ua: boolean;
    mal_id: number;
}
