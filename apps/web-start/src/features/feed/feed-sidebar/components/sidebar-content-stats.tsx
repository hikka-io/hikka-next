'use client';

import {
    CommonContentType,
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useReadStats, useSession, useUserWatchStats } from '@hikka/react';
import { FC, useState } from 'react';

import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

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

interface StatusStatsItem {
    status: string;
    href: string;
    search?: Record<string, unknown>;
    icon?: FC<{ className?: string }>;
    label: string;
    count: number;
}

const StatusStatsList: FC<{ items: StatusStatsItem[] }> = ({ items }) => (
    <div className="flex flex-col gap-1">
        {items.map((item) => (
            <Link
                key={item.status}
                to={item.href}
                search={item.search}
                preload={false}
                className="hover:bg-secondary flex items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors"
            >
                <span className="flex items-center gap-2">
                    {item.icon && (
                        <div
                            className={cn(
                                'flex items-center justify-center rounded-sm border p-1',
                                `bg-${item.status} text-${item.status}-foreground border-${item.status}-border`,
                            )}
                        >
                            <item.icon className="text-muted-foreground size-3" />
                        </div>
                    )}
                    <span className="text-sm">{item.label}</span>
                </span>
                <span className="text-muted-foreground text-sm">
                    {item.count}
                </span>
            </Link>
        ))}
    </div>
);

const AnimeStats = ({ username }: { username: string }) => {
    const { data: stats } = useUserWatchStats({ username });

    if (!stats) return null;

    const statusCounts: Record<WatchStatusEnum, number> = {
        [WatchStatusEnum.PLANNED]: stats.planned,
        [WatchStatusEnum.WATCHING]: stats.watching,
        [WatchStatusEnum.COMPLETED]: stats.completed,
        [WatchStatusEnum.ON_HOLD]: stats.on_hold,
        [WatchStatusEnum.DROPPED]: stats.dropped,
    };

    const items: StatusStatsItem[] = WATCH_STATUS_ORDER.map((status) => ({
        status,
        href: `/u/${username}/list/anime`,
        search: { status },
        icon: WATCH_STATUS[status].icon,
        label: WATCH_STATUS[status].title_ua,
        count: statusCounts[status],
    }));

    return <StatusStatsList items={items} />;
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

    const statusCounts: Record<ReadStatusEnum, number> = {
        [ReadStatusEnum.PLANNED]: stats.planned,
        [ReadStatusEnum.READING]: stats.reading,
        [ReadStatusEnum.COMPLETED]: stats.completed,
        [ReadStatusEnum.ON_HOLD]: stats.on_hold,
        [ReadStatusEnum.DROPPED]: stats.dropped,
    };

    const items: StatusStatsItem[] = READ_STATUS_ORDER.map((status) => ({
        status,
        href: `/u/${username}/list/${contentType}`,
        search: { status },
        icon: READ_STATUS[status].icon,
        label: READ_STATUS[status].title_ua,
        count: statusCounts[status],
    }));

    return <StatusStatsList items={items} />;
};

const SidebarContentStats = () => {
    const { user } = useSession();
    const [activeTab, setActiveTab] = useState<CommonContentType>(
        ContentTypeEnum.ANIME,
    );

    if (!user) return null;

    return (
        <Card className="bg-secondary/20 px-2 backdrop-blur">
            <Header className="px-2">
                <HeaderTitle variant="h4">Список</HeaderTitle>
            </Header>
            <ToggleGroup
                type="single"
                value={activeTab}
                onValueChange={(value: string) =>
                    value && setActiveTab(value as CommonContentType)
                }
                size="badge"
                className="mx-2"
            >
                <ToggleGroupItem
                    value={ContentTypeEnum.ANIME}
                    aria-label="Аніме"
                    className="flex-1"
                >
                    Аніме
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={ContentTypeEnum.MANGA}
                    aria-label="Манґа"
                    className="flex-1"
                >
                    Манґа
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={ContentTypeEnum.NOVEL}
                    aria-label="Ранобе"
                    className="flex-1"
                >
                    Ранобе
                </ToggleGroupItem>
            </ToggleGroup>
            {activeTab === ContentTypeEnum.ANIME && (
                <AnimeStats username={user.username} />
            )}
            {activeTab === ContentTypeEnum.MANGA && (
                <ReadStats
                    username={user.username}
                    contentType={ContentTypeEnum.MANGA}
                />
            )}
            {activeTab === ContentTypeEnum.NOVEL && (
                <ReadStats
                    username={user.username}
                    contentType={ContentTypeEnum.NOVEL}
                />
            )}
        </Card>
    );
};

export default SidebarContentStats;
