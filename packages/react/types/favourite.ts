import { FavouriteContentType } from '@hikka/client';

export interface UseFavouriteStatusParams {
    contentType: FavouriteContentType;
    slug: string;
}

export interface UseFavouriteListParams {
    contentType: FavouriteContentType;
    username: string;
}
