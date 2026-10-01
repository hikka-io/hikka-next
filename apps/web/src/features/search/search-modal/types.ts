import type {
    AnimeResponse,
    CharacterResponse,
    CollectionResponse,
    ContentTypeEnum,
    MangaResponse,
    NovelResponse,
    PersonResponse,
    UserResponse,
} from '@hikka/api';

export const SEARCH_TYPE_ALL = 'all' as const;

/**
 * The content types the modal can actually search. `ContentTypeEnum` also
 * carries article/comment/edit/history, which no result list handles — keeping
 * them out means the toggle, the registry and the callers all agree.
 */
export type SearchEntityType = Exclude<
    ContentTypeEnum,
    'article' | 'comment' | 'edit' | 'history'
>;

export type SearchTypeValue = SearchEntityType | typeof SEARCH_TYPE_ALL;

/**
 * The types the `Усе` tab searches. Users are left out because `/user/list` is
 * unpaginated and has its own list component — everything here is expected to
 * have infinite options *and* a hook in `all-search-list`.
 */
export type ContentSearchEntityType = Exclude<SearchEntityType, 'user'>;

/** How a result row behaves: a navigating link, or a picker button. */
export type SearchResultVariant = 'link' | 'button';

/** Union of the poster-card content types (keeps card props well-typed). */
export type SearchContent =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | CharacterResponse
    | PersonResponse;

/** Anything a result row can hand back through `onClick` / `onDismiss`. */
export type SearchResult = SearchContent | CollectionResponse | UserResponse;
