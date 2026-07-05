// Collection options
export {
    COLLECTION_CONTENT_TYPE_OPTIONS,
    COLLECTION_VISIBILITY_OPTIONS,
} from './collection-options';
// Content configuration
export { CONTENT_CONFIG, CONTENT_TYPES } from './content-config';
// Errors
export { ERRORS } from './errors';
export {
    AGE_RATING,
    ANIME_MEDIA_TYPE,
    ARTICLE_CATEGORY_OPTIONS,
    DATE_RANGES,
    DateRangeEnum,
    GENRE_TYPES,
    MANGA_MEDIA_TYPE,
    MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
    OST,
    READ_STATUS,
    RELEASE_STATUS,
    SEASON,
    SOURCE,
    VIDEO,
    WATCH_STATUS,
} from './filter-properties';
// User roles
export { USER_ROLE } from './user-role';

export const COMMENT_DECLENSIONS: [string, string, string] = [
    'коментар',
    'коментарі',
    'коментарів',
];

export const MIN_SEARCH_LENGTH = 2;

export const MAX_COMMENT_DEPTH = 5;
