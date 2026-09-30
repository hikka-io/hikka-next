import type { QueryClient } from '@tanstack/react-query';

import { type Client, paginationPageParam } from '@hikka/api';

import {
    ENTITY_APPEARANCE_LISTS,
    type EntityAppearanceList,
    type EntityType,
    entityAppearanceOptions,
} from '@/utils/api/content-queries';

export {
    ENTITY_APPEARANCE_LISTS,
    ENTITY_PREVIEW_SIZE,
    type EntityAppearanceList,
    type EntityType,
    entityAppearanceOptions,
} from '@/utils/api/content-queries';

type EntityLoaderContext = {
    slug: string;
    queryClient: QueryClient;
    apiClient: Client;
};

// The appearance lists differ in page type; a prefetch discards the data, so it only needs the common shape.
type InfinitePrefetchOptions = Parameters<
    QueryClient['ensureInfiniteQueryData']
>[0];

const ensureAppearances = (
    type: EntityType,
    lists: readonly EntityAppearanceList[],
    preview: boolean,
    { slug, queryClient, apiClient }: EntityLoaderContext,
) =>
    Promise.allSettled(
        lists.map((list) =>
            queryClient.ensureInfiniteQueryData({
                ...entityAppearanceOptions(
                    type,
                    list,
                    slug,
                    { preview },
                    apiClient,
                ),
                ...paginationPageParam(),
            } as InfinitePrefetchOptions),
        ),
    );

export async function loadEntityOverview(
    type: EntityType,
    ctx: EntityLoaderContext,
): Promise<void> {
    await ensureAppearances(type, ENTITY_APPEARANCE_LISTS, true, ctx);
}

export async function loadEntityTab(
    type: EntityType,
    list: EntityAppearanceList,
    ctx: EntityLoaderContext,
): Promise<void> {
    await ensureAppearances(type, [list], false, ctx);
}
