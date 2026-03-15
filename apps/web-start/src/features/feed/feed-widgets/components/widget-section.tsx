'use client';

import { useSession } from '@hikka/react';
import { Settings2 } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsStore } from '@/services/stores/settings-store';
import { cn } from '@/utils/cn';
import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

import { useOpenWidgetSettings } from '../../hooks/use-open-widget-settings';
import WidgetCalendar from './widget-calendar';
import WidgetHistory from './widget-history';
import WidgetOngoing from './widget-ongoing';
import WidgetTracker from './widget-tracker';

const WIDGET_COMPONENTS: Record<string, FC> = {
    ongoings: WidgetOngoing,
    calendar: WidgetCalendar,
    tracker: WidgetTracker,
    history: WidgetHistory,
};

const AVAILABLE_WIDGET_MAP = new Map<
    string,
    (typeof AVAILABLE_WIDGETS)[number]
>(AVAILABLE_WIDGETS.map((w) => [w.id, w]));

interface Props {
    className?: string;
}

const WidgetSection: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const { preferences } = useSettingsStore();
    const openSettingsModal = useOpenWidgetSettings();
    const [activeTab, setActiveTab] = useState<string | undefined>();

    const widgets =
        preferences.widgets.length > 0
            ? preferences.widgets
            : AVAILABLE_WIDGETS.map((w) => ({ id: w.id, visible: true }));

    const visibleWidgets = useMemo(
        () =>
            widgets.filter((w) => {
                if (!w.visible) return false;
                const config = AVAILABLE_WIDGET_MAP.get(w.id);
                if (config?.auth && !user) return false;
                return true;
            }),
        [widgets, user],
    );

    const currentTab =
        activeTab && visibleWidgets.some((w) => w.id === activeTab)
            ? activeTab
            : visibleWidgets[0]?.id;

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {visibleWidgets.length > 0 && (
                <Tabs
                    value={currentTab}
                    onValueChange={setActiveTab}
                    className="lg:hidden"
                >
                    <TabsList className="w-full">
                        {visibleWidgets.map((widget) => {
                            const config = AVAILABLE_WIDGET_MAP.get(widget.id);
                            return (
                                <TabsTrigger key={widget.id} value={widget.id}>
                                    {config?.title}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    {visibleWidgets.map((widget) => {
                        const Component = WIDGET_COMPONENTS[widget.id];
                        if (!Component) return null;
                        return (
                            <TabsContent key={widget.id} value={widget.id}>
                                <Component />
                            </TabsContent>
                        );
                    })}
                </Tabs>
            )}

            <div className="hidden lg:flex lg:flex-col lg:gap-4">
                {visibleWidgets.map((widget) => {
                    const Component = WIDGET_COMPONENTS[widget.id];
                    if (!Component) return null;
                    return <Component key={widget.id} />;
                })}
            </div>

            <Button
                variant="outline"
                className="text-muted-foreground shrink-0"
                size="md"
                disabled={!user}
                onClick={openSettingsModal}
            >
                <Settings2 />
                Налаштувати віджети
            </Button>
        </div>
    );
};

export default WidgetSection;
