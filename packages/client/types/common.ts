import { AnimeInfoResponse, AnimeResponse } from './anime';
import { ArticleResponse } from './articles';
import { CharacterResponse } from './characters';
import { CollectionContent, CollectionResponse } from './collections';
import { MangaInfoResponse, MangaResponse } from './manga';
import { NovelInfoResponse, NovelResponse } from './novel';
import { PersonResponse } from './people';

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
 * External link type enum
 */
export enum ExternalTypeEnum {
    GENERAL = 'general',
    WATCH = 'watch',
    READ = 'read',
}

/**
 * External link response
 */
export interface ExternalResponse {
    url: string;
    text: string;
    type: ExternalTypeEnum;
}

/**
 * Genre type enum
 */
export enum GenreTypeEnum {
    THEME = 'theme',
    EXPLICIT = 'explicit',
    GENRE = 'genre',
    DEMOGRAPHIC = 'demographic',
}

/**
 * Genre response
 */
export interface GenreResponse {
    name_ua: string | null;
    name_en: string | null;
    slug: string;
    type: GenreTypeEnum;
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

/**
 * Pagination args
 */
export interface PaginationArgs {
    page?: number;
    size?: number;
}

/**
 * Captcha args
 */
export interface CaptchaArgs {
    captcha: string;
}

/**
 * Content type enum
 */
export enum ContentTypeEnum {
    CHARACTER = 'character',
    PERSON = 'person',
    ANIME = 'anime',
    MANGA = 'manga',
    NOVEL = 'novel',
    ARTICLE = 'article',
    COLLECTION = 'collection',
    EDIT = 'edit',
    COMMENT = 'comment',
    USER = 'user',
}

/**
 * Content type
 */
export type Content =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | AnimeInfoResponse
    | MangaInfoResponse
    | NovelInfoResponse
    | CharacterResponse
    | PersonResponse
    | CollectionResponse<CollectionContent>
    | ArticleResponse;

/**
 * Main content type
 */
export type MainContent = Exclude<
    Content,
    CollectionResponse<CollectionContent> | ArticleResponse
>;

/**
 * Sitemap response
 */
export interface SitemapResponse {
    updated_at: number;
    slug: string;
}
