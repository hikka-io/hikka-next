import {
    CollectionArgs,
    CollectionResponse,
    CollectionsListArgs,
    CollectionsListResponse,
    PaginationArgs,
    SuccessResponse,
} from '../types';
import { BaseModule } from './base';

export class CollectionsModule extends BaseModule {
    /**
     * Get collections
     */
    public async getCollections(
        args: CollectionsListArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CollectionsListResponse> {
        return this.client.post<CollectionsListResponse>('/collections', args, {
            page,
            size,
        });
    }

    /**
     * Create a collection
     */
    public async create(args: CollectionArgs): Promise<CollectionResponse> {
        return this.client.post<CollectionResponse>(
            '/collections/create',
            args,
        );
    }

    /**
     * Get a collection by reference
     */
    public async getByReference(
        reference: string,
    ): Promise<CollectionResponse> {
        return this.client.get<CollectionResponse>(`/collections/${reference}`);
    }

    /**
     * Update a collection
     */
    public async update(
        reference: string,
        args: CollectionArgs,
    ): Promise<CollectionResponse> {
        return this.client.put<CollectionResponse>(
            `/collections/${reference}`,
            args,
        );
    }

    /**
     * Delete a collection
     */
    public async delete(reference: string): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(`/collections/${reference}`);
    }
}
