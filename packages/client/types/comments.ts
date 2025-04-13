import { PaginationResponse } from './common';
import { UserResponse } from './user';

/**
 * Comments content type enum
 */
export enum CommentsContentTypeEnum {
    COLLECTION = 'collection',
    EDIT = 'edit',
    ARTICLE = 'article',
    ANIME = 'anime',
    MANGA = 'manga',
    NOVEL = 'novel',
}

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
    content_type: string;
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
