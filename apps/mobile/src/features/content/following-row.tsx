import type { FC } from 'react';

import { Star } from 'lucide-react-native';
import { View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

import { type FollowingUser, followingSummary } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

type Props = {
    user: FollowingUser;
};

/** The web's `FollowingItem`: a followed user, their list status and progress, and their score. */
const FollowingRow: FC<Props> = ({ user }) => {
    const { color: starColor } = useResolveClassNames('text-yellow-400');
    const summary = followingSummary(user);
    const username = user.username ?? '';

    if (!summary) return null;

    return (
        <HorizontalCard
            href={`/u/${username}`}
            className="px-4 py-3"
            accessibilityLabel={[
                username,
                summary.status,
                summary.progress,
                summary.score > 0 ? `оцінка ${summary.score}` : null,
            ]
                .filter(Boolean)
                .join(', ')}
        >
            <Avatar className="size-10 rounded-lg">
                <AvatarImage src={user.avatar} alt={username} size={40} />
                <AvatarFallback className="rounded-lg">
                    {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle>{username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    {summary.status}
                    {summary.progress ? (
                        <View className="size-1 rounded-full bg-muted-foreground" />
                    ) : null}
                    {summary.progress}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {summary.score > 0 ? (
                <Badge variant="outline" className="gap-1 self-center">
                    {String(summary.score)}
                    <Icon
                        as={Star}
                        fill={
                            typeof starColor === 'string'
                                ? starColor
                                : undefined
                        }
                        className="size-3.5 text-yellow-400"
                    />
                </Badge>
            ) : null}
        </HorizontalCard>
    );
};

export const FollowingRowSkeleton: FC = () => (
    <View className="min-h-14 flex-row items-center gap-4 px-4 py-3">
        <Skeleton className="size-10 rounded-lg" />
        <View className="flex-1 gap-1">
            <SkeletonText
                className="font-medium text-sm leading-tight"
                barClassName="w-1/3"
            />
            <SkeletonText className="text-xs" barClassName="w-1/2" />
        </View>
        <Skeleton className="h-5.5 w-11 rounded-sm" />
    </View>
);

export default FollowingRow;
