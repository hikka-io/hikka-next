import type {
    ArticleAnimeContentResponse,
    ArticleMangaNovelContentResponse,
} from '@hikka/api';

/** The anime, manga or novel an article is about. */
export type ArticleContent =
    | ArticleAnimeContentResponse
    | ArticleMangaNovelContentResponse;
