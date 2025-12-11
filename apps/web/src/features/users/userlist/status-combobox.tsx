'use client';

import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createElement } from 'react';

import H5 from '@/components/typography/h5';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';

import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';
import { createQueryString } from '@/utils/url';

import { useReadList } from './hooks/use-readlist';
import { useWatchList } from './hooks/use-watchlist';

const STATUSES = { ...WATCH_STATUS, ...READ_STATUS };

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const StatusCombobox = ({ content_type }: Props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const status = searchParams.get('status')! as
        | ReadStatusEnum
        | WatchStatusEnum;

    const statusInfo =
        content_type === ContentTypeEnum.ANIME
            ? WATCH_STATUS[status as WatchStatusEnum]
            : READ_STATUS[status as ReadStatusEnum];
    const statuses =
        content_type === ContentTypeEnum.ANIME ? WATCH_STATUS : READ_STATUS;

    const { pagination } =
        content_type === ContentTypeEnum.ANIME ? useWatchList() : useReadList();

    const handleStatusChange = (value: string[]) => {
        {
            const query = createQueryString(
                'status',
                value[0],
                new URLSearchParams(searchParams),
            );
            router.replace(`${pathname}?${query}`);
        }
    };

    return (
        <Select value={[status]} onValueChange={handleStatusChange}>
            <SelectTrigger>
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            'w-fit rounded-sm border p-1 text-white',
                            `bg-${status} text-${status}-foreground border-${status}-border`,
                        )}
                    >
                        {createElement(statusInfo.icon!, {
                            className: '!size-3',
                        })}
                    </div>
                    <div className="flex items-center gap-2">
                        <H5>{statusInfo.title_ua}</H5>
                        {pagination && (
                            <Label className="text-muted-foreground">
                                ({pagination.total})
                            </Label>
                        )}
                    </div>
                </div>
                <SelectIcon />
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {(
                            Object.keys(statuses) as (
                                | ReadStatusEnum
                                | WatchStatusEnum
                            )[]
                        ).map((o) => (
                            <SelectItem key={o} value={o}>
                                {STATUSES[o].title_ua}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default StatusCombobox;
