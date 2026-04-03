'use client';

import { UIFeedWidget, UIFeedWidgetSlug } from '@hikka/client';
import { useSession } from '@hikka/react';
import { Settings2 } from 'lucide-react';
import { FC, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import { WIDGET_REGISTRY } from './constants';
import { useFeedLayout } from './hooks/use-feed-layout';
import { useOpenLayoutSettings } from './hooks/use-open-layout-settings';

const WidgetRenderer: FC<{ widget: UIFeedWidget }> = ({ widget }) => {
    const meta = WIDGET_REGISTRY[widget.slug as UIFeedWidgetSlug];
    if (!meta) return null;
    const Component = meta.component;
    return <Component side={widget.side} />;
};

const WidgetColumn: FC<{ widgets: UIFeedWidget[]; className?: string }> = ({
    widgets,
    className,
}) => (
    <div className={cn('flex flex-col gap-4', className)}>
        {widgets.map((w) => (
            <WidgetRenderer key={w.slug} widget={w} />
        ))}
    </div>
);

const SidebarWidgetTabs: FC<{
    widgets: UIFeedWidget[];
    settingsButton: React.ReactNode;
}> = ({ widgets, settingsButton }) => {
    const [activeTab, setActiveTab] = useState<string | undefined>();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    const currentTab =
        activeTab && widgets.some((w) => w.slug === activeTab)
            ? activeTab
            : widgets[0]?.slug;

    if (widgets.length === 0) {
        return settingsButton;
    }

    return (
        <Tabs value={currentTab} onValueChange={setActiveTab}>
            <div className="flex w-full gap-2 overflow-hidden">
                <TabsList
                    ref={scrollRef}
                    className={cn(
                        'flex-1 justify-start overflow-hidden overflow-x-scroll',
                        gradientClassName,
                    )}
                >
                    {widgets.map((w) => {
                        const meta =
                            WIDGET_REGISTRY[w.slug as UIFeedWidgetSlug];
                        return (
                            <TabsTrigger key={w.slug} value={w.slug}>
                                {meta?.title}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                {settingsButton}
            </div>
            {widgets.map((w) => (
                <TabsContent key={w.slug} value={w.slug}>
                    <WidgetRenderer widget={w} />
                </TabsContent>
            ))}
        </Tabs>
    );
};

const SidebarColumn: FC<{
    widgets: UIFeedWidget[];
    asideClassName: string;
    buttonClassName?: string;
    onOpenSettings: () => void;
    showButton: boolean;
}> = ({
    widgets,
    asideClassName,
    buttonClassName,
    onOpenSettings,
    showButton,
}) => (
    <aside className={cn('min-w-0 h-fit', asideClassName)}>
        {showButton && (
            <Button
                variant="outline"
                className={cn(
                    'text-muted-foreground mb-4 w-full backdrop-blur',
                    buttonClassName,
                )}
                size="md"
                onClick={onOpenSettings}
            >
                <Settings2 />
                Налаштувати макет
            </Button>
        )}
        <WidgetColumn widgets={widgets} />
    </aside>
);

const FeedLayout: FC<{ className?: string }> = ({ className }) => {
    const { user } = useSession();
    const { left, center, right } = useFeedLayout();
    const { openSettings, settingsModal } = useOpenLayoutSettings();

    const hasLeft = left.length > 0;
    const hasRight = right.length > 0;

    const sidebarWidgets = useMemo(() => [...left, ...right], [left, right]);

    const gridClasses = cn(
        'grid grid-cols-1 gap-8',
        hasLeft &&
            hasRight &&
            'lg:grid-cols-[1fr_20rem] xl:grid-cols-[20rem_1fr_20rem]',
        hasRight && !hasLeft && 'lg:grid-cols-[1fr_20rem]',
        hasLeft && !hasRight && 'lg:grid-cols-[20rem_1fr]',
    );

    const settingsButton = user ? (
        <Button
            variant="secondary"
            className="text-muted-foreground shrink-0"
            size="icon-md"
            onClick={openSettings}
        >
            <Settings2 />
        </Button>
    ) : null;

    return (
        <div className={cn(gridClasses, className)}>
            {settingsModal}

            {/* Left sidebar — XL only, 3-column layout */}
            {hasLeft && hasRight && (
                <SidebarColumn
                    widgets={left}
                    asideClassName="hidden xl:block"
                    buttonClassName="hidden xl:flex"
                    onOpenSettings={openSettings}
                    showButton={!!user}
                />
            )}

            {/* Center column */}
            <main
                className={cn(
                    'flex min-w-0 flex-col gap-4',
                    hasLeft && hasRight && 'order-2 lg:order-1',
                    hasRight && !hasLeft && 'order-1',
                    hasLeft && !hasRight && 'order-1 lg:order-2',
                )}
                id="feed"
            >
                {center.map((w) => (
                    <WidgetRenderer key={w.slug} widget={w} />
                ))}
            </main>

            {/* Combined sidebar — mobile/tablet */}
            {sidebarWidgets.length > 0 && (
                <aside
                    className={cn(
                        'block min-w-0 h-fit',
                        hasLeft && hasRight
                            ? 'order-1 lg:order-2 xl:hidden'
                            : 'order-1 lg:hidden',
                    )}
                >
                    {/* Mobile: tab interface */}
                    <div className="lg:hidden">
                        <SidebarWidgetTabs
                            widgets={sidebarWidgets}
                            settingsButton={settingsButton}
                        />
                    </div>

                    {/* Tablet: stacked widgets (only for 3-col layout) */}
                    <div className="hidden lg:flex lg:flex-col lg:gap-4 xl:hidden">
                        {user && (
                            <Button
                                variant="outline"
                                className="text-muted-foreground w-full backdrop-blur"
                                size="md"
                                onClick={openSettings}
                            >
                                <Settings2 />
                                Налаштувати макет
                            </Button>
                        )}
                        <WidgetColumn widgets={sidebarWidgets} />
                    </div>
                </aside>
            )}

            {/* Right sidebar — XL only, 3-column layout */}
            {hasLeft && hasRight && (
                <SidebarColumn
                    widgets={right}
                    asideClassName="hidden xl:order-2 xl:block"
                    onOpenSettings={openSettings}
                    showButton={false}
                />
            )}

            {/* Right sidebar — lg+, 2-column layout (no left) */}
            {hasRight && !hasLeft && (
                <SidebarColumn
                    widgets={right}
                    asideClassName="hidden lg:block"
                    buttonClassName="hidden lg:flex"
                    onOpenSettings={openSettings}
                    showButton={!!user}
                />
            )}

            {/* Left sidebar — lg+, 2-column layout (no right) */}
            {hasLeft && !hasRight && (
                <SidebarColumn
                    widgets={left}
                    asideClassName="hidden lg:order-1 lg:block"
                    buttonClassName="hidden lg:flex"
                    onOpenSettings={openSettings}
                    showButton={!!user}
                />
            )}
        </div>
    );
};

export default FeedLayout;
