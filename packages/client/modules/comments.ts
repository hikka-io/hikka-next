import {
    CommentArgs,
    CommentListResponse,
    CommentResponse,
    CommentTextArgs,
    CommentsContentTypeEnum,
    PaginationArgs,
    SuccessResponse,
} from '../types';
import { BaseModule } from './base';

export class CommentsModule extends BaseModule {
    /**
     * Get latest comments
     */
    public async getLatest(): Promise<CommentResponse[]> {
        return this.client.get<CommentResponse[]>('/comments/latest');
    }

    /**
     * Get comments list for user
     */
    public async getList(
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CommentListResponse> {
        return this.client.get<CommentListResponse>('/comments/list', {
            page,
            size,
        });
    }

    /**
     * Write a comment
     */
    public async write(
        contentType: CommentsContentTypeEnum,
        slug: string,
        args: CommentArgs,
    ): Promise<CommentResponse> {
        return this.client.put<CommentResponse>(
            `/comments/${contentType}/${slug}`,
            args,
        );
    }

    /**
     * Get content's comments
     */
    public async getContentComments(
        contentType: CommentsContentTypeEnum,
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
     * Edit a comment
     */
    public async edit(
        commentReference: string,
        args: CommentTextArgs,
    ): Promise<CommentResponse> {
        return this.client.put<CommentResponse>(
            `/comments/${commentReference}`,
            args,
        );
    }

    /**
     * Hide/delete a comment
     */
    public async hide(commentReference: string): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/comments/${commentReference}`,
        );
    }

    /**
     * Get comment thread
     */
    public async getThread(commentReference: string): Promise<CommentResponse> {
        return this.client.get<CommentResponse>(
            `/comments/thread/${commentReference}`,
        );
    }
}
