'use client';

import {
    CommonContentType,
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useReadStats, useUserWatchStats } from '@hikka/react';
import Link from 'next/link';
import { FC } from 'react';

import { MaterialSymbolsClockLoader10 } from '@/components/icons/material-symbols/MaterialSymbolsClockLoader10';
import { MaterialSymbolsPlayArrowRounded } from '@/components/icons/material-symbols/MaterialSymbolsPlayArrowRounded';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';

import StatusProgressBar from './status-progress-bar';

interface Props {
    type: CommonContentType;
    username: string;
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

const ListTabContent: FC<Props> = ({ type, username }) => {
    const isAnime = type === ContentTypeEnum.ANIME;
    const sortParam = isAnime ? 'watch_score' : 'read_score';

    const { data: watchData } = useUserWatchStats({
        username,
        options: { enabled: isAnime },
    });

    const { data: readData } = useReadStats({
        username,
        contentType:
            type === ContentTypeEnum.MANGA ? ContentTypeEnum.MANGA : ContentTypeEnum.NOVEL,
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

    const segments = statuses.map((status) => ({
        status,
        count: data[status as keyof typeof data] as number,
    }));

    const watchHours = isAnime
        ? Math.round((watchData!.duration || 0) / 60)
        : null;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 px-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2 text-muted-foreground">
                        <MaterialSymbolsPlayArrowRounded className="size-4" />
                        <Label>Всього</Label>
                    </div>
                    <Label>{total}</Label>
                </div>
                <StatusProgressBar segments={segments} />
            </div>
            <div className="flex flex-col px-2 gap-1">
                {statuses.map((status) => {
                    const count = data[status as keyof typeof data] as number;
                    const info =
                        statusMap[status as keyof typeof statusMap] as {
                            title_ua?: string;
                            title_en: string;
                        };

                    return (
                        <Link
                            key={status}
                            href={`/u/${username}/list/${type}?status=${status}&sort=${sortParam}`}
                            className={cn(
                                'flex items-center justify-between gap-4 rounded-sm p-2 hover:bg-secondary',
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
                                <Label className="cursor-pointer truncate text-muted-foreground">
                                    {info.title_ua || info.title_en}
                                </Label>
                            </div>
                            <Label className="cursor-pointer">{count}</Label>
                        </Link>
                    );
                })}
            </div>
            {watchHours !== null && (
                <div className="flex flex-col gap-4 px-4">
                    <Separator />
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MaterialSymbolsClockLoader10 className="size-4" />
                            <Label>Час перегляду</Label>
                        </div>
                        <Label>{watchHours} {getDeclensionWord(watchHours, ['година', 'години', 'годин'])}</Label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListTabContent;
