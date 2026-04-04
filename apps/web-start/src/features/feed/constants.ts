import { UIFeedWidgetSide, UIFeedWidgetSlug } from '@hikka/client';
import { FC } from 'react';

import {
    FeedWidget,
    HistoryWidget,
    ListWidget,
    OngoingsWidget,
    ProfileWidget,
    ScheduleWidget,
    TrackerWidget,
} from './widgets';

export interface WidgetProps {
    side: UIFeedWidgetSide;
}

export interface WidgetMeta {
    title: string;
    description: string;
    component: FC<WidgetProps>;
    authRequired: boolean;
    defaultSide: UIFeedWidgetSide;
}

export const WIDGET_REGISTRY: Record<UIFeedWidgetSlug, WidgetMeta> = {
    profile: {
        title: 'Профіль',
        description: 'Профіль та статистика підписок',
        component: ProfileWidget,
        authRequired: false,
        defaultSide: 'left',
    },
    list: {
        title: 'Список',
        description: 'Статистика списків перегляду та читання',
        component: ListWidget,
        authRequired: true,
        defaultSide: 'right',
    },
    ongoings: {
        title: 'Онґоінґи',
        description: 'ТОП аніме онґоінґів сезону',
        component: OngoingsWidget,
        authRequired: false,
        defaultSide: 'center',
    },
    tracker: {
        title: 'Дивлюсь/читаю',
        description: 'Менеджер списків перегляду і читання',
        component: TrackerWidget,
        authRequired: true,
        defaultSide: 'left',
    },
    history: {
        title: 'Активність',
        description: 'Активність користувачів, яких Ви відстежуєте',
        component: HistoryWidget,
        authRequired: true,
        defaultSide: 'left',
    },
    schedule: {
        title: 'Календар',
        description: 'Розклад виходу нових епізодів аніме',
        component: ScheduleWidget,
        authRequired: false,
        defaultSide: 'right',
    },
    feed: {
        title: 'Стрічка',
        description: 'Стрічка новин спільноти',
        component: FeedWidget,
        authRequired: false,
        defaultSide: 'center',
    },
};

export const ALL_WIDGET_SLUGS = Object.keys(
    WIDGET_REGISTRY,
) as UIFeedWidgetSlug[];
