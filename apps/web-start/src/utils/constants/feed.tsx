import {
    ContentTypeEnum,
    FeedContentType,
    HomeWidgetsEnum,
} from '@hikka/client';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ReactElement } from 'react';

import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';

import { FeedFilterEnum } from '@/features/feed/types';

export const AVAILABLE_WIDGETS: readonly {
    id: HomeWidgetsEnum;
    title: string;
    description: string;
}[] = [
    {
        id: HomeWidgetsEnum.ONGOINGS,
        title: 'Онґоінґи',
        description: 'ТОП аніме онґоінґів сезону',
    },
    {
        id: HomeWidgetsEnum.SCHEDULE,
        title: 'Календар',
        description: 'Розклад виходу нових епізодів аніме',
    },
    {
        id: HomeWidgetsEnum.TRACKER,
        title: 'Мій список',
        description: 'Менеджер списків перегляду і читання',
    },
    {
        id: HomeWidgetsEnum.HISTORY,
        title: 'Активність',
        description: 'Активність користувачів, яких Ви відстежуєте',
    },
] as const;

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
