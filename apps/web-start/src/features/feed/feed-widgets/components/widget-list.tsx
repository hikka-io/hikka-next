'use client';

import { useUIStore } from '@/services/providers/ui-store-provider';
import { cn } from '@/utils/cn';

import { DEFAULT_HOME_WIDGETS, WIDGET_COMPONENTS } from '../constants';

const WidgetList = () => {
    const homeWidgets = useUIStore((s) => s.preferences?.home_widgets);

    const widgets = homeWidgets ?? DEFAULT_HOME_WIDGETS;

    return (
        <div
            className={cn(
                'flex w-full min-w-0 snap-x snap-mandatory gap-8 overflow-x-auto no-scrollbar',
                'lg:flex-col lg:snap-none lg:overflow-visible px-4 lg:px-0',
            )}
        >
            {widgets.map((widgetId) => {
                const Component = WIDGET_COMPONENTS[widgetId];
                if (!Component) return null;
                return (
                    <div
                        key={widgetId}
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
