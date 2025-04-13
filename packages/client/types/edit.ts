import { PaginationResponse } from './common';
import { UserResponse } from './user';

/**
 * Edit status enum
 */
export enum EditStatusEnum {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

/**
 * Content type enum
 */
export enum ContentTypeEnum {
    ANIME = 'anime',
    MANGA = 'manga',
    NOVEL = 'novel',
    CHARACTER = 'character',
    PERSON = 'person',
}

/**
 * Edit response
 */
export interface EditResponse<
    TEditParams = Record<string, any>,
    TContent = any,
> {
    content_type: ContentTypeEnum;
    status: EditStatusEnum;
    description: string | null;
    created: number;
    updated: number;
    edit_id: number;
    moderator: UserResponse | null;
    author?: UserResponse;
    after: TEditParams;
    before: TEditParams | null;
    content: TContent;
}

/**
 * Edit list response
 */
export interface EditPaginationResponse<T = any> extends PaginationResponse {
    list: EditResponse<T>[];
}

/**
 * Add edit arguments
 */
export interface AddEditArgs<T = any> {
    description?: string;
    content_type: ContentTypeEnum;
    after: T;
    slug: string;
    auto?: boolean;
}

/**
 * Update edit arguments
 */
export interface UpdateEditArgs<T = any> {
    description?: string;
    after: T;
    auto?: boolean;
}

/**
 * Get edit list arguments
 */
export interface GetEditListArgs {
    page?: number;
    sort?: string[];
    status?: EditStatusEnum;
    content_type?: ContentTypeEnum;
    slug?: string;
    author?: string | null;
    moderator?: string | null;
}
