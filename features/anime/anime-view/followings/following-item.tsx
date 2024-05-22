import Link from 'next/link';
import React, { FC } from 'react';
import MaterialSymbolsStarRounded from '~icons/material-symbols/star-rounded';

import P from '@/components/typography/p';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

import { WATCH_STATUS } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface Props {
    data: {
        watch: API.Watch[];
    } & API.User;
    className?: string;
}

const FollowingItem: FC<Props> = ({ data, className }) => {
    return (
        <div className={cn('flex items-center gap-4', className)}>
            <Avatar className="size-10 rounded-md" asChild>
                <Link href={`/u/${data.username}`}>
                    <AvatarImage
                        className="size-10 rounded-md"
                        src={data.avatar}
                    />
                    <AvatarFallback className="size-10 rounded-md" />
                </Link>
            </Avatar>
            <div className="flex flex-1 flex-col gap-1">
                <Label asChild>
                    <Link href={`/u/${data.username}`}>{data.username}</Link>
                </Label>

                <P className="text-xs text-muted-foreground">
                    {WATCH_STATUS[data.watch[0].status].title_ua}
                </P>
            </div>
            {data.watch[0].score > 0 && (
                <div className="inline-flex gap-1">
                    <Label className="leading-normal">
                        {data.watch[0].score}
                    </Label>
                    <MaterialSymbolsStarRounded />
                </div>
            )}
        </div>
    );
};

export default FollowingItem;
