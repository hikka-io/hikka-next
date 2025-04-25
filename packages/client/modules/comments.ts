import {
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
    public async getLatestComments(): Promise<CommentResponse[]> {
        return this.client.get<CommentResponse[]>('/comments/latest');
    }

    /**
     * Get comments list for current user
     */
    public async getCommentList(
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CommentListResponse> {
        return this.client.get<CommentListResponse>('/comments/list', {
            page,
            size,
        });
    }

    /**
     * Create a new comment
     */
    public async createComment(
        contentType: CommentsContentType,
        slug: string,
        args: CommentArgs,
    ): Promise<CommentResponse> {
        return this.client.put<CommentResponse>(
            `/comments/${contentType}/${slug}`,
            args,
        );
    }

    /**
     * Get comments for a specific content
     */
    public async getContentComments(
        contentType: CommentsContentType,
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CommentListResponse> {
        return this.client.get<CommentListResponse>(
            `/comments/${contentType}/${slug}/list`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Update an existing comment
     */
    public async updateComment(
        commentReference: string,
        args: CommentTextArgs,
    ): Promise<CommentResponse> {
        return this.client.put<CommentResponse>(
            `/comments/${commentReference}`,
            args,
        );
    }

    /**
     * Delete a comment
     */
    public async deleteComment(
        commentReference: string,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/comments/${commentReference}`,
        );
    }

    /**
     * Get a comment thread
     */
    public async getCommentThread(
        commentReference: string,
    ): Promise<CommentResponse> {
        return this.client.get<CommentResponse>(
            `/comments/thread/${commentReference}`,
        );
    }
}
