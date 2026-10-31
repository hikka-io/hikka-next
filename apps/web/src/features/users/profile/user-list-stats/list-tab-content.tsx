import { type FC, useState } from 'react';

import { range } from '@antfu/utils';
import { useQuery } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type UserWatchStatsResponse,
} from '@hikka/api';
import {
    getDeclensionWord,
    getWatchTime,
    HOUR_FORMS,
    LIST_STATUS,
    READ_STATUS_ORDER,
    WATCH_STATUS_ORDER,
} from '@hikka/core';

import { MaterialSymbolsClockLoader10 } from '@/components/icons/material-symbols/MaterialSymbolsClockLoader10';
import BlockFooter from '@/components/ui/block-footer';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import { userListStatsOptions } from '../../queries';
import StatusProgressBar from './status-progress-bar';

type Props = {
    type: MainContentTypeEnum;
    username: string;
};

const ListTabContent: FC<Props> = ({ type, username }) => {
    const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
    const isAnime = type === ContentTypeEnum.ANIME;
    const sortParam = isAnime ? 'watch_score' : 'read_score';
    const statusCount = (isAnime ? WATCH_STATUS_ORDER : READ_STATUS_ORDER)
        .length;

    const { data, isPending } = useQuery(userListStatsOptions(username, type));

    if (!data) {
        return isPending ? (
            <>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-2 w-full rounded-xs" />
                    <div className="-mx-2 grid grid-cols-2 gap-1">
                        {range(0, statusCount + 1).map((index) => (
                            <div key={index} className="p-2">
                                <Skeleton className="h-4.5 w-full rounded-sm" />
                            </div>
                        ))}
                    </div>
                </div>
                {isAnime && (
                    <BlockFooter className="mt-auto justify-between">
                        <Skeleton className="h-4.5 w-32 rounded-sm" />
                        <Skeleton className="h-4.5 w-24 rounded-sm" />
                    </BlockFooter>
                )}
            </>
        ) : null;
    }

    const statuses = isAnime ? WATCH_STATUS_ORDER : READ_STATUS_ORDER;
    const statusMap = LIST_STATUS[isAnime ? 'watch' : 'read'];

    const total = statuses.reduce(
        (acc, s) => acc + (data[s as keyof typeof data] as number),
        0,
    );

    const segments = statuses.map((status) => {
        const info = statusMap[status as keyof typeof statusMap] as {
            title_ua?: string;
            title_en: string;
        };
        return {
            status,
            count: data[status as keyof typeof data] as number,
            label: info.title_ua || info.title_en,
        };
    });

    const watchTime = isAnime
        ? getWatchTime((data as UserWatchStatsResponse).duration)
        : null;
    const watchHours = watchTime?.hours ?? null;
    const watchDisplayLabel = watchTime?.label ?? '';

    return (
        <>
            <div className="flex flex-col gap-2">
                <StatusProgressBar
                    segments={segments}
                    hoveredStatus={hoveredStatus}
                />
                <div className="-mx-2 grid grid-cols-2 gap-1">
                    <Link
                        to={`/u/${username}/list/${type}`}
                        search={{ status: 'all' }}
                        className={cn(
                            'flex items-center justify-between gap-2 rounded-sm p-2 hover:bg-accent',
                            total === 0 && 'opacity-50',
                        )}
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <div
                                className={cn(
                                    'size-2 rounded-full',
                                    `bg-foreground`,
                                )}
                            />
                            <Label className="cursor-pointer truncate text-muted-foreground">
                                Всього
                            </Label>
                        </div>
                        <Label>{total}</Label>
                    </Link>
                    {statuses.map((status) => {
                        const count = data[
                            status as keyof typeof data
                        ] as number;
                        const info = statusMap[
                            status as keyof typeof statusMap
                        ] as {
                            title_ua?: string;
                            title_en: string;
                        };

                        return (
                            <Tooltip key={status} disableHoverablePopup>
                                <TooltipTrigger
                                    render={
                                        <Link
                                            to={`/u/${username}/list/${type}`}
                                            search={{ status, sort: sortParam }}
                                            preload={false}
                                            onMouseEnter={() =>
                                                setHoveredStatus(status)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredStatus(null)
                                            }
                                            className={cn(
                                                'flex items-center justify-between gap-2 rounded-sm p-2 hover:bg-accent',
                                                count === 0 && 'opacity-50',
                                            )}
                                        />
                                    }
                                >
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div
                                            className={cn(
                                                'size-2 rounded-full',
                                                `bg-${status}-foreground`,
                                            )}
                                        />
                                        <Label className="cursor-pointer truncate text-muted-foreground">
                                            {info.title_ua || info.title_en}
                                        </Label>
                                    </div>
                                    <Label className="cursor-pointer">
                                        {count}
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    {Math.round((count / total) * 100)}%
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
            {watchHours !== null && (
                <BlockFooter className="mt-auto justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MaterialSymbolsClockLoader10 className="size-4" />
                        <Label>Час перегляду</Label>
                    </div>
                    <Tooltip>
                        <TooltipTrigger
                            render={<Label className="cursor-pointer" />}
                        >
                            {watchDisplayLabel}
                        </TooltipTrigger>
                        <TooltipContent>
                            {watchHours}{' '}
                            {getDeclensionWord(watchHours, HOUR_FORMS)}
                        </TooltipContent>
                    </Tooltip>
                </BlockFooter>
            )}
        </>
    );
};

export default ListTabContent;
