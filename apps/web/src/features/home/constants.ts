import type { ComponentType, FC } from 'react';

import {
    Activity,
    CalendarDays,
    Flame,
    List,
    Play,
    Rss,
    User,
} from 'lucide-react';

import type { UiFeedWidget } from '@hikka/api';

import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';

import {
    ArticlesWidget,
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

/** Slugs this app renders; excludes server-only `top_anime`, which has no widget yet. */
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
    | 'articles'
>;

export type WidgetProps = {
    side: UIFeedWidgetSide;
    isLast?: boolean;
};

export interface WidgetMeta {
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    component: FC<WidgetProps>;
    authRequired: boolean;
    defaultSide: UIFeedWidgetSide;
}

export const WIDGET_REGISTRY: Record<SupportedWidgetSlug, WidgetMeta> = {
    profile: {
        title: 'Профіль',
        description: 'Профіль та статистика підписок',
        icon: User,
        component: ProfileWidget,
        authRequired: false,
        defaultSide: 'left',
    },
    list: {
        title: 'Список',
        description: 'Статистика списків перегляду та читання',
        icon: List,
        component: ListWidget,
        authRequired: true,
        defaultSide: 'right',
    },
    ongoings: {
        title: 'Онґоїнґи',
        description: 'ТОП аніме онґоїнґів сезону',
        icon: Flame,
        component: OngoingsWidget,
        authRequired: false,
        defaultSide: 'center',
    },
    tracker: {
        title: 'Дивлюсь/читаю',
        description: 'Менеджер списків перегляду і читання',
        icon: Play,
        component: TrackerWidget,
        authRequired: true,
        defaultSide: 'left',
    },
    history: {
        title: 'Активність',
        description: 'Активність користувачів, яких Ви відстежуєте',
        icon: Activity,
        component: HistoryWidget,
        authRequired: true,
        defaultSide: 'left',
    },
    schedule: {
        title: 'Календар',
        description: 'Розклад виходу нових епізодів аніме',
        icon: CalendarDays,
        component: ScheduleWidget,
        authRequired: false,
        defaultSide: 'right',
    },
    feed: {
        title: 'Стрічка',
        description: 'Стрічка новин спільноти',
        icon: Rss,
        component: FeedWidget,
        authRequired: false,
        defaultSide: 'center',
    },
    collections: {
        title: 'Колекції',
        description: 'Добірки тайтлів від спільноти',
        icon: MaterialSymbolsStack,
        component: CollectionsWidget,
        authRequired: false,
        defaultSide: 'right',
    },
    articles: {
        title: 'Статті',
        description: 'Статті та огляди від спільноти',
        icon: MaterialSymbolsDynamicFeedRounded,
        component: ArticlesWidget,
        authRequired: false,
        defaultSide: 'left',
    },
};

export const ALL_WIDGET_SLUGS = Object.keys(
    WIDGET_REGISTRY,
) as SupportedWidgetSlug[];
