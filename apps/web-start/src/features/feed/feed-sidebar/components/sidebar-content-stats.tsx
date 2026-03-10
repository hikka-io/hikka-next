'use client';

import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useReadStats, useSession, useUserWatchStats } from '@hikka/react';
import { Link } from '@/utils/navigation';
import { FC } from 'react';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

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

interface StatusStatsItem {
    status: string;
    href: string;
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
                className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-secondary"
            >
                <span className="flex items-center gap-2">
                    {item.icon && (
                        <div
                            className={cn(
                                'flex items-center justify-center rounded-sm border p-1',
                                `bg-${item.status} text-${item.status}-foreground border-${item.status}-border`,
                            )}
                        >
                            <item.icon className="size-3 text-muted-foreground" />
                        </div>
                    )}
                    <span className='text-sm'>{item.label}</span>
                </span>
                <span className="text-sm text-muted-foreground">
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
        href: `/u/${username}/list/anime?watch_status=${status}`,
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
        href: `/u/${username}/list/${contentType}?read_status=${status}`,
        icon: READ_STATUS[status].icon,
        label: READ_STATUS[status].title_ua,
        count: statusCounts[status],
    }));

    return <StatusStatsList items={items} />;
};

const SidebarContentStats = () => {
    const { user } = useSession();

    if (!user) return null;

    return (
        <Accordion type='single' defaultValue='anime' className='bg-secondary/20 border rounded-lg'>
            <AccordionItem value="anime">
                <AccordionTrigger className="px-4">
                    Список аніме
                </AccordionTrigger>
                <AccordionContent className="px-2">
                    <AnimeStats username={user.username} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="manga">
                <AccordionTrigger className="px-4">
                    Список манґи
                </AccordionTrigger>
                <AccordionContent className="px-2">
                    <ReadStats
                        username={user.username}
                        contentType={ContentTypeEnum.MANGA}
                    />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="novel" className="border-b-0">
                <AccordionTrigger className="px-4">
                    Список ранобе
                </AccordionTrigger>
                <AccordionContent className="px-2">
                    <ReadStats
                        username={user.username}
                        contentType={ContentTypeEnum.NOVEL}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default SidebarContentStats;
