import { AnimeResponse } from './anime';
import { PaginationResponse } from './common';
import { MangaResponse } from './manga';
import { NovelResponse } from './novel';
import { UserResponse } from './user';

/**
 * History response
 */
export interface HistoryResponse {
    content: AnimeResponse | MangaResponse | NovelResponse | null;
    created: number;
    updated: number;
    user: UserResponse;
    history_type: string;
    reference: string;
    data: Record<string, any>;
}

/**
 * Paginated history response
 */
export interface HistoryPaginationResponse {
    list: HistoryResponse[];
    pagination: PaginationResponse;
}
