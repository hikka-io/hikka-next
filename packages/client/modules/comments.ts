import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
    CommentArgs,
    CommentListResponse,
    CommentResponse,
    CommentTextArgs,
    CommentsContentType,
    PaginationArgs,
    SuccessResponse,
} from '../types';
import { BaseModule } from './base';

export class CommentsModule extends BaseModule {
    /**
     * Get latest comments
     */
    public async getLatestComments(
        options?: BaseRequestOptionsArgs,
    ): Promise<CommentResponse[]> {
        return this.client.get<CommentResponse[]>('/comments/latest', options);
    }

    /**
     * Get comments list for current user
     */
    public async getCommentList(
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CommentListResponse> {
        return this.client.get<CommentListResponse>('/comments/list', {
            ...DEFAULT_PAGINATION,
            page,
            size,
            ...options,
        });
    }

    /**
     * Create a new comment
     */
    public async createComment(
        contentType: CommentsContentType,
        slug: string,
        args: CommentArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CommentResponse> {
        return this.client.put<CommentResponse>(
            `/comments/${contentType}/${slug}`,
            args,
            options,
        );
    }

    /**
     * Get comments for a specific content
     */
    public async getContentComments(
        contentType: CommentsContentType,
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CommentListResponse> {
        return this.client.get<CommentListResponse>(
            `/comments/${contentType}/${slug}/list`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Update an existing comment
     */
    public async updateComment(
        commentReference: string,
        args: CommentTextArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CommentResponse> {
        return this.client.put<CommentResponse>(
            `/comments/${commentReference}`,
            args,
            options,
        );
    }

    /**
     * Delete a comment
     */
    public async deleteComment(
        commentReference: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/comments/${commentReference}`,
            options,
        );
    }

    /**
     * Get a comment thread
     */
    public async getCommentThread(
        commentReference: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<CommentResponse> {
        return this.client.get<CommentResponse>(
            `/comments/thread/${commentReference}`,
            options,
        );
    }
}
