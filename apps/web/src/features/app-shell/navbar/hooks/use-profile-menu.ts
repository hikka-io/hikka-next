import { useQueries } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';

import {
    type AppReadSchemasReadStatsResponse,
    userReadStatsOptions,
    userWatchStatsOptions,
    type WatchStatsResponse,
} from '@hikka/api';

import { useSession } from '@/features/auth/hooks/use-session';
import { PROFILE_MENU } from '@/utils/constants/navigation';

export type ProfileMenuItem = Hikka.NavRoute & { count?: number };

const watchTotal = (stats: WatchStatsResponse) =>
    stats.completed +
    stats.watching +
    stats.planned +
    stats.on_hold +
    stats.dropped;

const readTotal = (stats: AppReadSchemasReadStatsResponse) =>
    stats.completed +
    stats.reading +
    stats.planned +
    stats.on_hold +
    stats.dropped;

export function useProfileMenu({ enabled = true }: { enabled?: boolean } = {}) {
    const { user } = useSession();
    const username = user?.username;

    const currentUrl = useRouterState({
        select: (state) => {
            const location = state.resolvedLocation ?? state.location;
            return location.pathname + location.searchStr;
        },
    });

    const [anime, manga, novel] = useQueries({
        queries: [
            {
                ...userWatchStatsOptions({
                    path: { username: username ?? '' },
                }),
                enabled: enabled && !!username,
                select: watchTotal,
            },
            {
                ...userReadStatsOptions({
                    path: { content_type: 'manga', username: username ?? '' },
                }),
                enabled: enabled && !!username,
                select: readTotal,
            },
            {
                ...userReadStatsOptions({
                    path: { content_type: 'novel', username: username ?? '' },
                }),
                enabled: enabled && !!username,
                select: readTotal,
            },
        ],
    });

    const counts: Record<string, number | undefined> = {
        'anime-list': anime.data,
        'manga-list': manga.data,
        'novel-list': novel.data,
    };

    const items: ProfileMenuItem[] = PROFILE_MENU.map((item) => ({
        ...item,
        url: item.url.replace('{username}', username ?? ''),
        count: counts[item.slug],
    }));

    const logout = () => {
        window.location.href = `/auth/logout?callbackUrl=${encodeURIComponent(currentUrl)}`;
    };

    return { user, items, logout };
}
