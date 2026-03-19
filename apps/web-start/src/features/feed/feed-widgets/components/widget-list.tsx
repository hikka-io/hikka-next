'use client';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { cn } from '@/utils/cn';

import { DEFAULT_HOME_WIDGETS, WIDGET_COMPONENTS } from '../constants';

const WidgetList = () => {
    const { preferences } = useSessionUI();
    const homeWidgets = preferences.home_widgets;

    const widgets = homeWidgets ?? DEFAULT_HOME_WIDGETS;

    return (
        <div
            className={cn(
                'no-scrollbar flex w-full min-w-0 snap-x snap-mandatory gap-8 overflow-x-auto',
                'px-4 lg:snap-none lg:flex-col lg:overflow-visible lg:px-0',
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
