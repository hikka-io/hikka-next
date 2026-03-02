import { ContentTypeEnum } from '@hikka/client';
import { MessageSquare, Sparkles } from 'lucide-react';
import { ReactElement } from 'react';

import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';

import { FeedFilterEnum } from '@/features/feed/types';

export const AVAILABLE_WIDGETS = [
    { id: 'watching', title: 'Дивлюсь' },
    { id: 'calendar', title: 'Календар' },
] as const;

export const FEED_FILTER_OPTIONS: Record<
    FeedFilterEnum,
    {
        label: string;
        data_type?: ContentTypeEnum;
        icon?: (props: any) => ReactElement;
    }
> = {
    [FeedFilterEnum.ALL]: { label: 'Усі', icon: () => <Sparkles /> },
    [FeedFilterEnum.COMMENTS]: {
        label: 'Коментарі',
        data_type: ContentTypeEnum.COMMENT,
        icon: () => <MessageSquare />,
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
    [FeedFilterEnum.ACTIVITY]: {
        label: 'Активність',
        data_type: ContentTypeEnum.HISTORY,
        icon: () => <MaterialSymbolsCalendarClockRounded />,
    },
};
