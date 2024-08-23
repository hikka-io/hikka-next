import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded';
import MaterialSymbolsWarningOutlineRounded from '~icons/material-symbols/warning-outline-rounded';

const COMMON_LEVEL: Hikka.ScopeLevel = {
    icon: MaterialSymbolsCheckRounded,
    color: 'text-success',
};

const IMPORTANT_LEVEL: Hikka.ScopeLevel = {
    icon: MaterialSymbolsWarningOutlineRounded,
    color: 'text-warning',
};

const SCOPE_READ_USER_DETAILS: Hikka.Scope = {
    title_ua: 'Читати дані користувача',
    slug: 'read:user-details',
    level: COMMON_LEVEL,
};
const SCOPE_UPDATE_USER_EMAIL: Hikka.Scope = {
    title_ua: 'Оновлювати пошту користувача',
    slug: 'update:user-details:email',
    level: IMPORTANT_LEVEL,
};
const SCOPE_DELETE_USER_IMAGE: Hikka.Scope = {
    title_ua: 'Видаляти аватар користувача',
    slug: 'delete:user-details:image',
    level: IMPORTANT_LEVEL,
};
const SCOPE_DELETE_USER_POSTER: Hikka.Scope = {
    title_ua: 'Видаляти постер користувача',
    slug: 'delete:user-details:poster',
    level: IMPORTANT_LEVEL,
};
const SCOPE_UPDATE_USER_USERNAME: Hikka.Scope = {
    title_ua: "Оновлювати ім'я користувача",
    slug: 'update:user-details:username',
    level: IMPORTANT_LEVEL,
};
const SCOPE_UPDATE_USER_PASSWORD: Hikka.Scope = {
    title_ua: 'Оновлювати пароль користувача',
    slug: 'update:user-details:password',
    level: IMPORTANT_LEVEL,
};
const SCOPE_UPDATE_USER_DESCRIPTION: Hikka.Scope = {
    title_ua: 'Оновлювати опис користувача',
    slug: 'update:user-details:description',
    level: IMPORTANT_LEVEL,
};

const SCOPE_READ_WATCHLIST: Hikka.Scope = {
    title_ua: 'Читати список перегляду',
    slug: 'read:watchlist',
    level: COMMON_LEVEL,
};
const SCOPE_UPDATE_WATCHLIST: Hikka.Scope = {
    title_ua: 'Оновлювати список перегляду',
    slug: 'update:watchlist',
    level: COMMON_LEVEL,
};

const SCOPE_READ_READLIST: Hikka.Scope = {
    title_ua: 'Читати список читання',
    slug: 'read:readlist',
    level: COMMON_LEVEL,
};
const SCOPE_UPDATE_READLIST: Hikka.Scope = {
    title_ua: 'Оновлювати список читання',
    slug: 'update:readlist',
    level: COMMON_LEVEL,
};

const SCOPE_READ_CLIENT_LIST: Hikka.Scope = {
    title_ua: 'Читати список клієнтів',
    slug: 'read:client:list',
    level: COMMON_LEVEL,
};
const SCOPE_CREATE_CLIENT: Hikka.Scope = {
    title_ua: 'Створювати клієнти',
    slug: 'create:client',
    level: COMMON_LEVEL,
};
const SCOPE_DELETE_CLIENT: Hikka.Scope = {
    title_ua: 'Видаляти клієнти',
    slug: 'delete:client',
    level: IMPORTANT_LEVEL,
};
const SCOPE_UPDATE_CLIENT: Hikka.Scope = {
    title_ua: 'Оновлювати клієнти',
    slug: 'update:client',
    level: IMPORTANT_LEVEL,
};
const SCOPE_VERIFY_CLIENT: Hikka.Scope = {
    title_ua: 'Верифікувати клієнти',
    slug: 'verify:client',
    level: IMPORTANT_LEVEL,
};
const SCOPE_READ_CLIENT: Hikka.Scope = {
    title_ua: 'Читати клієнти',
    slug: 'read:client',
    level: COMMON_LEVEL,
};

