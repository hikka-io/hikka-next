'use client';

import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { useSettingsStore } from '@/services/stores/settings-store';
import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

import { cn } from '@/utils/cn';
import { useSession } from '@hikka/react';
import WidgetCalendar from './widget-calendar';
import WidgetOngoing from './widget-ongoing';
import WidgetTracker from './widget-tracker';

const WIDGET_COMPONENTS: Record<string, FC> = {
    ongoings: WidgetOngoing,
    calendar: WidgetCalendar,
    tracker: WidgetTracker,
};

const WidgetList = forwardRef<HTMLDivElement>((_, ref) => {
    const { preferences, _hasHydrated } = useSettingsStore();
    const { user } = useSession();
    const containerRef = useRef<HTMLDivElement>(null);

    const widgets =
        preferences.widgets.length > 0
            ? preferences.widgets
            : AVAILABLE_WIDGETS.map((w) => ({ id: w.id, visible: true }));

    const availableWidgetMap = new Map<string, (typeof AVAILABLE_WIDGETS)[number]>(
        AVAILABLE_WIDGETS.map((w) => [w.id, w]),
    );

    const visibleWidgets = widgets.filter((w) => {
        if (!w.visible) return false;

        const config = availableWidgetMap.get(w.id);
        if (config?.auth && !user) return false;

        return true;
    });

    useImperativeHandle(ref, () => containerRef.current!, []);

    useEffect(() => {
        if (_hasHydrated && containerRef.current) {
            containerRef.current.scrollTo({ left: 0 });
        }
    }, [_hasHydrated]);

    return (
        <div ref={containerRef} className="flex w-full snap-x snap-mandatory overflow-x-auto lg:snap-none lg:overflow-x-visible lg:flex-col lg:overflow-y-auto">
            {visibleWidgets.map((widget, index) => {
                const Component = WIDGET_COMPONENTS[widget.id];
                if (!Component) return null;
                return (
                    <div key={widget.id} className={cn("w-full shrink-0 snap-center lg:w-auto lg:shrink", index !== 0 && 'lg:border-t')}>
                        <Component />
                    </div>
                );
            })}
        </div>
    );
});

WidgetList.displayName = 'WidgetList';

export default WidgetList;
