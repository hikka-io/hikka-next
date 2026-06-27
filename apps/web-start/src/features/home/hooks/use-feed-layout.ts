import { useMemo } from 'react';

import type { UiFeedWidget } from '@hikka/api';

import { useSession } from '@/features/auth/hooks/use-session';
import { useSessionUI } from '@/services/hooks/use-session-ui';

import { type SupportedWidgetSlug, WIDGET_REGISTRY } from '../constants';
import { groupBySide } from '../utils';

export interface FeedLayoutData {
    left: UiFeedWidget[];
    center: UiFeedWidget[];
    right: UiFeedWidget[];
}

export function useFeedLayout(): FeedLayoutData {
    const { preferences } = useSessionUI();
    const { user } = useSession();
    const widgets = preferences.feed.widgets;

    return useMemo(() => {
        const filtered = widgets.filter((w) => {
            const meta = WIDGET_REGISTRY[w.slug as SupportedWidgetSlug];
            if (!meta) return false;
            if (meta.authRequired && !user) return false;
            return true;
        });

        return groupBySide(filtered);
    }, [widgets, user]);
}