const SCOPE_READ_COLLECTIONS: Hikka.Scope = {
    title_ua: 'Читати колекції',
    slug: 'read:collection',
    level: COMMON_LEVEL,
};
const SCOPE_CREATE_COLLECTION: Hikka.Scope = {
    title_ua: 'Створювати колекції',
    slug: 'create:collection',
    level: COMMON_LEVEL,
};
const SCOPE_UPDATE_COLLECTION: Hikka.Scope = {
    title_ua: 'Оновлювати колекції',
    slug: 'update:collection',
    level: COMMON_LEVEL,
};
const SCOPE_DELETE_COLLECTION: Hikka.Scope = {
    title_ua: 'Видаляти колекції',
    slug: 'delete:collection',
    level: COMMON_LEVEL,
};

const SCOPE_READ_COMMENT_SCORE: Hikka.Scope = {
    title_ua: 'Читати оцінку коментарів',
    slug: 'read:comment:score',
    level: COMMON_LEVEL,
};
const SCOPE_CREATE_COMMENT: Hikka.Scope = {
    title_ua: 'Створювати коментарі',
    slug: 'create:comment',
    level: COMMON_LEVEL,
};
const SCOPE_UPDATE_COMMENT: Hikka.Scope = {
    title_ua: 'Оновлювати коментарі',
    slug: 'update:comment',
    level: COMMON_LEVEL,
};
const SCOPE_DELETE_COMMENT: Hikka.Scope = {
    title_ua: 'Видаляти коментарі',
    slug: 'delete:comment',
    level: COMMON_LEVEL,
};

const SCOPE_CREATE_EDIT: Hikka.Scope = {
    title_ua: 'Створювати правку',
    slug: 'create:edit',
    level: COMMON_LEVEL,
};
const SCOPE_UPDATE_EDIT: Hikka.Scope = {
    title_ua: 'Оновлювати правку',
    slug: 'update:edit',
    level: COMMON_LEVEL,
};
const SCOPE_CLOSE_EDIT: Hikka.Scope = {
    title_ua: 'Закривати правку',
    slug: 'close:edit',
    level: COMMON_LEVEL,
};
const SCOPE_ACCEPT_EDIT: Hikka.Scope = {
    title_ua: 'Приймати правку',
    slug: 'accept:edit',
    level: COMMON_LEVEL,
};
const SCOPE_DENY_EDIT: Hikka.Scope = {
    title_ua: 'Відхиляти правку',
    slug: 'deny:edit',
    level: COMMON_LEVEL,
};

const SCOPE_READ_FAVOURITE: Hikka.Scope = {
    title_ua: 'Читати улюблені',
    slug: 'read:favourite',
    level: COMMON_LEVEL,
};
const SCOPE_CREATE_FAVOURITE: Hikka.Scope = {
    title_ua: 'Створювати улюблені',
    slug: 'create:favourite',
    level: COMMON_LEVEL,
};
const SCOPE_DELETE_FAVOURITE: Hikka.Scope = {
    title_ua: 'Видаляти улюблені',
    slug: 'delete:favourite',
    level: COMMON_LEVEL,
};
const SCOPE_READ_FAVOURITE_LIST: Hikka.Scope = {
    title_ua: 'Читати список улюблених',
    slug: 'read:favourite:list',
    level: COMMON_LEVEL,
};

const SCOPE_READ_FOLLOW: Hikka.Scope = {
    title_ua: 'Читати підписки',
    slug: 'read:follow',
    level: COMMON_LEVEL,
};
const SCOPE_FOLLOW: Hikka.Scope = {
    title_ua: 'Підписуватися',
    slug: 'follow',
    level: COMMON_LEVEL,
};
const SCOPE_UNFOLLOW: Hikka.Scope = {
    title_ua: 'Відписуватися',
    slug: 'unfollow',
    level: COMMON_LEVEL,
};

const SCOPE_READ_HISTORY: Hikka.Scope = {
    title_ua: 'Читати історію користувача',
    slug: 'read:history',
    level: COMMON_LEVEL,
};

const SCOPE_READ_NOTIFICATION: Hikka.Scope = {
    title_ua: 'Читати сповіщення',
    slug: 'read:notification',
    level: COMMON_LEVEL,
};
const SCOPE_SEEN_NOTIFICATION: Hikka.Scope = {
    title_ua: 'Відмічати прочитані сповіщення',
    slug: 'seen:notification',
    level: COMMON_LEVEL,
};

