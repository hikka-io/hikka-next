import { ReadResponseBase, UserResponse } from '@hikka/client';
import { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { Label } from '@/components/ui/label';

import { READ_STATUS } from '@/utils/constants/common';

import MaterialSymbolsStarRounded from '../../components/icons/material-symbols/MaterialSymbolsStarRounded';

interface Props {
    data: {
        read: ReadResponseBase[];
    } & UserResponse;
    className?: string;
}

const FollowingReadItem: FC<Props> = ({ data, className }) => {
    return (
        <HorizontalCard href={`/u/${data.username}`} className={className}>
            <HorizontalCardImage image={data.avatar} imageRatio={1} />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{data.username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    {READ_STATUS[data.read[0].status].title_ua}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {data.read[0].score > 0 && (
                <div className="inline-flex gap-1">
                    <Label className="leading-normal">
                        {data.read[0].score}
                    </Label>
                    <MaterialSymbolsStarRounded />
                </div>
            )}
        </HorizontalCard>
    );
};

export default FollowingReadItem;
