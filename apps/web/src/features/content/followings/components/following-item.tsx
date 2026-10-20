import type { FC } from 'react';

import { type FollowingUser, followingSummary } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';

type Props = {
    user: FollowingUser;
    className?: string;
};

const FollowingItem: FC<Props> = ({ user, className }) => {
    const summary = followingSummary(user);

    if (!summary) return null;

    return (
        <HorizontalCard className={className}>
            <HorizontalCardImage
                className="w-10"
                image={user.avatar}
                imageRatio={1}
                href={`/u/${user.username}`}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle href={`/u/${user.username}`}>
                    {user.username}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    {summary.status}
                    {summary.progress && (
                        <>
                            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                            {summary.progress}
                        </>
                    )}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {summary.score > 0 && (
                <Badge variant="outline" className="gap-1">
                    {summary.score}
                    <MaterialSymbolsStarRounded className="size-4 text-yellow-400" />
                </Badge>
            )}
        </HorizontalCard>
    );
};

export default FollowingItem;
