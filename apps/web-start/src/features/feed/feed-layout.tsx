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
    <div className={cn('flex flex-col gap-6', className)}>
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

const FeedLayout: FC<{ className?: string }> = ({ className }) => {
    const { user } = useSession();
    const { left, center, right } = useFeedLayout();
    const { openSettings, settingsModal } = useOpenLayoutSettings();

    const hasLeft = left.length > 0;
    const hasCenter = center.length > 0;
    const hasRight = right.length > 0;
    const filledSides = [hasLeft, hasCenter, hasRight].filter(Boolean).length;

    const layout = !user ? 3 : filledSides;
    const isLeftRightOnly = hasLeft && hasRight && !hasCenter;
    const isCenterRight = hasCenter && hasRight && !hasLeft;

    const sidebarWidgets = useMemo(() => [...left, ...right], [left, right]);

    const gridClasses = cn(
        'mx-auto grid w-full grid-cols-1 gap-6',
        layout === 3 &&
            'lg:grid-cols-[1fr_20rem] xl:grid-cols-[20rem_1fr_20rem]',
        layout === 2 && !isLeftRightOnly && !isCenterRight && 'max-w-6xl lg:grid-cols-[28rem_1fr]',
        layout === 2 && !isLeftRightOnly && isCenterRight && 'max-w-6xl lg:grid-cols-[1fr_28rem]',
        layout === 2 && isLeftRightOnly && 'max-w-6xl lg:grid-cols-2',
        layout <= 1 && 'max-w-2xl',
    );

    const settingsIconButton = user ? (
        <Button
            variant="secondary"
            className="text-muted-foreground shrink-0"
            size="icon-md"
            onClick={openSettings}
        >
            <Settings2 />
        </Button>
    ) : null;

    const settingsFullButton = user ? (
        <Button
            variant="outline"
            className="text-muted-foreground w-full backdrop-blur"
            size="md"
            onClick={openSettings}
        >
            <Settings2 />
            Налаштувати макет
        </Button>
    ) : null;

    return (
        <div className={cn(gridClasses, className)}>
            {settingsModal}

            {layout >= 2 && !isLeftRightOnly && sidebarWidgets.length > 0 && (
                <aside
                    className={cn(
                        'min-w-0 h-fit lg:hidden',
                        layout === 3 && 'order-1',
                    )}
                >
                    <SidebarWidgetTabs
                        widgets={sidebarWidgets}
                        settingsButton={settingsIconButton}
                    />
                </aside>
            )}

            {isLeftRightOnly && (
                <div className="flex flex-col gap-6 lg:hidden">
                    {settingsFullButton}
                    <WidgetColumn widgets={left} />
                    <WidgetColumn widgets={right} />
                </div>
            )}

            {layout === 3 && (
                <aside className="order-1 hidden min-w-0 h-fit lg:order-2 lg:block xl:hidden">
                    <div className="flex flex-col gap-4">
                        {settingsFullButton}
                        {sidebarWidgets.length > 0 && (
                            <WidgetColumn widgets={sidebarWidgets} />
                        )}
                    </div>
                </aside>
            )}

            {layout === 3 && (
                <aside className="hidden min-w-0 h-fit xl:block">
                    {hasLeft ? (
                        <div className="flex flex-col gap-4">
                            {settingsFullButton}
                            <WidgetColumn widgets={left} />
                        </div>
                    ) : (
                        settingsFullButton
                    )}
                </aside>
            )}

            {layout === 3 && (
                <aside className="hidden min-w-0 h-fit xl:order-2 xl:block">
                    {hasRight && <WidgetColumn widgets={right} />}
                </aside>
            )}

            {layout === 2 && !isLeftRightOnly && sidebarWidgets.length > 0 && (
                <aside className={cn('hidden min-w-0 h-fit lg:block', isCenterRight && 'lg:order-2')}>
                    <div className="flex flex-col gap-4">
                        {settingsFullButton}
                        <WidgetColumn widgets={sidebarWidgets} />
                    </div>
                </aside>
            )}

            {layout === 2 && isLeftRightOnly && (
                <>
                    <aside className="hidden min-w-0 h-fit lg:block">
                        <div className="flex flex-col gap-4">
                            {settingsFullButton}
                            <WidgetColumn widgets={left} />
                        </div>
                    </aside>
                    <aside className="hidden min-w-0 h-fit lg:block">
                        <WidgetColumn widgets={right} />
                    </aside>
                </>
            )}

            {hasCenter && (
                <main
                    className={cn(
                        'flex min-w-0 flex-col gap-6',
                        layout === 3 && 'order-2 lg:order-1',
                        isCenterRight && 'lg:order-1',
                    )}
                    id="feed"
                >
                    {center.map((w) => (
                        <WidgetRenderer key={w.slug} widget={w} />
                    ))}
                </main>
            )}

            {layout <= 1 && settingsFullButton}

            {layout === 1 && !hasCenter && (
                <WidgetColumn widgets={hasLeft ? left : right} />
            )}
        </div>
    );
};

export default FeedLayout;
