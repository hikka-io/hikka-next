import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { ContentTypeEnum, type FavouriteContentTypeEnum } from '@hikka/api';

import { useSession } from '@/features/auth';

import { serviceUserStatsOptions } from '../queries';

const FAVOURITE_CATEGORIES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
    ContentTypeEnum.COLLECTION,
] as const satisfies readonly FavouriteContentTypeEnum[];

/**
 * The favourite categories to show with their counts. Visitors see the non-empty ones;
 * the owner keeps every category, like the web.
 */
export function useFavouriteCategories(username: string) {
    const query = useQuery({
        ...serviceUserStatsOptions({ path: { username } }),
        subscribed: useIsFocused(),
    });
    const { user: viewer } = useSession();
    const owner = viewer?.username?.toLowerCase() === username.toLowerCase();
    const counts = query.data?.favourites_count;
    const count = (type: FavouriteContentTypeEnum) => counts?.[type] ?? 0;
    const categories = counts
        ? FAVOURITE_CATEGORIES.filter((type) => owner || count(type) > 0)
        : [];
    const total = counts
        ? FAVOURITE_CATEGORIES.reduce((sum, type) => sum + count(type), 0)
        : undefined;

    return { ...query, categories, count, total };
}
