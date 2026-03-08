'use client';

import { ContentTypeEnum } from '@hikka/client';
import {
    useReadStats,
    useUserByUsername,
    useUserFollowStats,
    useUserWatchStats,
} from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { FollowButton } from '@/features/common';
import MaterialSymbolsAnimatedImages from '../../icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsMenuBookRounded from '../../icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '../../icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsSecurity from '../../icons/material-symbols/MaterialSymbolsSecurity';
import MaterialSymbolsShieldPerson from '../../icons/material-symbols/MaterialSymbolsShieldPerson';
import MDViewer from '../../markdown/viewer/MD-viewer';

import HoverCardWrapper from './hover-card-wrapper';
import { UserTooltipSkeleton } from './tooltip-skeleton';

interface TooltipDataProps {
    username: string;
}

interface Props extends PropsWithChildren {
    username?: string;
}

const TooltipData: FC<TooltipDataProps> = ({ username }) => {
    const { data: user } = useUserByUsername({ username });
    const { data: followStats } = useUserFollowStats({ username });
    const { data: watchStats } = useUserWatchStats({ username });
    const { data: mangaStats } = useReadStats({
        username,
        contentType: ContentTypeEnum.MANGA,
    });
    const { data: novelStats } = useReadStats({
        username,
        contentType: ContentTypeEnum.NOVEL,
    });

    if (!user && !followStats) {
        return <UserTooltipSkeleton />;
    }

    return (
        <div className="flex w-64 flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="relative">
                            <Avatar className="rounded-md">
                                <AvatarImage
                                    className="rounded-md"
                                    src={user?.avatar}
                                />
                                <AvatarFallback className="rounded-md">
                                    {username[0]}
                                </AvatarFallback>
                            </Avatar>
                            {user?.active && (
                                <div className="absolute -bottom-1 -right-1 z-[1] size-3 rounded-full border border-border bg-success-foreground" />
                            )}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <h4 className="text-sm font-semibold">
                                {username}
                            </h4>
                            {(user?.role === 'admin' ||
                                user?.role === 'moderator') && (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <div className="rounded-sm border border-border bg-secondary/20 p-1 text-xs font-bold backdrop-blur">
                                            {user.role === 'admin' && (
                                                <MaterialSymbolsSecurity className="text-[#d0bfff]" />
                                            )}
                                            {user.role === 'moderator' && (
                                                <MaterialSymbolsShieldPerson className="text-[#ffc9c9]" />
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            {user.role === 'admin'
                                                ? 'Адміністратор'
                                                : 'Модератор'}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <FollowButton user={user} className="size-9 p-0" iconOnly />
                </div>
                {user?.description && (
                    <MDViewer
                        preview
                        className="line-clamp-1 text-xs text-muted-foreground"
                    >
                        {user.description}
                    </MDViewer>
                )}
            </div>
            <div className="flex gap-4 text-xs">
                <span className="font-bold">
                    {followStats ? followStats.followers : 0}
                    <span className="text-xs font-medium leading-tight text-muted-foreground">
                        {' '}
                        стежать
                    </span>
                </span>
                <span className="font-bold">
                    {followStats ? followStats.following : 0}
                    <span className="text-xs font-medium leading-tight text-muted-foreground">
                        {' '}
                        відстежується
                    </span>
                </span>
            </div>
            <Separator className="-mx-4 w-auto" />
            <div className="flex justify-between text-sm font-semibold">
                <div className="flex flex-1 items-center gap-2">
                    <MaterialSymbolsAnimatedImages className="text-muted-foreground" />
                    {watchStats?.completed}
                </div>
                <div className="flex flex-1 items-center gap-2">
                    <MaterialSymbolsPalette className="text-muted-foreground" />
                    {mangaStats?.completed}
                </div>
                <div className="flex flex-1 items-center gap-2">
                    <MaterialSymbolsMenuBookRounded className="text-muted-foreground" />
                    {novelStats?.completed}
                </div>
            </div>
        </div>
    );
};

const UserTooltip: FC<Props> = ({ username, children }) => {
    if (!username) return null;

    return (
        <HoverCardWrapper
            size="auto"
            content={<TooltipData username={username} />}
        >
            {children}
        </HoverCardWrapper>
    );
};

export default memo(UserTooltip);
