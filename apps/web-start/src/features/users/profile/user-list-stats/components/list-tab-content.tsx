'use client';

import {
    CommonContentType,
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useReadStats, useUserWatchStats } from '@hikka/react';
import { FC, useState } from 'react';

import { MaterialSymbolsClockLoader10 } from '@/components/icons/material-symbols/MaterialSymbolsClockLoader10';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link } from '@/utils/navigation';

import StatusProgressBar from './status-progress-bar';

interface Props {
    type: CommonContentType;
    username: string;
    className?: string;
}

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

    const { data: watchData } = useUserWatchStats({
        username,
        options: { enabled: isAnime },
    });

    const { data: readData } = useReadStats({
        username,
        contentType:
            type === ContentTypeEnum.MANGA
                ? ContentTypeEnum.MANGA
                : ContentTypeEnum.NOVEL,
        options: { enabled: !isAnime },
    });

    if (isAnime && !watchData) return null;
    if (!isAnime && !readData) return null;

    const statuses = isAnime ? WATCH_ORDER : READ_ORDER;
    const statusMap = isAnime ? WATCH_STATUS : READ_STATUS;
    const data = isAnime ? watchData! : readData!;

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
        ? Math.round((watchData!.duration || 0) / 60)
        : null;

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex flex-col gap-2 px-2">
                <StatusProgressBar segments={segments} hoveredStatus={hoveredStatus} />
            </div>
            <div className="flex flex-wrap gap-1 px-2">
                <Link
                    to={`/u/${username}/list/${type}`}
                    search={{ status: 'all' }}
                    className={cn(
                        'hover:bg-secondary flex flex-1 items-center justify-between gap-2 rounded-sm p-2 md:flex-0',
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
                        <Label className="text-muted-foreground cursor-pointer truncate">
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
                        <Link
                            key={status}
                            to={`/u/${username}/list/${type}`}
                            search={{ status, sort: sortParam }}
                            preload={false}
                            onMouseEnter={() => setHoveredStatus(status)}
                            onMouseLeave={() => setHoveredStatus(null)}
                            className={cn(
                                'hover:bg-secondary flex flex-1 items-center justify-between gap-2 rounded-sm p-2  md:flex-0',
                                count === 0 && 'opacity-50',
                            )}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <div
                                    className={cn(
                                        'size-2 rounded-full',
                                        `bg-${status}-foreground`,
                                    )}
                                />
                                <Label className="text-muted-foreground cursor-pointer truncate">
                                    {info.title_ua || info.title_en}
                                </Label>
                            </div>
                            <Label className="cursor-pointer">{count}</Label>
                        </Link>
                    );
                })}
            </div>
            {watchHours !== null && (
                <div className="flex flex-col gap-4">
                    <Separator />
                    <div className="flex items-center justify-between gap-2 px-4">
                        <div className="text-muted-foreground flex items-center gap-2">
                            <MaterialSymbolsClockLoader10 className="size-4" />
                            <Label>Час перегляду</Label>
                        </div>
                        <Label>
                            {watchHours}{' '}
                            {getDeclensionWord(watchHours, [
                                'година',
                                'години',
                                'годин',
                            ])}
                        </Label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListTabContent;
