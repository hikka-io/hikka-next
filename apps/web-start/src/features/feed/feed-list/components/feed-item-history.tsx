import { HistoryResponse } from '@hikka/client';
import { FC } from 'react';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { convertActivity } from '@/utils/adapters/convert-activity';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    data: HistoryResponse;
}

const FeedItemHistory: FC<Props> = ({ data }) => {
    const activity = convertActivity(data);

    const contentHref = data.content
        ? `${CONTENT_TYPE_LINKS[data.content.data_type]}/${data.content.slug}`
        : undefined;

    return (
        <HorizontalCard className="p-4 py-0">
            <HorizontalCardImage
                image={
                    data.content?.image || (
                        <MaterialSymbolsInfoRounded className="text-muted-foreground flex-1 text-xl" />
                    )
                }
                to={contentHref}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle to={contentHref}>
                    {data.content?.title || 'Загальне'}
                </HorizontalCardTitle>
                {activity.length > 0 && (
                    <HorizontalCardDescription className="line-clamp-2">
                        {activity.join(', ')}
                    </HorizontalCardDescription>
                )}
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default FeedItemHistory;
