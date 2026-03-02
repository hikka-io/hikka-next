'use client';

import { ChevronDown, Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { useSettingsStore } from '@/services/stores/settings-store';
import { cn } from '@/utils/cn';

import WidgetList from './feed-widgets/components/widget-list';
import { useOpenWidgetSettings } from './hooks/use-open-widget-settings';

const FeedMobileWidgets = () => {
    const { preferences, setCollapsible } = useSettingsStore();
    const openSettingsModal = useOpenWidgetSettings();

    const isOpen = preferences.collapsibles.home_mobile_widgets ?? false;

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={(open) => setCollapsible('home_mobile_widgets', open)}
        >
            <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                    <Button
                        variant="outline"
                        size="md"
                        className="flex-1 text-muted-foreground  backdrop-blur"
                    >
                        <span>Віджети</span>
                        <ChevronDown
                            className={cn(
                                'size-4 transition-transform duration-200',
                                isOpen && 'rotate-180',
                            )}
                        />
                    </Button>
                </CollapsibleTrigger>
                <Button
                    variant="outline"
                    size="icon-md"
                    className="text-muted-foreground backdrop-blur"
                    onClick={openSettingsModal}
                >
                    <Settings2 className="size-4" />
                </Button>
            </div>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="flex flex-col gap-4 pt-4">
                    <WidgetList />
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

export default FeedMobileWidgets;
