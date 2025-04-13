import {
    MangaResponse,
    NovelResponse,
    ReadArgs,
    ReadContentTypeEnum,
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
     * Get read entry for a manga or novel
     */
    public async get(
        contentType: ReadContentTypeEnum,
        slug: string,
    ): Promise<ReadResponse> {
        return this.client.get<ReadResponse>(`/read/${contentType}/${slug}`);
    }

    /**
     * Add or update read entry
     */
    public async addOrUpdate(
        contentType: ReadContentTypeEnum,
        slug: string,
        args: ReadArgs,
    ): Promise<ReadResponse> {
        return this.client.put<ReadResponse>(
            `/read/${contentType}/${slug}`,
            args,
        );
    }

    /**
     * Delete read entry
     */
    public async delete(
        contentType: ReadContentTypeEnum,
        slug: string,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/read/${contentType}/${slug}`,
        );
    }

    /**
     * Get users reading a manga/novel
     */
    public async getFollowingUsers(
        contentType: ReadContentTypeEnum,
        slug: string,
        page: number = 1,
        size: number = 15,
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
     * Get user read stats
     */
    public async getStats(
        contentType: ReadContentTypeEnum,
        username: string,
    ): Promise<ReadStatsResponse> {
        return this.client.get<ReadStatsResponse>(
            `/read/${contentType}/${username}/stats`,
        );
    }

    /**
     * Get random read entry
     */
    public async getRandom(
        contentType: ReadContentTypeEnum,
        username: string,
        status: ReadStatusEnum,
    ): Promise<MangaResponse | NovelResponse> {
        return this.client.get<MangaResponse | NovelResponse>(
            `/read/${contentType}/random/${username}/${status}`,
        );
    }

    /**
     * Get user's read list
     */
    public async getList(
        contentType: ReadContentTypeEnum,
        username: string,
        args: ReadSearchArgs,
        page: number = 1,
        size: number = 15,
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
