import {
    ReadResponseBase,
    ReadStatusEnum,
    UserResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/client';
import { FC } from 'react';

import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

interface Props {
    data: {
        type: 'read' | 'watch';
        content: ReadResponseBase[] | WatchResponseBase[];
    } & UserResponse;
    className?: string;
}

const FollowingItem: FC<Props> = ({ data, className }) => {
    const status =
        data.type === 'read'
            ? READ_STATUS[data.content[0].status as ReadStatusEnum]
            : WATCH_STATUS[data.content[0].status as WatchStatusEnum];

    return (
        <HorizontalCard className={className}>
            <HorizontalCardImage
                className="w-10"
                image={data.avatar}
                imageRatio={1}
                href={`/u/${data.username}`}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle href={`/u/${data.username}`}>
                    {data.username}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    {status.title_ua}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {data.content[0].score > 0 && (
                <Badge variant="outline" className="gap-1">
                    {data.content[0].score}
                    <MaterialSymbolsStarRounded className="text-yellow-400 size-4" />
                </Badge>
            )}
        </HorizontalCard>
    );
};

export default FollowingItem;
