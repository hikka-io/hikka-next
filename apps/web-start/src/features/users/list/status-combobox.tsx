'use client';

import {
    ContentTypeEnum,
    ReadStatsResponse,
    ReadStatusEnum,
    WatchStatsResponse,
    WatchStatusEnum,
} from '@hikka/client';
import { useReadStats, useUserWatchStats } from '@hikka/react';
import { Table } from 'lucide-react';
import { createElement, useRef } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useChangeParam from '@/features/filters/hooks/use-change-param';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { useReadList } from '@/features/users/list/userlist/hooks/use-readlist';
import { useWatchList } from '@/features/users/list/userlist/hooks/use-watchlist';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

const STATUSES = { ...WATCH_STATUS, ...READ_STATUS };

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const StatusCombobox = ({ content_type }: Props) => {
    const isAnime = content_type === ContentTypeEnum.ANIME;
    const search = useFilterSearch<{ status?: string }>();
    const params = useParams();
    const handleChangeParam = useChangeParam();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    const { data: watchData } = useUserWatchStats({
        username: params.username,
        options: { enabled: isAnime },
    });

    const { data: readData } = useReadStats({
        username: params.username,
        contentType: content_type as ContentTypeEnum.MANGA | ContentTypeEnum.NOVEL,
        options: { enabled: !isAnime },
    });

    const watchList = useWatchList();
    const readList = useReadList();
    const paginationTotal = isAnime
        ? watchList.data?.pages[0]?.pagination.total
        : readList.data?.pages[0]?.pagination.total;

    const status = search.status as ReadStatusEnum | WatchStatusEnum | 'all';

    const statusInfo = isAnime
        ? WATCH_STATUS[status as WatchStatusEnum]
        : READ_STATUS[status as ReadStatusEnum];

    const listData = isAnime ? watchData : readData;

    if (!statusInfo && status !== 'all') return null;
    if (!listData) return null;
    const allAmount =
        listData.completed +
        listData.dropped +
        listData.on_hold +
        listData.planned +
        (isAnime
            ? (listData as WatchStatsResponse).watching
            : (listData as ReadStatsResponse).reading);

    const statuses = isAnime ? WATCH_STATUS : READ_STATUS;

    return (
        <Tabs
            value={status}
            onValueChange={(value) => handleChangeParam('status', value)}
            className="overflow-hidden"
        >
            <TabsList
                ref={scrollRef}
                className={cn(
                    'no-scrollbar w-full justify-start overflow-x-scroll',
                    gradientClassName,
                )}
            >
                <TabsTrigger value="all">
                    <Table className="size-4" />
                    {status === 'all' && 'Усе'}{' '}
                    <span className="text-muted-foreground">
                        ({status === 'all' && paginationTotal !== undefined ? paginationTotal : allAmount})
                    </span>
                </TabsTrigger>
                {(
                    Object.keys(statuses) as (
                        | ReadStatusEnum
                        | WatchStatusEnum
                    )[]
                ).map((o) => (
                    <TabsTrigger key={o} value={o} className="flex gap-2">
                        <div
                            className={cn(
                                'w-fit rounded-sm border p-1 text-white',
                                `bg-${o} text-${o}-foreground border-${o}-border`,
                            )}
                        >
                            {createElement(STATUSES[o].icon!, {
                                className: 'size-3!',
                            })}
                        </div>
                        {status === o && STATUSES[o].title_ua}{' '}
                        <span className="text-muted-foreground">
                            ({status === o && paginationTotal !== undefined ? paginationTotal : listData[o as keyof typeof listData]})
                        </span>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default StatusCombobox;
