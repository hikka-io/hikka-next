import { CommentsContentType, PaginationArgs } from '@hikka/client';

export interface UseCommentThreadParams {
    commentReference: string;
}

export interface UseCommentListParams {
    paginationArgs?: PaginationArgs;
}

export interface UseContentCommentsParams {
    contentType: CommentsContentType;
    slug: string;
    paginationArgs?: PaginationArgs;
}

export interface UseLatestCommentsParams {
    paginationArgs?: PaginationArgs;
}
