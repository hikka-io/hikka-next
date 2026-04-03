'use client';

import { UIFeedWidget, UIFeedWidgetSlug } from '@hikka/client';
import { useSession } from '@hikka/react';
import { useMemo } from 'react';

import { useSessionUI } from '@/services/hooks/use-session-ui';

import { WIDGET_REGISTRY } from '../constants';
import { groupBySide } from '../utils';

export interface FeedLayoutData {
    left: UIFeedWidget[];
    center: UIFeedWidget[];
    right: UIFeedWidget[];
}

export function useFeedLayout(): FeedLayoutData {
    const { preferences } = useSessionUI();
    const { user } = useSession();
    const widgets = preferences.feed.widgets;

    return useMemo(() => {
        const filtered = widgets.filter((w) => {
            const meta = WIDGET_REGISTRY[w.slug as UIFeedWidgetSlug];
            if (!meta) return false;
            if (meta.authRequired && !user) return false;
            return true;
        });

        return groupBySide(filtered);
    }, [widgets, user]);
}
