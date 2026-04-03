import { ContentTypeEnum, FeedContentType } from '@hikka/client';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ReactElement } from 'react';

import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';

import { FeedFilterEnum } from '@/features/feed/types';

export const FEED_FILTER_OPTIONS: Record<
    FeedFilterEnum,
    {
        label: string;
        data_type?: FeedContentType;
        icon?: (props: any) => ReactElement;
    }
> = {
    [FeedFilterEnum.ALL]: { label: 'Усі', icon: () => <Sparkles /> },
    [FeedFilterEnum.COMMENTS]: {
        label: 'Коментарі',
        data_type: ContentTypeEnum.COMMENT,
        icon: () => <MessageCircle />,
    },
    [FeedFilterEnum.ARTICLES]: {
        label: 'Статті',
        data_type: ContentTypeEnum.ARTICLE,
        icon: () => <MaterialSymbolsDynamicFeedRounded />,
    },
    [FeedFilterEnum.COLLECTIONS]: {
        label: 'Колекції',
        data_type: ContentTypeEnum.COLLECTION,
        icon: () => <MaterialSymbolsStack />,
    },
};
