// Filter properties
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

// Errors
export { ERRORS } from './errors';

// Content configuration
export { CONTENT_CONFIG, CONTENT_TYPES } from './content-config';

// Collection options
export {
    COLLECTION_CONTENT_TYPE_OPTIONS,
    COLLECTION_VISIBILITY_OPTIONS,
} from './collection-options';

// User roles
export { USER_ROLE } from './user-role';

export const COMMENT_DECLENSIONS: [string, string, string] = [
    'коментар',
    'коментарі',
    'коментарів',
];

export const EDIT_DECLENSIONS: [string, string, string] = [
    'правка',
    'правки',
    'правок',
];

export const COLLECTION_DECLENSIONS: [string, string, string] = [
    'колекція',
    'колекції',
    'колекцій',
];

export const ARTICLE_DECLENSIONS: [string, string, string] = [
    'стаття',
    'статті',
    'статтей',
];

export const MIN_SEARCH_LENGTH = 2;
