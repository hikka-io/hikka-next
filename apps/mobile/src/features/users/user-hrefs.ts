import type { Href } from 'expo-router';

import type { FavouriteContentTypeEnum } from '@hikka/api';

import type { FollowListKind, HistorySource, ListContentType } from './queries';

export const userListHref = (
    username: string,
    contentType: ListContentType,
    status?: string,
): Href => ({
    pathname: '/u/[username]/list/[content_type]',
    params: status
        ? { username, content_type: contentType, status }
        : { username, content_type: contentType },
});

export const userHistoryHref = (
    username: string,
    type?: HistorySource,
): Href => ({
    pathname: '/u/[username]/history',
    params: type ? { username, type } : { username },
});

export const userFavouritesHref = (
    username: string,
    type?: FavouriteContentTypeEnum,
): Href => ({
    pathname: '/u/[username]/favorites',
    params: type ? { username, type } : { username },
});

export const followListHref = (username: string, kind: FollowListKind): Href =>
    kind === 'followers'
        ? { pathname: '/u/[username]/followers', params: { username } }
        : { pathname: '/u/[username]/following', params: { username } };