const SCOPE_READ_VOTE: Hikka.Scope = {
    title_ua: 'Читати оцінки',
    slug: 'read:vote',
    level: COMMON_LEVEL,
};
const SCOPE_SET_VOTE: Hikka.Scope = {
    title_ua: 'Оцінювати контент',
    slug: 'set:vote',
    level: COMMON_LEVEL,
};

const SCOPE_UPLOAD: Hikka.Scope = {
    title_ua: 'Завантажувати файли',
    slug: 'upload',
    level: COMMON_LEVEL,
};

export const SCOPES = [
    SCOPE_READ_USER_DETAILS,
    SCOPE_UPDATE_USER_EMAIL,
    SCOPE_DELETE_USER_IMAGE,
    SCOPE_DELETE_USER_POSTER,
    SCOPE_UPDATE_USER_PASSWORD,
    SCOPE_UPDATE_USER_USERNAME,
    SCOPE_UPDATE_USER_DESCRIPTION,
    SCOPE_READ_WATCHLIST,
    SCOPE_UPDATE_WATCHLIST,
    SCOPE_READ_READLIST,
    SCOPE_UPDATE_READLIST,
    SCOPE_READ_CLIENT_LIST,
    SCOPE_CREATE_CLIENT,
    SCOPE_READ_CLIENT,
    SCOPE_UPDATE_CLIENT,
    SCOPE_VERIFY_CLIENT,
    SCOPE_DELETE_CLIENT,
    SCOPE_READ_COLLECTIONS,
    SCOPE_CREATE_COLLECTION,
    SCOPE_UPDATE_COLLECTION,
    SCOPE_DELETE_COLLECTION,
    SCOPE_READ_COMMENT_SCORE,
    SCOPE_CREATE_COMMENT,
    SCOPE_DELETE_COMMENT,
    SCOPE_UPDATE_COMMENT,
    SCOPE_CREATE_EDIT,
    SCOPE_UPDATE_EDIT,
    SCOPE_CLOSE_EDIT,
    SCOPE_ACCEPT_EDIT,
    SCOPE_DENY_EDIT,
    SCOPE_READ_FAVOURITE,
    SCOPE_CREATE_FAVOURITE,
    SCOPE_DELETE_FAVOURITE,
    SCOPE_READ_FAVOURITE_LIST,
    SCOPE_READ_FOLLOW,
    SCOPE_FOLLOW,
    SCOPE_UNFOLLOW,
    SCOPE_READ_HISTORY,
    SCOPE_READ_NOTIFICATION,
    SCOPE_SEEN_NOTIFICATION,
    SCOPE_SET_VOTE,
    SCOPE_READ_VOTE,
    SCOPE_UPLOAD,
];

