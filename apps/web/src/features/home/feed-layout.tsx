import { type FC, type KeyboardEvent, useMemo, useRef, useState } from 'react';

import { Settings2 } from 'lucide-react';

import type { UiFeedWidget } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { SELECTED_TINT } from '@/components/ui/selected-tint';
import { useSession } from '@/features/auth/hooks/use-session';
import { cn } from '@/utils/cn';

import { type SupportedWidgetSlug, WIDGET_REGISTRY } from './constants';
import { useFeedLayout } from './hooks/use-feed-layout';
import { useOpenLayoutSettings } from './hooks/use-open-layout-settings';

const WidgetRenderer: FC<{ widget: UiFeedWidget; isLast?: boolean }> = ({
    widget,
    isLast,
}) => {
    const meta = WIDGET_REGISTRY[widget.slug as SupportedWidgetSlug];
    if (!meta) return null;
    const WidgetComponent = meta.component;
    return <WidgetComponent side={widget.side} isLast={isLast} />;
};

const WidgetColumn: FC<{ widgets: UiFeedWidget[]; className?: string }> = ({
    widgets,
    className,
}) => (
    <div
        className={cn(
            'flex flex-col gap-8 [&>*:first-child]:backdrop-blur',
            className,
        )}
    >
        {widgets.map((w, i) => (
            <WidgetRenderer
                key={w.slug}
                widget={w}
                isLast={i === widgets.length - 1}
            />
        ))}
    </div>
);

const CHIP_IDLE =
    'bg-secondary/40 text-muted-foreground hover:bg-accent backdrop-blur';

