'use client';

import { HomeWidgetsEnum } from '@hikka/client';
import { useSession } from '@hikka/react';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useUIStore } from '@/services/providers/ui-store-provider';
import { cn } from '@/utils/cn';
import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

import { useOpenWidgetSettings } from '../../hooks/use-open-widget-settings';
import { DEFAULT_HOME_WIDGETS, WIDGET_COMPONENTS } from '../constants';

const AVAILABLE_WIDGET_MAP = new Map(AVAILABLE_WIDGETS.map((w) => [w.id, w]));

interface Props {
    className?: string;
}

const WidgetSection: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const homeWidgets = useUIStore((s) => s.preferences?.home_widgets);
    const { openSettings: openSettingsModal, settingsModal } =
        useOpenWidgetSettings();
    const [activeTab, setActiveTab] = useState<string | undefined>();

    const widgets = homeWidgets ?? DEFAULT_HOME_WIDGETS;

    const currentTab =
        activeTab && widgets.includes(activeTab as HomeWidgetsEnum)
            ? activeTab
            : widgets[0];

    const hasWidgets = widgets.length > 0;

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {settingsModal}
            <Button
                variant="outline"
                className="text-muted-foreground backdrop-blur shrink-0 hidden lg:flex"
                size="md"
                disabled={!user}
                onClick={openSettingsModal}
            >
                <Settings2 />
                Налаштувати віджети
            </Button>
            {hasWidgets ? (
                <Tabs
                    value={currentTab}
                    onValueChange={setActiveTab}
                    className="lg:hidden"
                >
                    <div className="flex gap-2 w-full overflow-hidden">
                        <TabsList className="flex-1 overflow-hidden overflow-x-scroll justify-start">
                            {widgets.map((widgetId) => {
                                const config =
                                    AVAILABLE_WIDGET_MAP.get(widgetId);
                                return (
                                    <TabsTrigger
                                        key={widgetId}
                                        value={widgetId}
                                    >
                                        {config?.title}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                        <Button
                            variant="secondary"
                            className="text-muted-foreground shrink-0"
                            size="icon-md"
                            disabled={!user}
                            onClick={openSettingsModal}
                        >
                            <Settings2 />
                        </Button>
                    </div>
                    {widgets.map((widgetId) => {
                        const Component = WIDGET_COMPONENTS[widgetId];
                        if (!Component) return null;
                        return (
                            <TabsContent key={widgetId} value={widgetId}>
                                <Component />
                            </TabsContent>
                        );
                    })}
                </Tabs>
            ) : (
                <Button
                    variant="outline"
                    className="text-muted-foreground lg:hidden"
                    size="md"
                    disabled={!user}
                    onClick={openSettingsModal}
                >
                    <Settings2 />
                    Налаштувати віджети
                </Button>
            )}

            <div className="hidden lg:flex lg:flex-col lg:gap-4">
                {widgets.map((widgetId) => {
                    const Component = WIDGET_COMPONENTS[widgetId];
                    if (!Component) return null;
                    return <Component key={widgetId} />;
                })}
            </div>
        </div>
    );
};

export default WidgetSection;
