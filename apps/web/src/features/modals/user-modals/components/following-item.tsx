import {
    ReadResponseBase,
    ReadStatusEnum,
    UserResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/client';
import { FC } from 'react';

import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { Label } from '@/components/ui/label';

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
        <HorizontalCard href={`/u/${data.username}`} className={className}>
            <HorizontalCardImage image={data.avatar} imageRatio={1} />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{data.username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    {status.title_ua}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {data.content[0].score > 0 && (
                <div className="inline-flex items-center gap-1">
                    <Label className="font-bold">{data.content[0].score}</Label>
                    <MaterialSymbolsStarRounded className="text-yellow-400" />
                </div>
            )}
        </HorizontalCard>
    );
};

export default FollowingItem;
