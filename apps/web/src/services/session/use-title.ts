import { getTitle } from '@/utils/title/get-title';

import { useSessionUI } from './use-session-ui';

export function useTitle(
    item: Record<string, unknown> | object | null | undefined,
): string {
    const { preferences } = useSessionUI();
    return getTitle(
        item,
        preferences?.title_language ?? 'title_ua',
        preferences?.name_language ?? 'name_ua',
    );
}
