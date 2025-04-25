import {
    MangaResponse,
    NovelResponse,
    PaginationArgs,
    ReadArgs,
    ReadContentType,
    ReadPaginationResponse,
    ReadResponse,
    ReadSearchArgs,
    ReadStatsResponse,
    ReadStatusEnum,
    SuccessResponse,
    UserReadPaginationResponse,
} from '../types';
import { BaseModule } from './base';

export class ReadModule extends BaseModule {
    /**
     * Get read entry details for a manga or novel
     */
    public async getReadBySlug(
        contentType: ReadContentType,
        slug: string,
    ): Promise<ReadResponse> {
        return this.client.get<ReadResponse>(`/read/${contentType}/${slug}`);
    }

    /**
     * Create or update a read entry
     */
    public async createRead(
        contentType: ReadContentType,
        slug: string,
        args: ReadArgs,
    ): Promise<ReadResponse> {
        return this.client.put<ReadResponse>(
            `/read/${contentType}/${slug}`,
            args,
        );
    }

    /**
     * Delete a read entry
     */
    public async deleteRead(
        contentType: ReadContentType,
        slug: string,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/read/${contentType}/${slug}`,
        );
    }

    /**
     * Get users who are reading a specific manga/novel
     */
    public async getReadingUsers(
        contentType: ReadContentType,
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<UserReadPaginationResponse> {
        return this.client.get<UserReadPaginationResponse>(
            `/read/${contentType}/${slug}/following`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get read statistics for a user
     */
    public async getUserReadStats(
        contentType: ReadContentType,
        username: string,
    ): Promise<ReadStatsResponse> {
        return this.client.get<ReadStatsResponse>(
            `/read/${contentType}/${username}/stats`,
        );
    }

    /**
     * Get a random manga/novel from user's read list by status
     */
    public async getRandomReadByStatus(
        contentType: ReadContentType,
        username: string,
        status: ReadStatusEnum,
    ): Promise<MangaResponse | NovelResponse> {
        return this.client.get<MangaResponse | NovelResponse>(
            `/read/${contentType}/random/${username}/${status}`,
        );
    }

    /**
     * Search read list for a user with filtering criteria
     */
    public async searchUserReads(
        contentType: ReadContentType,
        username: string,
        args: ReadSearchArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<ReadPaginationResponse> {
        return this.client.post<ReadPaginationResponse>(
            `/read/${contentType}/${username}/list`,
            args,
            {
                page,
                size,
            },
        );
    }
}
