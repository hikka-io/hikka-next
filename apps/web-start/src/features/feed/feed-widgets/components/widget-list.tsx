'use client';

import { useSession } from '@hikka/react';
import { FC, useEffect, useRef } from 'react';

import { useSettingsStore } from '@/services/stores/settings-store';
import { cn } from '@/utils/cn';
import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

import WidgetCalendar from './widget-calendar';
import WidgetOngoing from './widget-ongoing';
import WidgetTracker from './widget-tracker';

const WIDGET_COMPONENTS: Record<string, FC> = {
    ongoings: WidgetOngoing,
    calendar: WidgetCalendar,
    tracker: WidgetTracker,
};

const WidgetList = () => {
    const { preferences, _hasHydrated } = useSettingsStore();
    const { user } = useSession();
    const containerRef = useRef<HTMLDivElement>(null);

    const widgets =
        preferences.widgets.length > 0
            ? preferences.widgets
            : AVAILABLE_WIDGETS.map((w) => ({ id: w.id, visible: true }));

    const availableWidgetMap = new Map<
        string,
        (typeof AVAILABLE_WIDGETS)[number]
    >(AVAILABLE_WIDGETS.map((w) => [w.id, w]));

    const visibleWidgets = widgets.filter((w) => {
        if (!w.visible) return false;

        const config = availableWidgetMap.get(w.id);
        if (config?.auth && !user) return false;

        return true;
    });

    useEffect(() => {
        if (_hasHydrated && containerRef.current) {
            containerRef.current.scrollTo({ left: 0 });
        }
    }, [_hasHydrated]);

    return (
        <div
            ref={containerRef}
            className={cn(
                'flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto no-scrollbar',
                'lg:flex-col lg:snap-none lg:overflow-visible px-4 lg:px-0',
            )}
        >
            {visibleWidgets.map((widget) => {
                const Component = WIDGET_COMPONENTS[widget.id];
                if (!Component) return null;
                return (
                    <div
                        key={widget.id}
                        className="w-full shrink-0 snap-center overflow-hidden"
                    >
                        <Component />
                    </div>
                );
            })}
        </div>
    );
};

export default WidgetList;
