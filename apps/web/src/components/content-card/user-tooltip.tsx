'use client';

import { ContentTypeEnum } from '@hikka/client';
import {
    useReadStats,
    useUserByUsername,
    useUserFollowStats,
    useUserWatchStats,
} from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import FollowButton from '../follow-button';
import MaterialSymbolsAnimatedImages from '../icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsMenuBookRounded from '../icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '../icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsSecurity from '../icons/material-symbols/MaterialSymbolsSecurity';
import MaterialSymbolsShieldPerson from '../icons/material-symbols/MaterialSymbolsShieldPerson';
import MDViewer from '../markdown/viewer/MD-viewer';
import P from '../typography/p';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '../ui/hover-card';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TooltipDataProps {
    username: string;
}

interface Props extends PropsWithChildren {
    username?: string;
    withTrigger?: boolean;
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
        return (
            <div className="flex w-64 flex-col gap-4">
                <div className="flex animate-pulse flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-secondary/20 size-10 rounded-md" />
                            <div className="bg-secondary/20 h-3 w-20 rounded-lg" />
                        </div>
                        <div className="bg-secondary/20 size-9 rounded-md" />
                    </div>
                    <div className="bg-secondary/20 h-3 w-full rounded-lg" />
                </div>
                <div className="flex animate-pulse gap-4">
                    <div className="bg-secondary/20 h-3 w-24 rounded-lg" />
                    <div className="bg-secondary/20 h-3 w-24 rounded-lg" />
                </div>
                <Separator className="-mx-4 w-auto animate-none" />
                <div className="flex animate-pulse gap-2">
                    <div className="bg-secondary/20 h-4 w-1/3 rounded-lg" />
                    <div className="bg-secondary/20 h-4 w-1/3 rounded-lg" />
                    <div className="bg-secondary/20 h-4 w-1/3 rounded-lg" />
                </div>
            </div>
        );
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
                                <div className="border-border bg-success absolute -bottom-1 -right-1 z-[1] size-3 rounded-full border" />
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
                                        <div className="border-border bg-secondary/20 text-accent-foreground rounded-sm border p-1 text-xs font-bold">
                                            {user.role === 'admin' && (
                                                <MaterialSymbolsSecurity className="text-[#d0bfff]" />
                                            )}
                                            {user.role === 'moderator' && (
                                                <MaterialSymbolsShieldPerson className="text-[#ffc9c9]" />
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <P className="text-sm">
                                            {user.role === 'admin'
                                                ? 'Адміністратор'
                                                : 'Модератор'}
                                        </P>
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
                        className="text-muted-foreground line-clamp-1 text-xs"
                    >
                        {user.description}
                    </MDViewer>
                )}
            </div>
            <div className="flex gap-4 text-xs">
                <span className="font-bold">
                    {followStats ? followStats.followers : 0}
                    <Label className="text-muted-foreground text-xs">
                        {' '}
                        стежать
                    </Label>
                </span>
                <span className="font-bold">
                    {followStats ? followStats.following : 0}
                    <Label className="text-muted-foreground text-xs">
                        {' '}
                        відстежується
                    </Label>
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

const UserTooltip: FC<Props> = ({
    username,
    children,
    withTrigger,
    ...props
}) => {
    if (!username) return null;

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent
                    side="right"
                    className="hidden min-w-min flex-col gap-4 p-4 md:flex"
                >
                    <HoverCardArrow />
                    <TooltipData username={username} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(UserTooltip);
