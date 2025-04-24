import {
    FavouriteContentType,
    FavouriteItem,
    FavouritePaginationResponse,
    FavouriteResponse,
    PaginationArgs,
    SuccessResponse,
} from '../types';
import { BaseModule } from './base';

export class FavouriteModule extends BaseModule {
    /**
     * Get favourite status
     */
    public async get(
        contentType: FavouriteContentType,
        slug: string,
    ): Promise<FavouriteResponse> {
        return this.client.get<FavouriteResponse>(
            `/favourite/${contentType}/${slug}`,
        );
    }

    /**
     * Add to favourites
     */
    public async add(
        contentType: FavouriteContentType,
        slug: string,
    ): Promise<FavouriteResponse> {
        return this.client.put<FavouriteResponse>(
            `/favourite/${contentType}/${slug}`,
        );
    }

    /**
     * Remove from favourites
     */
    public async remove(
        contentType: FavouriteContentType,
        slug: string,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/favourite/${contentType}/${slug}`,
        );
    }

    /**
     * Get user's favourite list
     */
    public async getList<TItem extends FavouriteItem>(
        contentType: FavouriteContentType,
        username: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<FavouritePaginationResponse<TItem>> {
        return this.client.post<FavouritePaginationResponse<TItem>>(
            `/favourite/${contentType}/${username}/list`,
            {},
            {
                page,
                size,
            },
        );
    }
}
