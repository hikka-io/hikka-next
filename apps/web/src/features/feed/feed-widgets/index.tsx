'use client';

import { Settings2 } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { useModalContext } from '@/services/providers/modal-provider';
import { useSettingsStore } from '@/services/stores/settings-store';
import { cn } from '@/utils/cn';

import { AVAILABLE_WIDGETS } from '../types';
import WidgetCalendar from './components/widget-calendar';
import WidgetSettingsContent from './components/widget-settings-modal';
import WidgetWatching from './components/widget-watching';

const WIDGET_COMPONENTS: Record<string, React.ComponentType> = {
    watching: WidgetWatching,
    calendar: WidgetCalendar,
};

const FeedWidgets = () => {
    const { preferences } = useSettingsStore();
    const { openModal } = useModalContext();
    const scrollRef = useRef(null);
    const { gradientClassName } = useScrollGradientMask(scrollRef);

    const widgets =
        preferences.widgets.length > 0
            ? preferences.widgets
            : AVAILABLE_WIDGETS.map((w) => ({ id: w.id, visible: true }));

    const openSettingsModal = () => {
        openModal({
            content: <WidgetSettingsContent />,
            title: 'Налаштувати віджети',
            forceModal: true,
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <Button
                variant="ghost"
                className="w-full text-muted-foreground backdrop-blur"
                size="md"
                onClick={openSettingsModal}
            >
                <Settings2 />
                Налаштувати віджети
            </Button>
            <div
                ref={scrollRef}
                className={cn(
                    'flex flex-col gap-4 max-h-[calc(100vh-12rem)] overflow-auto no-scrollbar',
                    gradientClassName,
                )}
            >
                {widgets
                    .filter((w) => w.visible)
                    .map((widget) => {
                        const Component = WIDGET_COMPONENTS[widget.id];
                        if (!Component) return null;
                        return <Component key={widget.id} />;
                    })}
            </div>
        </div>
    );
};

export default FeedWidgets;
