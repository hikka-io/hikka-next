import { AnimeResponseWithWatch } from './anime';
import { CharacterResponse } from './characters';
import { PaginationResponse } from './common';
import { MangaResponseWithRead } from './manga';
import { PersonResponse } from './people';

/**
 * Collection visibility enum
 */
export enum CollectionVisibilityEnum {
    UNLISTED = 'unlisted',
    PRIVATE = 'private',
    PUBLIC = 'public',
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
}

/**
 * Collection content request parameters
 */
export interface CollectionContentArgs {
    comment?: string;
    label?: string;
    order: number;
    slug: string;
}

/**
 * User response with follow status
 */
export interface FollowUserResponse {
    reference: string;
    updated: number | null;
    created: number;
    description: string | null;
    username: string | null;
    cover: string | null;
    active: boolean;
    avatar: string;
    role: string;
    is_followed: boolean;
}

/**
 * Collection content response
 */
export interface CollectionContentResponse {
    comment: string | null;
    label: string | null;
    content_type: string;
    order: number;
    content:
        | AnimeResponseWithWatch
        | MangaResponseWithRead
        | CharacterResponse
        | PersonResponse;
}

/**
 * Collection response
 */
export interface CollectionResponse {
    data_type: string;
    visibility: CollectionVisibilityEnum;
    author: FollowUserResponse;
    labels_order: string[];
    created: number;
    updated: number;
    comments_count: number;
    content_type: string;
    description: string;
    vote_score: number;
    tags: string[];
    reference: string;
    my_score: number;
    spoiler: boolean;
    entries: number;
    title: string;
    nsfw: boolean;
    collection: CollectionContentResponse[];
}

/**
 * Collection creation/update request
 */
export interface CollectionArgs {
    description: string;
    title: string;
    tags: string[];
    visibility: CollectionVisibilityEnum;
    content: CollectionContentArgs[];
    content_type: ContentTypeEnum;
    labels_order: string[];
    spoiler: boolean;
    nsfw: boolean;
}

/**
 * Collections list request parameters
 */
export interface CollectionsListArgs {
    sort?: string[];
    content?: string[];
    content_type?: ContentTypeEnum;
    author?: string;
    only_public?: boolean;
}

/**
 * Paginated collections response
 */
export interface CollectionsListResponse {
    pagination: PaginationResponse;
    list: CollectionResponse[];
}
