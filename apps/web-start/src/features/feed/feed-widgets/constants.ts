import { HomeWidgetsEnum } from '@hikka/client';
import { FC } from 'react';

import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

import WidgetCalendar from './components/widget-calendar';
import WidgetHistory from './components/widget-history';
import WidgetOngoing from './components/widget-ongoing';
import WidgetTracker from './components/widget-tracker';

export const WIDGET_COMPONENTS: Record<HomeWidgetsEnum, FC> = {
    [HomeWidgetsEnum.ONGOINGS]: WidgetOngoing,
    [HomeWidgetsEnum.SCHEDULE]: WidgetCalendar,
    [HomeWidgetsEnum.TRACKER]: WidgetTracker,
    [HomeWidgetsEnum.HISTORY]: WidgetHistory,
};

export const DEFAULT_HOME_WIDGETS = AVAILABLE_WIDGETS.map((w) => w.id);
