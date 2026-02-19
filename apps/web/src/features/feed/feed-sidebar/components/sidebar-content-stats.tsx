'use client';

import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useReadStats, useSession, useUserWatchStats } from '@hikka/react';
import Link from 'next/link';

import { CollapsibleFilter } from '@/components/collapsible-filter';

import { useSettingsStore } from '@/services/stores/settings-store';
import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

const WATCH_STATUS_ORDER: WatchStatusEnum[] = [
    WatchStatusEnum.PLANNED,
    WatchStatusEnum.WATCHING,
    WatchStatusEnum.COMPLETED,
    WatchStatusEnum.ON_HOLD,
    WatchStatusEnum.DROPPED,
];

const READ_STATUS_ORDER: ReadStatusEnum[] = [
    ReadStatusEnum.PLANNED,
    ReadStatusEnum.READING,
    ReadStatusEnum.COMPLETED,
    ReadStatusEnum.ON_HOLD,
    ReadStatusEnum.DROPPED,
];

const AnimeStats = ({ username }: { username: string }) => {
    const { data: stats } = useUserWatchStats({ username });

    if (!stats) return null;

    const statusMap: Record<WatchStatusEnum, number> = {
        [WatchStatusEnum.PLANNED]: stats.planned,
        [WatchStatusEnum.WATCHING]: stats.watching,
        [WatchStatusEnum.COMPLETED]: stats.completed,
        [WatchStatusEnum.ON_HOLD]: stats.on_hold,
        [WatchStatusEnum.DROPPED]: stats.dropped,
    };

    return (
        <div className="flex flex-col px-2 gap-1">
            {WATCH_STATUS_ORDER.map((status) => {
                const config = WATCH_STATUS[status];
                const Icon = config.icon;
                const count = statusMap[status];

                return (
                    <Link
                        key={status}
                        href={`/u/${username}/list/anime?watch_status=${status}`}
                        className="flex items-center justify-between px-2 py-1.5 text-sm transition-colors hover:bg-secondary rounded-sm"
                    >
                        <span className="flex items-center gap-2">
                            {Icon && (
                                <div
                                    className={cn(
                                        'flex p-1 items-center justify-center rounded-sm',
                                        `bg-${status} text-${status}-foreground border border-${status}-border`,
                                    )}
                                >
                                    <Icon className="text-muted-foreground size-3" />
                                </div>
                            )}
                            <span>{config.title_ua}</span>
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {count}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

const ReadStats = ({
    username,
    contentType,
}: {
    username: string;
    contentType: ContentTypeEnum.MANGA | ContentTypeEnum.NOVEL;
}) => {
    const { data: stats } = useReadStats({ contentType, username });

    if (!stats) return null;

    const statusMap: Record<ReadStatusEnum, number> = {
        [ReadStatusEnum.PLANNED]: stats.planned,
        [ReadStatusEnum.READING]: stats.reading,
        [ReadStatusEnum.COMPLETED]: stats.completed,
        [ReadStatusEnum.ON_HOLD]: stats.on_hold,
        [ReadStatusEnum.DROPPED]: stats.dropped,
    };

    return (
        <div className="flex flex-col px-2 gap-1">
            {READ_STATUS_ORDER.map((status) => {
                const config = READ_STATUS[status];
                const Icon = config.icon;
                const count = statusMap[status];

                return (
                    <Link
                        key={status}
                        href={`/u/${username}/list/${contentType}?read_status=${status}`}
                        className="flex items-center justify-between px-2 py-1.5 text-sm transition-colors hover:bg-secondary rounded-sm"
                    >
                        <span className="flex items-center gap-2">
                            {Icon && (
                                <div
                                    className={cn(
                                        'flex p-1 items-center justify-center rounded-sm',
                                        `bg-${status} text-${status}-foreground border border-${status}-border`,
                                    )}
                                >
                                    <Icon className="text-muted-foreground size-3" />
                                </div>
                            )}
                            <span>{config.title_ua}</span>
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {count}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

const SidebarContentStats = () => {
    const { user } = useSession();
    const { preferences, setCollapsible } = useSettingsStore();

    if (!user) return null;

    return (
        <div className="flex flex-col">
            <CollapsibleFilter
                className="px-0"
                title="Список аніме"
                open={preferences.collapsibles.home_anime_list}
                onOpenChange={(open) => setCollapsible('home_anime_list', open)}
            >
                <AnimeStats username={user.username} />
            </CollapsibleFilter>
            <CollapsibleFilter
                className="px-0"
                title="Список манґи"
                open={preferences.collapsibles.home_manga_list}
                onOpenChange={(open) => setCollapsible('home_manga_list', open)}
            >
                <ReadStats
                    username={user.username}
                    contentType={ContentTypeEnum.MANGA}
                />
            </CollapsibleFilter>
            <CollapsibleFilter
                className="px-0"
                title="Список ранобе"
                open={preferences.collapsibles.home_novel_list}
                onOpenChange={(open) => setCollapsible('home_novel_list', open)}
            >
                <ReadStats
                    username={user.username}
                    contentType={ContentTypeEnum.NOVEL}
                />
            </CollapsibleFilter>
        </div>
    );
};

export default SidebarContentStats;
