import { type FC, useState } from 'react';

import { range } from '@antfu/utils';
import { useQuery } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    ReadStatusEnum,
    type UserWatchStatsResponse,
    WatchStatusEnum,
} from '@hikka/api';

import { MaterialSymbolsClockLoader10 } from '@/components/icons/material-symbols/MaterialSymbolsClockLoader10';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { DAY_FORMS, HOUR_FORMS, MONTH_FORMS } from '@/utils/i18n/word-forms';
import { LIST_STATUS } from '@/utils/labels';
import { Link } from '@/utils/navigation';

import { userListStatsOptions } from '../../queries';
import StatusProgressBar from './status-progress-bar';

type Props = {
    type: MainContentTypeEnum;
    username: string;
    className?: string;
};

const WATCH_ORDER: WatchStatusEnum[] = [
    WatchStatusEnum.COMPLETED,
    WatchStatusEnum.WATCHING,
    WatchStatusEnum.PLANNED,
    WatchStatusEnum.DROPPED,
    WatchStatusEnum.ON_HOLD,
];

const READ_ORDER: ReadStatusEnum[] = [
    ReadStatusEnum.COMPLETED,
    ReadStatusEnum.READING,
    ReadStatusEnum.PLANNED,
    ReadStatusEnum.DROPPED,
    ReadStatusEnum.ON_HOLD,
];

const ListTabContent: FC<Props> = ({ type, username, className }) => {
    const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
    const isAnime = type === ContentTypeEnum.ANIME;
    const sortParam = isAnime ? 'watch_score' : 'read_score';
    const statusCount = (isAnime ? WATCH_ORDER : READ_ORDER).length;

    const { data } = useQuery(userListStatsOptions(username, type));

    if (!data) {
        return (
            <div className={cn('flex grow flex-col gap-2', className)}>
                <div className="px-4">
                    <Skeleton className="h-2 w-full rounded-xs" />
                </div>
                <div className="grid grid-cols-2 gap-1 px-2">
                    {range(0, statusCount + 1).map((index) => (
                        <div key={index} className="p-2">
                            <Skeleton className="h-4.5 w-full rounded-sm" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const statuses = isAnime ? WATCH_ORDER : READ_ORDER;
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

    const watchHours = isAnime
        ? Math.round(((data as UserWatchStatsResponse).duration || 0) / 60)
        : null;

    const watchTotalDays =
        watchHours !== null ? Math.floor(watchHours / 24) : 0;
    const watchMonths = Math.floor(watchTotalDays / 30);
    const watchDays = watchTotalDays % 30;

    const watchDisplayLabel = [
        watchMonths > 0 &&
            `${watchMonths} ${getDeclensionWord(watchMonths, MONTH_FORMS)}`,
        (watchDays > 0 || watchMonths === 0) &&
            `${watchDays} ${getDeclensionWord(watchDays, DAY_FORMS)}`,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cn('flex grow flex-col gap-2', className)}>
            <div className="flex flex-col gap-2 px-2">
                <StatusProgressBar
                    segments={segments}
                    hoveredStatus={hoveredStatus}
                />
            </div>
            <div className="grid grid-cols-2 gap-1 px-2">
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
                    const count = data[status as keyof typeof data] as number;
                    const info = statusMap[
                        status as keyof typeof statusMap
                    ] as {
                        title_ua?: string;
                        title_en: string;
                    };

                    return (
                        <Tooltip key={status}>
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
            {watchHours !== null && (
                <div className="mt-auto flex flex-col gap-4">
                    <Separator />
                    <div className="flex items-center justify-between gap-2 px-4">
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListTabContent;
