import type { FC } from 'react';

import { View } from 'react-native';

import type { FollowUserResponse } from '@hikka/api';
import { parseTextFromMarkDown } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import FollowButton from './follow-button';

type Props = {
    user: FollowUserResponse;
};

/** The web's `FollowUserItem`: avatar, name and the first line of the bio, follow action outside the row. */
const FollowUserRow: FC<Props> = ({ user }) => {
    const username = user.username ?? '';
    const bio = parseTextFromMarkDown(user.description ?? '');

    return (
        <HorizontalCard
            href={`/u/${username}`}
            className="px-4 py-2"
            action={<FollowButton user={user} size="sm" />}
        >
            <Avatar className="size-12">
                <AvatarImage src={user.avatar} alt={username} size={48} />
                <AvatarFallback>
                    {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle className="text-base">
                    {username}
                </HorizontalCardTitle>
                {bio ? (
                    <HorizontalCardDescription>{bio}</HorizontalCardDescription>
                ) : null}
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export const FollowUserRowSkeleton: FC = () => (
    <View className="min-h-16 flex-row items-center gap-4 px-4 py-2">
        <Skeleton className="size-12 rounded-full" />
        <View className="flex-1 gap-1">
            <SkeletonText
                className="font-medium text-base leading-tight"
                barClassName="w-1/3"
            />
            <SkeletonText className="text-xs" barClassName="w-2/3" />
        </View>
    </View>
);

export default FollowUserRow;
