import { useSessionUI } from '@/services/hooks/use-session-ui';

import { getTitle } from './get-title';

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
