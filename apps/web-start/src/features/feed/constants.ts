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
        authRequired: true,
        defaultSide: 'left',
    },
    list: {
        title: 'Список',
        description: 'Статистика списків перегляду та читання',
        component: ListWidget,
        authRequired: true,
        defaultSide: 'left',
    },
    feed: {
        title: 'Стрічка',
        description: 'Стрічка новин спільноти',
        component: FeedWidget,
        authRequired: false,
        defaultSide: 'center',
    },
    tracker: {
        title: 'Мій список',
        description: 'Менеджер списків перегляду і читання',
        component: TrackerWidget,
        authRequired: true,
        defaultSide: 'right',
    },
    history: {
        title: 'Активність',
        description: 'Активність користувачів, яких Ви відстежуєте',
        component: HistoryWidget,
        authRequired: true,
        defaultSide: 'right',
    },
    ongoings: {
        title: 'Онґоінґи',
        description: 'ТОП аніме онґоінґів сезону',
        component: OngoingsWidget,
        authRequired: false,
        defaultSide: 'right',
    },
    schedule: {
        title: 'Календар',
        description: 'Розклад виходу нових епізодів аніме',
        component: ScheduleWidget,
        authRequired: false,
        defaultSide: 'right',
    },
};

export const ALL_WIDGET_SLUGS = Object.keys(
    WIDGET_REGISTRY,
) as UIFeedWidgetSlug[];
