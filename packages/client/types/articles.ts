import { FollowUserResponse } from './collections';
import { PaginationResponse } from './common';

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
export enum ArticleContentEnum {
    ANIME = 'anime',
    MANGA = 'manga',
    NOVEL = 'novel',
}

/**
 * Article content arguments
 */
export interface ArticleContentArgs {
    content_type: ArticleContentEnum;
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
    data_type: string;
    image: string | null;
    title_en: string | null;
    title_ua: string | null;
    slug: string;
    title_ja: string | null;
}

/**
 * Manga/Novel content in an article
 */
export interface ArticleMangaNovelContentResponse {
    data_type: string;
    image: string | null;
    title_en: string | null;
    title_ua: string | null;
    slug: string;
    title_original: string | null;
}

/**
 * Article response
 */
export interface ArticleResponse {
    data_type: string;
    author: FollowUserResponse;
    tags: TagResponse[];
    created: number;
    updated: number;
    document: any[]; // Array of document objects
    comments_count: number;
    vote_score: number;
    my_score: number;
    category: string;
    trusted: boolean;
    draft: boolean;
    views: number;
    title: string;
    slug: string;
    content:
        | ArticleAnimeContentResponse
        | ArticleMangaNovelContentResponse
        | null;
}

/**
 * Arguments for listing articles
 */
export interface ArticlesListArgs {
    content_type?: ArticleContentEnum | null;
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
export interface ArticlesListResponse {
    pagination: PaginationResponse;
    list: ArticleResponse[];
}

/**
 * User article stats response
 */
export interface UserArticleStatsResponse {
    user: FollowUserResponse;
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
