import {
    ContentTypeEnum,
    PaginatedResponse,
    PaginationResponse,
} from './common';
import { UserResponse } from './user';

/**
 * Comments content type
 */
export type CommentsContentType =
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.COLLECTION
    | ContentTypeEnum.EDIT
    | ContentTypeEnum.ARTICLE
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;

/**
 * Comment response
 */
export interface CommentResponse {
    replies: CommentResponse[];
    total_replies: number;
    updated: number;
    created: number;
    author: UserResponse;
    parent: string | null;
    content_type: CommentsContentType;
    is_editable: boolean;
    text: string | null;
    vote_score: number;
    reference: string;
    my_score: number;
    preview: any;
    hidden: boolean;
    depth: number;
}

/**
 * Comment list response
 */
export interface CommentListResponse {
    pagination: PaginationResponse;
    list: CommentResponse[];
}

/**
 * Comment arguments
 */
export interface CommentArgs {
    text: string;
    parent?: string | null;
}

/**
 * Comment text arguments (for editing)
 */
export interface CommentTextArgs {
    text: string;
}

/**
 * Comments response interface
 */
export interface CommentsResponse extends PaginatedResponse<CommentResponse> {}
