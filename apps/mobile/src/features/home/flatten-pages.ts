import type { InfiniteData } from '@tanstack/react-query';

export const flattenPages = <T>(
    data: InfiniteData<{ list: T[] }> | undefined,
) => data?.pages.flatMap((page) => page.list);
