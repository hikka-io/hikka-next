'use client';

import { FC } from 'react';

import FollowButton from '@/components/follow-button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {
    user: API.User;
}

const FollowUserItem: FC<Props> = ({ user }) => {
    return (
        <HorizontalCard
            className="w-full px-6 py-4"
            href={`/u/${user.username}`}
        >
            <HorizontalCardImage image={user.avatar} imageRatio={1} />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{user.username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    {user.description}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            <FollowButton size="md" user={user} />
        </HorizontalCard>
    );
};

export default FollowUserItem;
