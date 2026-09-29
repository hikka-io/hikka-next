import type { FC } from 'react';

import type { FollowUserResponse } from '@hikka/api';

import FollowButton from '@/components/action-buttons/follow-button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import MDViewer from '@/components/markdown/viewer/md-viewer';

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
                <MDViewer
                    className="prose-inline line-clamp-1 text-muted-foreground text-xs!"
                    preview
                >
                    {user.description}
                </MDViewer>
            </HorizontalCardContainer>
            <FollowButton size="md" user={user} />
        </HorizontalCard>
    );
};

export default FollowUserItem;
