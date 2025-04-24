import { AnimeResponse } from './anime';
import { CharacterResponse } from './characters';
import { ContentTypeEnum, PaginatedResponse } from './common';
import { MangaResponse } from './manga';
import { PersonResponse } from './people';
import { UserResponse } from './user';

/**
 * Collection content type
 */
export type CollectionContentType =
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL
    | ContentTypeEnum.CHARACTER
    | ContentTypeEnum.PERSON;

/**
 * Collection visibility enum
 */
export enum CollectionVisibilityEnum {
    UNLISTED = 'unlisted',
    PRIVATE = 'private',
    PUBLIC = 'public',
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
 * Collection content type
 */
export type CollectionContent =
    | AnimeResponse
    | MangaResponse
    | CharacterResponse
    | PersonResponse;

/**
 * Collection content response
 */
export interface CollectionContentResponse<TContent extends CollectionContent> {
    comment: string | null;
    label: string | null;
    content_type: CollectionContentType;
    order: number;
    content: TContent;
}

/**
 * Collection response
 */
export interface CollectionResponse<TContent extends CollectionContent> {
    data_type: ContentTypeEnum.COLLECTION;
    visibility: CollectionVisibilityEnum;
    author: UserResponse;
    labels_order: string[];
    created: number;
    updated: number;
    comments_count: number;
    content_type: CollectionContentType;
    description: string;
    vote_score: number;
    tags: string[];
    reference: string;
    my_score: number;
    spoiler: boolean;
    entries: number;
    title: string;
    nsfw: boolean;
    collection: CollectionContentResponse<TContent>[];
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
    content_type: CollectionContentType;
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
    content_type?: CollectionContentType;
    author?: string;
    only_public?: boolean;
}

/**
 * Paginated collections response
 */
export interface CollectionsListResponse<TContent extends CollectionContent>
    extends PaginatedResponse<CollectionResponse<TContent>> {}
