'use client';

import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { createElement, useRef } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useChangeParam from '@/features/filters/hooks/use-change-param';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

const STATUSES = { ...WATCH_STATUS, ...READ_STATUS };

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const StatusCombobox = ({ content_type }: Props) => {
    const search = useFilterSearch<{ status?: string }>();
    const handleChangeParam = useChangeParam();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    const status = search.status as ReadStatusEnum | WatchStatusEnum | 'all';

    const statusInfo =
        content_type === ContentTypeEnum.ANIME
            ? WATCH_STATUS[status as WatchStatusEnum]
            : READ_STATUS[status as ReadStatusEnum];
    const statuses =
        content_type === ContentTypeEnum.ANIME ? WATCH_STATUS : READ_STATUS;

    if (!statusInfo && status !== 'all') {
        return null;
    }

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
                <TabsTrigger value="all">Усе</TabsTrigger>
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
                            {createElement(statuses[o].icon, {
                                className: 'size-3!',
                            })}
                        </div>
                        {STATUSES[o].title_ua}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default StatusCombobox;
