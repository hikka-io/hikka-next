import { CharacterResponse } from './characters';
import {
    ContentTypeEnum,
    ExternalResponse,
    GenreResponse,
    PaginatedResponse,
    RoleResponse,
    SeasonEnum,
    SourceEnum,
} from './common';
import { CompanyTypeEnum } from './companies';
import { PersonResponse } from './people';
import { WatchResponseBase } from './watch';

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
    data_type: ContentTypeEnum.ANIME;
    media_type: AnimeMediaEnum | null;
    title?: string;
    title_ua: string | null;
    title_en: string | null;
    title_ja: string | null;
    episodes_released: number | null;
    episodes_total: number | null;
    image: string | null;
    status: AnimeStatusEnum | null;
    scored_by: number;
    score: number;
    slug: string;
    start_date: number | null;
    end_date: number | null;
    translated_ua: boolean;
    season: string | null;
    source: SourceEnum | null;
    rating: AnimeAgeRatingEnum | null;
    year: number | null;
    watch: WatchResponseBase[];
    comments_count: number;
}

/**
 * Paginated anime response
 */
export interface AnimePaginationResponse
    extends PaginatedResponse<AnimeResponse> {}

/**
 * Anime search parameters
 */
export interface AnimeSearchArgs {
    years?: [
        number | [SeasonEnum, number] | null,
        number | [SeasonEnum, number] | null,
    ];
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
export interface ContentCharacterPaginationResponse
    extends PaginatedResponse<ContentCharacterResponse> {}

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
export interface AnimeStaffPaginationResponse
    extends PaginatedResponse<AnimeStaffResponse> {}

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
export interface AnimeEpisodesListResponse
    extends PaginatedResponse<AnimeEpisodeResponse> {}

/**
 * Anime company response
 */
export interface AnimeCompanyResponse {
    company: {
        image: string | null;
        slug: string;
        name: string;
    };
    type: CompanyTypeEnum;
}

/**
 * Anime video type enum
 */
export enum AnimeVideoTypeEnum {
    VIDEO_PROMO = 'video_promo',
    VIDEO_MUSIC = 'video_music',
}

/**
 * Anime video response
 */
export interface AnimeVideoResponse {
    url: string;
    title: string | null;
    description: string | null;
    video_type: AnimeVideoTypeEnum;
}

/**
 * Anime OST type enum
 */
export enum AnimeOSTTypeEnum {
    OPENING = 'opening',
    ENDING = 'ending',
}

/**
 * Anime OST response
 */
export interface AnimeOSTResponse {
    index: number;
    title: string | null;
    author: string | null;
    spotify: string | null;
    ost_type: AnimeOSTTypeEnum;
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
export interface AnimeInfoResponse extends AnimeResponse {
    companies: AnimeCompanyResponse[];
    duration: number | null;
    external: ExternalResponse[];
    genres: GenreResponse[];
    has_franchise: boolean;
    mal_id: number;
    nsfw: boolean;
    ost: AnimeOSTResponse[];
    schedule: any[];
    stats: AnimeStatsResponse;
    synopsis_en: string | null;
    synopsis_ua: string | null;
    synonyms: string[];
    updated: number;
    videos: AnimeVideoResponse[];
}
