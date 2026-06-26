import type { ComponentProps, FC } from 'react';

import type { FollowUserResponse } from '@hikka/api';

import FollowButton from '@/components/action-buttons/follow-button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

type Props = {
    user: FollowUserResponse;
};

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
            <FollowButton
                size="md"
                user={
                    // TODO(phase2): drop cast once action-buttons is on @hikka/api
                    user as unknown as ComponentProps<typeof FollowButton>['user']
                }
            />
        </HorizontalCard>
    );
};

export default FollowUserItem;
