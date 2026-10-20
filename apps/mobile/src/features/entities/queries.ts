import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import {
    characterAnimeInfiniteOptions,
    characterInfoOptions,
    characterMangaInfiniteOptions,
    characterNovelInfiniteOptions,
    characterVoicesInfiniteOptions,
    paginatedInfiniteOptions,
    personAnimeInfiniteOptions,
    personInfoOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
} from '@hikka/api';

export const APPEARANCE_PAGE_SIZE = 12;

type AppearancePage<T> = {
    list: T[];
    pagination: { page: number; pages: number; total: number };
};

type AppearanceOptions = { queryKey: readonly unknown[] };

export { characterInfoOptions, personInfoOptions };

export const characterAnimeOptions = (slug: string) =>
    paginatedInfiniteOptions(
        characterAnimeInfiniteOptions({
            path: { slug },
            query: { size: APPEARANCE_PAGE_SIZE },
        }),
    );

export const characterMangaOptions = (slug: string) =>
    paginatedInfiniteOptions(
        characterMangaInfiniteOptions({
            path: { slug },
            query: { size: APPEARANCE_PAGE_SIZE },
        }),
    );

export const characterNovelOptions = (slug: string) =>
    paginatedInfiniteOptions(
        characterNovelInfiniteOptions({
            path: { slug },
            query: { size: APPEARANCE_PAGE_SIZE },
        }),
    );

export const characterVoicesOptions = (slug: string) =>
    paginatedInfiniteOptions(
        characterVoicesInfiniteOptions({
            path: { slug },
            query: { size: APPEARANCE_PAGE_SIZE },
        }),
    );

export const personAnimeOptions = (slug: string) =>
    paginatedInfiniteOptions(
        personAnimeInfiniteOptions({
            path: { slug },
            query: { size: APPEARANCE_PAGE_SIZE },
        }),
    );

export const personMangaOptions = (slug: string) =>
    paginatedInfiniteOptions(
        personMangaInfiniteOptions({
            path: { slug },
            query: { size: APPEARANCE_PAGE_SIZE },
        }),
    );

export const personNovelOptions = (slug: string) =>
    paginatedInfiniteOptions(
        personNovelInfiniteOptions({
            path: { slug },
            query: { size: APPEARANCE_PAGE_SIZE },
        }),
    );

export const personVoicesOptions = (slug: string) =>
    paginatedInfiniteOptions(
        personVoicesInfiniteOptions({
            path: { slug },
            query: { size: APPEARANCE_PAGE_SIZE },
        }),
    );

// The eight builders return eight page types; the section only needs the shared list/pagination shape.
export function useAppearanceList<T>(options: AppearanceOptions) {
    const query = useInfiniteQuery(
        options as unknown as Parameters<
            typeof useInfiniteQuery<
                AppearancePage<T>,
                Error,
                InfiniteData<AppearancePage<T>>,
                readonly unknown[],
                number
            >
        >[0],
    );

    return {
        list: query.data?.pages.flatMap((page) => page.list),
        isPending: query.isPending,
        error: query.error,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: () => void query.fetchNextPage(),
        refetch: () => void query.refetch(),
    };
}