const SidebarWidgetChips: FC<{
    widgets: UiFeedWidget[];
    onOpenSettings?: () => void;
}> = ({ widgets, onOpenSettings }) => {
    const [activeSlug, setActiveSlug] = useState<string | undefined>();
    const tabRefs = useRef(new Map<string, HTMLButtonElement>());

    const currentSlug =
        activeSlug && widgets.some((w) => w.slug === activeSlug)
            ? activeSlug
            : widgets[0]?.slug;
    const currentWidget = widgets.find((w) => w.slug === currentSlug);

    const moveTab = (from: number, event: KeyboardEvent<HTMLButtonElement>) => {
        const last = widgets.length - 1;
        const to =
            event.key === 'ArrowRight'
                ? from === last
                    ? 0
                    : from + 1
                : event.key === 'ArrowLeft'
                  ? from === 0
                      ? last
                      : from - 1
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? last
                      : null;

        if (to === null) return;

        event.preventDefault();
        const slug = widgets[to].slug;
        setActiveSlug(slug);
        tabRefs.current.get(slug)?.focus();
    };

    if (widgets.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* No gradient mask: mask-image on the scroll container would
                become the chips' backdrop root and kill their backdrop-blur. */}
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
                {onOpenSettings && (
                    <Chip
                        onClick={onOpenSettings}
                        aria-label="Налаштувати макет"
                        className={cn(
                            'w-8 justify-center border border-transparent px-0',
                            CHIP_IDLE,
                        )}
                    >
                        <Settings2 className="size-4 shrink-0" />
                    </Chip>
                )}
                {/* `contents` keeps the tablist out of the layout so the
                    settings chip can share the rail without being a tab */}
                <div role="tablist" aria-label="Віджети" className="contents">
                    {widgets.map((w, i) => {
                        const meta =
                            WIDGET_REGISTRY[w.slug as SupportedWidgetSlug];
                        if (!meta) return null;

                        const Icon = meta.icon;
                        const isActive = w.slug === currentSlug;

                        return (
                            <Chip
                                key={w.slug}
                                ref={(node) => {
                                    if (node) {
                                        tabRefs.current.set(w.slug, node);
                                        return;
                                    }
                                    tabRefs.current.delete(w.slug);
                                }}
                                role="tab"
                                id={`widget-tab-${w.slug}`}
                                aria-selected={isActive}
                                aria-controls={`widget-panel-${w.slug}`}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => setActiveSlug(w.slug)}
                                onKeyDown={(e) => moveTab(i, e)}
                                className={cn(
                                    'border border-transparent px-3.5 text-sm backdrop-blur',
                                    isActive ? SELECTED_TINT : CHIP_IDLE,
                                )}
                            >
                                <Icon className="size-4 shrink-0" />
                                {meta.title}
                            </Chip>
                        );
                    })}
                </div>
            </div>
            {currentWidget && (
                <div
                    role="tabpanel"
                    id={`widget-panel-${currentWidget.slug}`}
                    aria-labelledby={`widget-tab-${currentWidget.slug}`}
                    className="[&>*:first-child]:backdrop-blur"
                >
                    <WidgetRenderer widget={currentWidget} isLast />
                </div>
            )}
        </div>
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
        'mx-auto grid w-full grid-cols-1 gap-x-10 gap-y-8',
        layout === 3 &&
            'lg:grid-cols-[1fr_20rem] xl:grid-cols-[20rem_1fr_20rem]',
        layout === 2 &&
            !isLeftRightOnly &&
            !isCenterRight &&
            'max-w-6xl lg:grid-cols-[28rem_1fr]',
        layout === 2 &&
            !isLeftRightOnly &&
            isCenterRight &&
            'max-w-6xl lg:grid-cols-[1fr_28rem]',
        layout === 2 && isLeftRightOnly && 'max-w-6xl lg:grid-cols-2',
        layout <= 1 && 'max-w-2xl',
    );

    const settingsFullButton = user ? (
        <Button
            variant="outline"
            className="w-full text-muted-foreground backdrop-blur"
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
                        'h-fit min-w-0 lg:hidden',
                        layout === 3 && 'order-1',
                    )}
                >
                    <SidebarWidgetChips
                        widgets={sidebarWidgets}
                        onOpenSettings={user ? openSettings : undefined}
                    />
                </aside>
            )}

            {isLeftRightOnly && (
                <div className="flex flex-col gap-4 lg:hidden">
                    {settingsFullButton}
                    <div className="flex flex-col gap-8">
                        <WidgetColumn widgets={left} />
                        <WidgetColumn widgets={right} />
                    </div>
                </div>
            )}

            {layout === 3 && (
                <aside
                    id="feed-left"
                    className="order-1 hidden h-fit min-w-0 flex-col gap-4 lg:order-2 lg:flex xl:hidden"
                >
                    {settingsFullButton}
                    {sidebarWidgets.length > 0 && (
                        <WidgetColumn widgets={sidebarWidgets} />
                    )}
                </aside>
            )}

            {layout === 3 && (
                <aside
                    id="feed-left"
                    className="hidden h-fit min-w-0 flex-col gap-4 xl:flex"
                >
                    {settingsFullButton}
                    {hasLeft && <WidgetColumn widgets={left} />}
                </aside>
            )}

            {layout === 3 && (
                <aside
                    id="feed-right"
                    className="hidden h-fit min-w-0 xl:order-2 xl:block"
                >
                    {hasRight && <WidgetColumn widgets={right} />}
                </aside>
            )}

            {layout === 2 && !isLeftRightOnly && sidebarWidgets.length > 0 && (
                <aside
                    id="feed-left"
                    className={cn(
                        'hidden h-fit min-w-0 flex-col gap-4 lg:flex',
                        isCenterRight && 'lg:order-2',
                    )}
                >
                    {settingsFullButton}
                    <WidgetColumn widgets={sidebarWidgets} />
                </aside>
            )}

            {layout === 2 && isLeftRightOnly && (
                <>
                    <aside
                        id="feed-left"
                        className="hidden h-fit min-w-0 flex-col gap-4 lg:flex"
                    >
                        {settingsFullButton}
                        <WidgetColumn widgets={left} />
                    </aside>
                    <aside
                        id="feed-right"
                        className="hidden h-fit min-w-0 lg:block"
                    >
                        <WidgetColumn widgets={right} />
                    </aside>
                </>
            )}

            {layout <= 1 && (
                <div className="flex flex-col gap-4">
                    {settingsFullButton}
                    {!hasCenter && (
                        <WidgetColumn widgets={hasLeft ? left : right} />
                    )}
                </div>
            )}

            {hasCenter && (
                <main
                    className={cn(
                        'flex min-w-0 flex-col gap-8 [&>*:first-child]:backdrop-blur',
                        layout === 3 && 'order-2 lg:order-1',
                        isCenterRight && 'lg:order-1',
                    )}
                    id="feed"
                >
                    {center.map((w, i) => (
                        <WidgetRenderer
                            key={w.slug}
                            widget={w}
                            isLast={i === center.length - 1}
                        />
                    ))}
                </main>
            )}
        </div>
    );
};

export default FeedLayout;
