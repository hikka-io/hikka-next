/**
 * Standard pagination response
 */
export interface PaginationResponse {
    total: number;
    pages: number;
    page: number;
}

/**
 * Standard success response
 */
export interface SuccessResponse {
    success: boolean;
}

/**
 * Content status enum
 */
export enum ContentStatusEnum {
    DISCONTINUED = 'discontinued',
    ANNOUNCED = 'announced',
    FINISHED = 'finished',
    ONGOING = 'ongoing',
    PAUSED = 'paused',
}

/**
 * Season enum
 */
export enum SeasonEnum {
    WINTER = 'winter',
    SPRING = 'spring',
    SUMMER = 'summer',
    FALL = 'fall',
}

/**
 * Source enum
 */
export enum SourceEnum {
    DIGITAL_MANGA = 'digital_manga',
    PICTURE_BOOK = 'picture_book',
    VISUAL_NOVEL = 'visual_novel',
    KOMA_MANGA = '4_koma_manga',
    LIGHT_NOVEL = 'light_novel',
    CARD_GAME = 'card_game',
    WEB_MANGA = 'web_manga',
    ORIGINAL = 'original',
    MANGA = 'manga',
    MUSIC = 'music',
    NOVEL = 'novel',
    OTHER = 'other',
    RADIO = 'radio',
    GAME = 'game',
    BOOK = 'book',
}

/**
 * External link response
 */
export interface ExternalResponse {
    url: string;
    text: string;
    type: string;
}

/**
 * Genre response
 */
export interface GenreResponse {
    name_ua: string | null;
    name_en: string | null;
    slug: string;
    type: string;
}

/**
 * Genre list response
 */
export interface GenreListResponse {
    list: GenreResponse[];
}

/**
 * Role response
 */
export interface RoleResponse {
    name_ua: string | null;
    name_en: string | null;
    weight: number | null;
    slug: string;
}
