import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
    CollectionArgs,
    CollectionContent,
    CollectionResponse,
    CollectionsListArgs,
    CollectionsListResponse,
    PaginationArgs,
    SuccessResponse,
} from '../types';
import { BaseModule } from './base';

export class CollectionsModule extends BaseModule {
    /**
     * Search for collections with filtering criteria
     */
    public async searchCollections(
        args: CollectionsListArgs,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CollectionsListResponse<CollectionContent>> {
        return this.client.post<CollectionsListResponse<CollectionContent>>(
            '/collections',
            args,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Create a new collection
     */
    public async createCollection(
        args: CollectionArgs,
    ): Promise<CollectionResponse<CollectionContent>> {
        return this.client.post<CollectionResponse<CollectionContent>>(
            '/collections/create',
            args,
        );
    }

    /**
     * Get collection details by reference
     */
    public async getCollectionByReference(
        reference: string,
    ): Promise<CollectionResponse<CollectionContent>> {
        return this.client.get<CollectionResponse<CollectionContent>>(
            `/collections/${reference}`,
        );
    }

    /**
     * Update an existing collection
     */
    public async updateCollection(
        reference: string,
        args: CollectionArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CollectionResponse<CollectionContent>> {
        return this.client.put<CollectionResponse<CollectionContent>>(
            `/collections/${reference}`,
            args,
            options,
        );
    }

    /**
     * Delete a collection
     */
    public async deleteCollection(reference: string): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(`/collections/${reference}`);
    }
}
