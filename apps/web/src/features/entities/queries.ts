import type { QueryClient } from '@tanstack/react-query';

import {
    ENTITY_APPEARANCE_LISTS,
    type EntityAppearanceList,
    type EntityType,
    entityAppearanceOptions,
} from '@/utils/api/content-queries';
import type { LoaderContext } from '@/utils/api/loader-prefetch';

export {
    ENTITY_APPEARANCE_LISTS,
    ENTITY_PREVIEW_SIZE,
    type EntityAppearanceList,
    type EntityType,
    entityAppearanceOptions,
} from '@/utils/api/content-queries';

// The appearance lists differ in page type; a prefetch discards the data, so it only needs the common shape.
type InfinitePrefetchOptions = Parameters<
    QueryClient['prefetchInfiniteQuery']
>[0];

const prefetchAppearance = (
    type: EntityType,
    list: EntityAppearanceList,
    preview: boolean,
    slug: string,
    { queryClient, apiClient }: LoaderContext,
) =>
    queryClient.prefetchInfiniteQuery(
        entityAppearanceOptions(
            type,
            list,
            slug,
            { preview },
            apiClient,
        ) as InfinitePrefetchOptions,
    );

export async function loadEntityOverview(
    type: EntityType,
    slug: string,
    ctx: LoaderContext,
): Promise<void> {
    await Promise.all(
        ENTITY_APPEARANCE_LISTS.map((list) =>
            prefetchAppearance(type, list, true, slug, ctx),
        ),
    );
}

export async function loadEntityTab(
    type: EntityType,
    list: EntityAppearanceList,
    slug: string,
    ctx: LoaderContext,
): Promise<void> {
    await prefetchAppearance(type, list, false, slug, ctx);
}
