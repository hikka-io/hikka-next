import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
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
     * Get favourite status for content
     */
    public async getFavouriteStatus(
        contentType: FavouriteContentType,
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<FavouriteResponse> {
        return this.client.get<FavouriteResponse>(
            `/favourite/${contentType}/${slug}`,
            options,
        );
    }

    /**
     * Create a favourite for content
     */
    public async createFavourite(
        contentType: FavouriteContentType,
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<FavouriteResponse> {
        return this.client.put<FavouriteResponse>(
            `/favourite/${contentType}/${slug}`,
            undefined,
            options,
        );
    }

    /**
     * Delete a favourite for content
     */
    public async deleteFavourite(
        contentType: FavouriteContentType,
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/favourite/${contentType}/${slug}`,
            options,
        );
    }

    /**
     * Get user's favourites list by content type
     */
    public async getUserFavourites<TItem extends FavouriteItem>(
        contentType: FavouriteContentType,
        username: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<FavouritePaginationResponse<TItem>> {
        return this.client.post<FavouritePaginationResponse<TItem>>(
            `/favourite/${contentType}/${username}/list`,
            {},
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }
}
