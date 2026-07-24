import type { FC } from 'react';

import type {
    ReadResponseBase,
    ReadStatusEnum,
    UserResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/api';

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

type Props = {
    data: {
        type: 'read' | 'watch';
        content: ReadResponseBase[] | WatchResponseBase[];
    } & UserResponse;
    className?: string;
};

const FollowingItem: FC<Props> = ({ data, className }) => {
    const status =
        data.type === 'read'
            ? READ_STATUS[data.content[0].status as ReadStatusEnum]
            : WATCH_STATUS[data.content[0].status as WatchStatusEnum];

    const progress =
        data.type === 'read'
            ? (data.content[0] as ReadResponseBase).chapters
            : (data.content[0] as WatchResponseBase).episodes;

    const hiddenProgressStatuses: string[] = ['completed', 'planned'];

    const progressLabel =
        progress > 0 &&
        !hiddenProgressStatuses.includes(data.content[0].status)
            ? `${progress} ${data.type === 'read' ? 'розд.' : 'еп.'}`
            : null;

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
                    {progressLabel && (
                        <>
                            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                            {progressLabel}
                        </>
                    )}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {data.content[0].score > 0 && (
                <Badge variant="outline" className="gap-1">
                    {data.content[0].score}
                    <MaterialSymbolsStarRounded className="size-4 text-yellow-400" />
                </Badge>
            )}
        </HorizontalCard>
    );
};

export default FollowingItem;
