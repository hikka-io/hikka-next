'use client';

import { FC, PropsWithChildren, memo } from 'react';
import MaterialAnimatedImages from '~icons/material-symbols/animated-images';
import MaterialSymbolsMenuBookRounded from '~icons/material-symbols/menu-book-rounded';
import MaterialSymbolsPalette from '~icons/material-symbols/palette';
import MaterialSymbolsSecurity from '~icons/material-symbols/security';
import MaterialSymbolsShieldPerson from '~icons/material-symbols/shield-person';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

import FollowButton from '@/features/users/follow-button.component';

import useFollowStats from '@/services/hooks/follow/use-follow-stats';
import useReadStats from '@/services/hooks/read/use-read-stats';
import useUser from '@/services/hooks/user/use-user';
import useWatchStats from '@/services/hooks/watch/use-watch-stats';

import P from '../typography/p';
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
    const { data: user } = useUser({ username });
    const { data: followStats } = useFollowStats({ username });
    const { data: watchStats } = useWatchStats({ username });
    const { data: mangaStats } = useReadStats({
        username,
        content_type: 'manga',
    });
    const { data: novelStats } = useReadStats({
        username,
        content_type: 'novel',
    });

    if (!user && !followStats) {
        return (
            <div className="flex w-64 flex-col gap-4">
                <div className="flex animate-pulse flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-md bg-secondary/60" />
                            <div className="h-3 w-20 rounded-lg bg-secondary/60" />
                        </div>
                        <div className="size-9 rounded-md bg-secondary/60" />
                    </div>
                    <div className="h-3 w-full rounded-lg bg-secondary/60" />
                </div>
                <div className="flex animate-pulse gap-4">
                    <div className="h-3 w-24 rounded-lg bg-secondary/60" />
                    <div className="h-3 w-24 rounded-lg bg-secondary/60" />
                </div>
                <Separator className="-mx-4 w-auto animate-none" />
                <div className="flex animate-pulse gap-2">
                    <div className="h-4 w-1/3 rounded-lg bg-secondary/60" />
                    <div className="h-4 w-1/3 rounded-lg bg-secondary/60" />
                    <div className="h-4 w-1/3 rounded-lg bg-secondary/60" />
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
                                <div className="absolute -bottom-1 -right-1 z-[1] size-3 rounded-full border border-secondary bg-success" />
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
                                        <div className="rounded-sm border border-accent/60 bg-accent/30 p-1 text-xs font-bold text-accent-foreground">
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
                    <FollowButton
                        className="size-9 p-0"
                        username={username}
                        iconOnly
                    />
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
                    <Label className="text-xs text-muted-foreground">
                        {' '}
                        стежать
                    </Label>
                </span>
                <span className="font-bold">
                    {followStats ? followStats.following : 0}
                    <Label className="text-xs text-muted-foreground">
                        {' '}
                        відстежується
                    </Label>
                </span>
            </div>
            <Separator className="-mx-4 w-auto" />
            <div className="flex justify-between text-sm font-semibold">
                <div className="flex flex-1 items-center gap-2">
                    <MaterialAnimatedImages className="text-muted-foreground" />
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
