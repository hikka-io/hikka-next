'use client';

import { UserResponse } from '@hikka/client';
import { FC } from 'react';

import FollowButton from '@/features/common/follow-button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {
    user: UserResponse;
}

const FollowUserItem: FC<Props> = ({ user }) => {
    return (
        <HorizontalCard
            className="w-full px-6 py-4"
        >
            <HorizontalCardImage image={user.avatar} imageRatio={1} href={`/u/${user.username}`} />
            <HorizontalCardContainer>
                <HorizontalCardTitle href={`/u/${user.username}`}>{user.username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    {user.description}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            <FollowButton size="md" user={user} />
        </HorizontalCard>
    );
};

export default FollowUserItem;
