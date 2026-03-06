'use client';

import { FC, Fragment } from 'react';

import { useSettingsStore } from '@/services/stores/settings-store';
import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import WidgetCalendar from './widget-calendar';
import WidgetOngoing from './widget-ongoing';
import WidgetTracker from './widget-tracker';

const WIDGET_COMPONENTS: Record<string, FC> = {
    tracker: WidgetTracker,
    calendar: WidgetCalendar,
    ongoing: WidgetOngoing,
};

const WidgetList = () => {
    const { preferences } = useSettingsStore();

    const widgets =
        preferences.widgets.length > 0
            ? preferences.widgets
            : AVAILABLE_WIDGETS.map((w) => ({ id: w.id, visible: true }));

    return (
        <Card className="bg-secondary/20 backdrop-blur p-0 max-h-[calc(100vh-13rem)] overflow-y-auto gap-0">
            {widgets
                .filter((w) => w.visible)
                .map((widget, index) => {
                    const Component = WIDGET_COMPONENTS[widget.id];
                    if (!Component) return null;
                    return <Fragment key={widget.id}>
                        {index !== 0 && <div className='px-4'><Separator /></div>}
                        <Component />
                    </Fragment>;
                })}
        </Card>
    );
};

export default WidgetList;
