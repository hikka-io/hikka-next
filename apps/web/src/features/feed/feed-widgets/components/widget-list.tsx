'use client';

import { FC } from 'react';

import { useSettingsStore } from '@/services/stores/settings-store';
import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import WidgetCalendar from './widget-calendar';
import WidgetTracker from './widget-tracker';

const WIDGET_COMPONENTS: Record<string, FC> = {
    tracker: WidgetTracker,
    calendar: WidgetCalendar,
};

const WidgetList = () => {
    const { preferences } = useSettingsStore();

    const widgets =
        preferences.widgets.length > 0
            ? preferences.widgets
            : AVAILABLE_WIDGETS.map((w) => ({ id: w.id, visible: true }));

    return (
        <Card className="bg-secondary/20 backdrop-blur max-h-[calc(100vh-10rem)] overflow-y-auto">
            {widgets
                .filter((w) => w.visible)
                .map((widget, index) => {
                    const Component = WIDGET_COMPONENTS[widget.id];
                    if (!Component) return null;
                    return <>
                        {index !== 0 && <Separator />}
                        <Component key={widget.id} />
                    </>;
                })}
        </Card>
    );
};

export default WidgetList;
