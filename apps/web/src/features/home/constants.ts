import type { FC } from 'react';

import type { UiFeedWidget } from '@hikka/api';

import {
    CollectionsWidget,
    FeedWidget,
    HistoryWidget,
    ListWidget,
    OngoingsWidget,
    ProfileWidget,
    ScheduleWidget,
    TrackerWidget,
} from './widgets';

type UIFeedWidgetSide = UiFeedWidget['side'];

/**
 * The slugs this app actually renders. The generated `UiFeedWidget['slug']`
 * union also includes server-side slugs (`top_anime`, `articles`) that have
 * no widget implementation yet.
 */
export type SupportedWidgetSlug = Extract<
    UiFeedWidget['slug'],
    | 'profile'
    | 'list'
    | 'ongoings'
    | 'tracker'
    | 'history'
    | 'schedule'
    | 'feed'
    | 'collections'
>;

export type WidgetProps = {
    side: UIFeedWidgetSide;
    isLast?: boolean;
};

export interface WidgetMeta {
    title: string;
    description: string;
    component: FC<WidgetProps>;
    authRequired: boolean;
    defaultSide: UIFeedWidgetSide;
}

export const WIDGET_REGISTRY: Record<SupportedWidgetSlug, WidgetMeta> = {
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
        title: 'Онґоїнґи',
        description: 'ТОП аніме онґоїнґів сезону',
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
    collections: {
        title: 'Колекції',
        description: 'Добірки тайтлів від спільноти',
        component: CollectionsWidget,
        authRequired: false,
        defaultSide: 'right',
    },
};

export const ALL_WIDGET_SLUGS = Object.keys(
    WIDGET_REGISTRY,
) as SupportedWidgetSlug[];
