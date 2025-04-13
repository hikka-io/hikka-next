import { FC } from 'react';

import { WATCH_STATUS } from '@/utils/constants/common';
import MaterialSymbolsStarRounded from '../../components/icons/material-symbols/MaterialSymbolsStarRounded';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '../../components/ui/horizontal-card';
import { Label } from '../../components/ui/label';

interface Props {
    data: {
        watch: API.Watch[];
    } & API.User;
    className?: string;
}

const FollowingWatchItem: FC<Props> = ({ data, className }) => {
    return (
        <HorizontalCard href={`/u/${data.username}`} className={className}>
            <HorizontalCardImage image={data.avatar} imageRatio={1} />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{data.username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    {WATCH_STATUS[data.watch[0].status].title_ua}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {data.watch[0].score > 0 && (
                <div className="inline-flex gap-1">
                    <Label className="leading-normal">
                        {data.watch[0].score}
                    </Label>
                    <MaterialSymbolsStarRounded />
                </div>
            )}
        </HorizontalCard>
    );
};

export default FollowingWatchItem;
