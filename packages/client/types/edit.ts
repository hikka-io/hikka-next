import { ContentTypeEnum, PaginationResponse } from './common';
import {
    AnimeResponse,
    CharacterResponse,
    MangaResponse,
    NovelResponse,
    PersonResponse,
} from './content';
import { UserResponse } from './user';

/**
 * Edit content type
 */
export type EditContentType =
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL
    | ContentTypeEnum.CHARACTER
    | ContentTypeEnum.PERSON;

/**
 * Edit content
 */
export type EditContent =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | CharacterResponse
    | PersonResponse;

/**
 * Edit status enum
 */
export enum EditStatusEnum {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DENIED = 'denied',
    CLOSED = 'closed',
}

/**
 * Edit response
 */
export interface EditResponse<
    TEditParams = Record<string, any>,
    TContent = any,
> {
    content_type: EditContentType;
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
export interface EditPaginationResponse<T = any> {
    list: EditResponse<T>[];
    pagination: PaginationResponse;
}

/**
 * Todo edit response
 */
export interface TodoEditResponse<T = any> {
    list: T[];
    pagination: PaginationResponse;
}

/**
 * Add edit arguments
 */
export interface AddEditArgs<T = any> {
    description?: string;
    content_type: EditContentType;
    after: T;
    slug: string;
    auto?: boolean;
}

/**
 * Todo edit arguments
 */
export interface TodoEditArgs {
    todo_type: 'synopsis_ua' | 'title_ua';
    content_type: EditContentType;
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
    sort?: string[];
    status?: EditStatusEnum;
    content_type?: EditContentType;
    slug?: string;
    author?: string | null;
    moderator?: string | null;
}
