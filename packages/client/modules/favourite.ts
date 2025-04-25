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
     * Get favourite status for content
     */
    public async getFavouriteStatus(
        contentType: FavouriteContentType,
        slug: string,
    ): Promise<FavouriteResponse> {
        return this.client.get<FavouriteResponse>(
            `/favourite/${contentType}/${slug}`,
        );
    }

    /**
     * Create a favourite for content
     */
    public async createFavourite(
        contentType: FavouriteContentType,
        slug: string,
    ): Promise<FavouriteResponse> {
        return this.client.put<FavouriteResponse>(
            `/favourite/${contentType}/${slug}`,
        );
    }

    /**
     * Delete a favourite for content
     */
    public async deleteFavourite(
        contentType: FavouriteContentType,
        slug: string,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/favourite/${contentType}/${slug}`,
        );
    }

    /**
     * Get user's favourites list by content type
     */
    public async getUserFavourites<TItem extends FavouriteItem>(
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
