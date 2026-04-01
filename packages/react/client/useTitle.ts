'use client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { getTitle } from '@/utils';

/**
 * Hook that resolves a display title using the user's language preferences
 * from HikkaContext. Must be called within HikkaContextProvider.
 */
export function useTitle(
    item: Record<string, unknown> | object | null | undefined,
): string {
    const { defaultOptions } = useHikkaClient();
    return getTitle(item, defaultOptions?.title, defaultOptions?.name);
}
