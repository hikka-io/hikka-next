import { ContentTypeEnum, PaginatedResponse } from './common';
import { UserResponse } from './user';

/**
 * Tag response
 */
export interface TagResponse {
    content_count: number;
    name: string;
}

/**
 * Article category enum
 */
export enum ArticleCategoryEnum {
    ORIGINAL = 'original',
    REVIEWS = 'reviews',
    SYSTEM = 'system',
    NEWS = 'news',
}

/**
 * Article content type enum
 */
export type ArticleContentType =
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;

/**
 * Article content arguments
 */
export interface ArticleContentArgs {
    content_type: ArticleContentType;
    slug: string;
}

/**
 * Article arguments for creating/updating articles
 */
export interface ArticleArgs {
    title: string;
    document: any[]; // Array of document objects
    content?: ArticleContentArgs | null;
    tags: string[];
    draft?: boolean;
    category: ArticleCategoryEnum;
    trusted?: boolean;
}

/**
 * Anime content in an article
 */
export interface ArticleAnimeContentResponse {
    data_type: ContentTypeEnum.ANIME;
    image: string | null;
    title?: string;
    title_en: string | null;
    title_ua: string | null;
    slug: string;
    title_ja: string | null;
}

/**
 * Manga/Novel content in an article
 */
export interface ArticleMangaNovelContentResponse {
    data_type: ContentTypeEnum.MANGA | ContentTypeEnum.NOVEL;
    image: string | null;
    title?: string;
    title_en: string | null;
    title_ua: string | null;
    slug: string;
    title_original: string | null;
}

/**
 * Article response
 */
export interface ArticleResponse {
    data_type: ContentTypeEnum.ARTICLE;
    author: UserResponse;
    tags: TagResponse[];
    created: number;
    updated: number;
    document: any[]; // Array of document objects
    preview: any[];
    comments_count: number;
    vote_score: number;
    my_score: number;
    category: ArticleCategoryEnum;
    trusted: boolean;
    draft: boolean;
    views: number;
    title: string;
    slug: string;
    content: ArticleContent;
}

/**
 * Arguments for listing articles
 */
export interface ArticlesListArgs {
    content_type?: ArticleContentType | null;
    min_vote_score?: number | null;
    categories?: ArticleCategoryEnum[];
    tags?: string[];
    sort?: string[];
    content_slug?: string | null;
    show_trusted?: boolean;
    author?: string | null;
    draft?: boolean;
}

/**
 * Paginated articles response
 */
export interface ArticlesListResponse
    extends PaginatedResponse<ArticleResponse> { }

/**
 * User article stats response
 */
export interface UserArticleStatsResponse {
    user: UserResponse;
    total_articles: number;
    total_comments: number;
    author_score: number;
    total_likes: number;
}

/**
 * Articles top response
 */
export interface ArticlesTopResponse {
    authors: UserArticleStatsResponse[];
    tags: TagResponse[];
}

/**
 * Article content
 */
export type ArticleContent =
    | ArticleAnimeContentResponse
    | ArticleMangaNovelContentResponse
    | null;
