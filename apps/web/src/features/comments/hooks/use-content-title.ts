import type { ContentTypeEnum } from '@hikka/api';

import { useSessionUI } from '@/features/auth/hooks/use-session-ui';

import getContentTitle from '../utils/get-content-title';

/**
 * `useTitle` for entities with no `title_*`/`name_*` field — collections,
 * articles, edits, users.
 */
export function useContentTitle(
    content_type: ContentTypeEnum,
    content: Record<string, unknown> | object | null | undefined,
): string {
    const { preferences } = useSessionUI();

    return getContentTitle(
        content_type,
        content,
        preferences?.title_language ?? 'title_ua',
        preferences?.name_language ?? 'name_ua',
    );
}
