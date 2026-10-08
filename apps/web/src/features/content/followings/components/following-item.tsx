import type { FC } from 'react';

import type {
    ReadResponseBase,
    UserResponse,
    WatchResponseBase,
} from '@hikka/api';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { LIST_STATUS } from '@/utils/labels';

type Props = {
    data: {
        type: 'read' | 'watch';
        content: ReadResponseBase[] | WatchResponseBase[];
    } & UserResponse;
    className?: string;
};

const FollowingItem: FC<Props> = ({ data, className }) => {
    const status =
        LIST_STATUS[data.type][
            data.content[0]
                .status as keyof (typeof LIST_STATUS)[typeof data.type]
        ];

    const progress =
        data.type === 'read'
            ? (data.content[0] as ReadResponseBase).chapters
            : (data.content[0] as WatchResponseBase).episodes;

    const hiddenProgressStatuses: string[] = ['completed', 'planned'];

    const progressLabel =
        progress > 0 && !hiddenProgressStatuses.includes(data.content[0].status)
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