const SCOPE_GROUP_UPDATE_USER_DETAILS: Hikka.ScopeGroup = {
    slug: 'update:user-details',
    title_ua: 'Оновлення даних користувача',
    level: IMPORTANT_LEVEL,
    scopes: [
        SCOPE_UPDATE_USER_EMAIL,
        SCOPE_DELETE_USER_IMAGE,
        SCOPE_DELETE_USER_POSTER,
        SCOPE_UPDATE_USER_PASSWORD,
        SCOPE_UPDATE_USER_USERNAME,
        SCOPE_UPDATE_USER_DESCRIPTION,
    ],
};
const SCOPE_GROUP_USER_DETAILS: Hikka.ScopeGroup = {
    slug: 'user-details',
    title_ua: 'Дані користувача',
    level: COMMON_LEVEL,
    scopes: [
        SCOPE_READ_USER_DETAILS,
        SCOPE_UPDATE_USER_EMAIL,
        SCOPE_DELETE_USER_IMAGE,
        SCOPE_DELETE_USER_POSTER,
        SCOPE_UPDATE_USER_PASSWORD,
        SCOPE_UPDATE_USER_USERNAME,
        SCOPE_UPDATE_USER_DESCRIPTION,
    ],
};
const SCOPE_GROUP_WATCHLIST: Hikka.ScopeGroup = {
    slug: 'watchlist',
    title_ua: 'Список перегляду',
    level: COMMON_LEVEL,
    scopes: [SCOPE_READ_WATCHLIST, SCOPE_UPDATE_WATCHLIST],
};
const SCOPE_GROUP_READLIST: Hikka.ScopeGroup = {
    slug: 'readlist',
    title_ua: 'Список читання',
    level: COMMON_LEVEL,
    scopes: [SCOPE_READ_READLIST, SCOPE_UPDATE_READLIST],
};
const SCOPE_GROUP_CLIENT: Hikka.ScopeGroup = {
    slug: 'client',
    title_ua: 'Клієнти',
    level: COMMON_LEVEL,
    scopes: [
        SCOPE_READ_CLIENT_LIST,
        SCOPE_CREATE_CLIENT,
        SCOPE_READ_CLIENT,
        SCOPE_UPDATE_CLIENT,
        SCOPE_VERIFY_CLIENT,
        SCOPE_DELETE_CLIENT,
    ],
};
const SCOPE_GROUP_COLLECTION: Hikka.ScopeGroup = {
    slug: 'collection',
    title_ua: 'Колекції',
    level: COMMON_LEVEL,
    scopes: [
        SCOPE_READ_COLLECTIONS,
        SCOPE_CREATE_COLLECTION,
        SCOPE_UPDATE_COLLECTION,
        SCOPE_DELETE_COLLECTION,
    ],
};
const SCOPE_GROUP_COMMENT: Hikka.ScopeGroup = {
    slug: 'comment',
    title_ua: 'Коментарі',
    level: COMMON_LEVEL,
    scopes: [
        SCOPE_READ_COMMENT_SCORE,
        SCOPE_CREATE_COMMENT,
        SCOPE_DELETE_COMMENT,
        SCOPE_UPDATE_COMMENT,
    ],
};
const SCOPE_GROUP_EDIT: Hikka.ScopeGroup = {
    slug: 'edit',
    title_ua: 'Правки',
    level: COMMON_LEVEL,
    scopes: [
        SCOPE_CREATE_EDIT,
        SCOPE_UPDATE_EDIT,
        SCOPE_CLOSE_EDIT,
        SCOPE_ACCEPT_EDIT,
        SCOPE_DENY_EDIT,
    ],
};
const SCOPE_GROUP_FAVOURITE: Hikka.ScopeGroup = {
    slug: 'favourite',
    title_ua: 'Улюблені',
    level: COMMON_LEVEL,
    scopes: [
        SCOPE_READ_FAVOURITE,
        SCOPE_CREATE_FAVOURITE,
        SCOPE_DELETE_FAVOURITE,
        SCOPE_READ_FAVOURITE_LIST,
    ],
};
const SCOPE_GROUP_FOLLOW_FULL: Hikka.ScopeGroup = {
    slug: 'follow-full',
    title_ua: 'Підписки',
    level: COMMON_LEVEL,
    scopes: [SCOPE_READ_FOLLOW, SCOPE_FOLLOW, SCOPE_UNFOLLOW],
};
const SCOPE_GROUP_NOTIFICATION: Hikka.ScopeGroup = {
    slug: 'notification',
    title_ua: 'Сповіщення',
    level: COMMON_LEVEL,
    scopes: [SCOPE_READ_NOTIFICATION, SCOPE_SEEN_NOTIFICATION],
};
const SCOPE_GROUP_VOTE: Hikka.ScopeGroup = {
    slug: 'vote',
    title_ua: 'Оцінки',
    level: COMMON_LEVEL,
    scopes: [SCOPE_READ_VOTE, SCOPE_SET_VOTE],
};
const SCOPE_GROUP_ALL: Hikka.ScopeGroup = {
    slug: 'all',
    title_ua: 'Всі права',
    level: IMPORTANT_LEVEL,
    scopes: SCOPES,
};

export const SCOPE_GROUPS = [
    SCOPE_GROUP_UPDATE_USER_DETAILS,
    SCOPE_GROUP_USER_DETAILS,
    SCOPE_GROUP_WATCHLIST,
    SCOPE_GROUP_READLIST,
    SCOPE_GROUP_CLIENT,
    SCOPE_GROUP_COLLECTION,
    SCOPE_GROUP_COMMENT,
    SCOPE_GROUP_EDIT,
    SCOPE_GROUP_FAVOURITE,
    SCOPE_GROUP_FOLLOW_FULL,
    SCOPE_GROUP_NOTIFICATION,
    SCOPE_GROUP_VOTE,
    SCOPE_GROUP_ALL,
];
