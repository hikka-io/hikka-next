import { type FC, useRef, useState } from 'react';

import {
    type CollisionDetection,
    closestCenter,
    DndContext,
    type DragOverEvent,
    type DragStartEvent,
    MouseSensor,
    pointerWithin,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import type { UiFeedWidget } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { Separator } from '@/components/ui/separator';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';
import { cn } from '@/utils/cn';

import {
    buildPresetWidgets,
    COLUMNS,
    derivePreset,
    groupBySide,
    type LayoutPreset,
    PRESET_COLUMNS,
    reindex,
    resolveSide,
} from '../layout';
import type {
    SupportedWidgetSlug,
    UIFeedWidgetSide,
    UIFeedWidgetSlug,
} from '../types';
import { ALL_WIDGET_SLUGS, WIDGET_REGISTRY } from '../widgets/registry';
import PresetSelector from './preset-selector';
import WidgetColumn from './widget-column';

function isColumnId(id: string | number): id is UIFeedWidgetSide {
    return COLUMNS.includes(id as UIFeedWidgetSide);
}

const itemPreferringCollision: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);

    const itemsUnderPointer = pointerCollisions.filter(
        (c) => !isColumnId(c.id),
    );
    if (itemsUnderPointer.length > 0) return itemsUnderPointer;

    const columnsUnderPointer = pointerCollisions.filter((c) =>
        isColumnId(c.id),
    );
    if (columnsUnderPointer.length > 0) return columnsUnderPointer;

    const closestCollisions = closestCenter(args);
    const nearestItems = closestCollisions.filter((c) => !isColumnId(c.id));
    return nearestItems.length > 0 ? nearestItems : closestCollisions;
};

const LayoutSettingsContent = () => {
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const [widgets, setWidgets] = useState<UiFeedWidget[]>(
        () => preferences.feed.widgets,
    );
    const [preset, setPreset] = useState<LayoutPreset>(() =>
        derivePreset(preferences.feed.widgets),
    );

    const widgetsRef = useRef(widgets);
    widgetsRef.current = widgets;
    const preDragRef = useRef<UiFeedWidget[] | null>(null);

    const activeColumns = PRESET_COLUMNS[preset];
    const columns = groupBySide(widgets);

    const hiddenSlugs = ALL_WIDGET_SLUGS.filter(
        (slug) => !widgets.some((w) => w.slug === slug),
    );

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 5 },
        }),
    );

    const persist = (next: UiFeedWidget[]) => {
        const reindexed = reindex(next);
        setWidgets(reindexed);
        update({ preferences: { feed: { widgets: reindexed } } });
    };

    const handlePresetChange = (newPreset: LayoutPreset) => {
        setPreset(newPreset);
        persist(buildPresetWidgets(newPreset));
    };

    const handleRemove = (slug: UIFeedWidgetSlug) => {
        persist(widgetsRef.current.filter((w) => w.slug !== slug));
    };

    const handleAdd = (slug: UIFeedWidgetSlug) => {
        const meta = WIDGET_REGISTRY[slug as SupportedWidgetSlug];
        const side = resolveSide(meta.defaultSide, activeColumns);
        persist([...widgetsRef.current, { slug, side, order: 0 }]);
    };

    const handleDragStart = (_event: DragStartEvent) => {
        preDragRef.current = widgetsRef.current;
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        const current = widgetsRef.current;

        const activeWidget = current.find((w) => w.slug === activeId);
        if (!activeWidget) return;

        const activeSide = activeWidget.side;
        const overIsColumn = isColumnId(overId);
        const overSide = overIsColumn
            ? overId
            : current.find((w) => w.slug === overId)?.side;

        if (!overSide) return;

        const grouped = groupBySide(current);

        if (activeSide === overSide && !overIsColumn) {
            const items = grouped[activeSide];
            const activeIndex = items.findIndex((w) => w.slug === activeId);
            const overIndex = items.findIndex((w) => w.slug === overId);
            if (activeIndex === -1 || overIndex === -1) return;
            if (activeIndex === overIndex) return;

            const reordered = arrayMove(items, activeIndex, overIndex);
            const others = current.filter((w) => w.side !== activeSide);
            setWidgets(reindex([...others, ...reordered]));
        } else if (activeSide !== overSide) {
            const source = grouped[activeSide].filter(
                (w) => w.slug !== activeId,
            );
            const dest = [...grouped[overSide]];
            const moved: UiFeedWidget = { ...activeWidget, side: overSide };

            if (overIsColumn) {
                dest.push(moved);
            } else {
                const idx = dest.findIndex((w) => w.slug === overId);
                dest.splice(idx >= 0 ? idx : dest.length, 0, moved);
            }

            const others = current.filter(
                (w) => w.side !== activeSide && w.side !== overSide,
            );
            setWidgets(reindex([...others, ...source, ...dest]));
        }
    };

    const handleDragEnd = () => {
        const pre = preDragRef.current;
        preDragRef.current = null;

        const current = widgetsRef.current;
        if (pre !== current) {
            persist(current);
        }
    };

    return (
        <div className="-m-4 flex flex-1 flex-col overflow-y-auto">
            <PresetSelector value={preset} onChange={handlePresetChange} />

            <Separator />

            <DndContext
                sensors={sensors}
                collisionDetection={itemPreferringCollision}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-1 flex-col gap-4 overflow-y-scroll p-4">
                    <div
                        className={cn(
                            'grid grid-cols-1 gap-3',
                            activeColumns.length === 3 && 'sm:grid-cols-3',
                            activeColumns.length === 2 && 'sm:grid-cols-2',
                        )}
                    >
                        {activeColumns.map((side) => (
                            <WidgetColumn
                                key={side}
                                side={side}
                                widgets={columns[side]}
                                preset={preset}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    {hiddenSlugs.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <Label className="font-medium text-muted-foreground text-xs">
                                Приховані
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {hiddenSlugs.map((slug) => {
                                    const meta = WIDGET_REGISTRY[slug];
                                    return (
                                        <Button
                                            key={slug}
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5"
                                            onClick={() => handleAdd(slug)}
                                        >
                                            <Plus className="size-3.5" />
                                            {meta?.title}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </DndContext>
        </div>
    );
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const LayoutSettings: FC<Props> = ({ open, onOpenChange }) => (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} mobile="page">
        <ResponsiveModalContent
            className="md:min-h-112 md:max-w-3xl"
            title="Налаштувати макет сторінки"
            description="Оберіть тип макету, налаштуйте віджети та їх порядок"
        >
            <LayoutSettingsContent />
            <ResponsiveModalFooter>
                <Button size="md" onClick={() => onOpenChange(false)}>
                    Готово
                </Button>
            </ResponsiveModalFooter>
        </ResponsiveModalContent>
    </ResponsiveModal>
);

export default LayoutSettings;
