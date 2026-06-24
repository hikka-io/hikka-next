import type { PaginationResponse } from './common';
import type { UserResponse } from './user';

/**
 * Edits top response
 */
export interface EditsTopResponse {
    user: UserResponse;
    accepted: number;
    closed: number;
    denied: number;
}

/**
 * Paginated edits top response
 */
export interface EditsTopPaginationResponse {
    pagination: PaginationResponse;
    list: EditsTopResponse[];
}
