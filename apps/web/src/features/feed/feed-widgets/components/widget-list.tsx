'use client';

import { FC } from 'react';

import { useSettingsStore } from '@/services/stores/settings-store';
import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

import WidgetCalendar from './widget-calendar';
import WidgetWatching from './widget-watching';

const WIDGET_COMPONENTS: Record<string, FC> = {
    watching: WidgetWatching,
    calendar: WidgetCalendar,
};

const WidgetList = () => {
    const { preferences } = useSettingsStore();

    const widgets =
        preferences.widgets.length > 0
            ? preferences.widgets
            : AVAILABLE_WIDGETS.map((w) => ({ id: w.id, visible: true }));

    return (
        <>
            {widgets
                .filter((w) => w.visible)
                .map((widget) => {
                    const Component = WIDGET_COMPONENTS[widget.id];
                    if (!Component) return null;
                    return <Component key={widget.id} />;
                })}
        </>
    );
};

export default WidgetList;
