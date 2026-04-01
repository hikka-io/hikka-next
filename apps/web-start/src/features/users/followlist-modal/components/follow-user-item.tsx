'use client';

import { UserResponse } from '@hikka/client';
import { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import FollowButton from '@/features/common/follow-button';

interface Props {
    user: UserResponse;
}

const FollowUserItem: FC<Props> = ({ user }) => {
    return (
        <HorizontalCard>
            <HorizontalCardImage
                image={user.avatar}
                imageRatio={1}
                href={`/u/${user.username}`}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle href={`/u/${user.username}`}>
                    {user.username}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    {user.description}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            <FollowButton size="md" user={user} />
        </HorizontalCard>
    );
};

export default FollowUserItem;
