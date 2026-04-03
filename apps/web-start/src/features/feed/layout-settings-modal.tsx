'use client';

import {
    CollisionDetection,
    DndContext,
    DragOverEvent,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    closestCenter,
    pointerWithin,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    UIFeedWidget,
    UIFeedWidgetSide,
    UIFeedWidgetSlug,
} from '@hikka/client';
import { GripVertical, Plus, X } from 'lucide-react';
import { FC, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';
import { cn } from '@/utils/cn';

import { ALL_WIDGET_SLUGS, WIDGET_REGISTRY } from './constants';
import { groupBySide } from './utils';

const COLUMNS: UIFeedWidgetSide[] = ['left', 'center', 'right'];

const COLUMN_LABELS: Record<UIFeedWidgetSide, string> = {
    left: 'Ліва панель',
    center: 'Центр',
    right: 'Права панель',
};

function isColumnId(id: string | number): id is UIFeedWidgetSide {
    return COLUMNS.includes(id as UIFeedWidgetSide);
}

function reindex(widgets: UIFeedWidget[]): UIFeedWidget[] {
    const grouped: Record<UIFeedWidgetSide, UIFeedWidget[]> = {
        left: [],
        center: [],
        right: [],
    };
    for (const w of widgets) {
        grouped[w.side]?.push(w);
    }
    const result: UIFeedWidget[] = [];
    for (const side of COLUMNS) {
        grouped[side].forEach((w, i) => {
            result.push({ ...w, order: i + 1 });
        });
    }
    return result;
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

const SortableWidgetItem: FC<{
    widget: UIFeedWidget;
    onRemove: (slug: UIFeedWidgetSlug) => void;
}> = ({ widget, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: widget.slug });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const meta = WIDGET_REGISTRY[widget.slug];

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border bg-secondary/20 flex touch-none items-center gap-2 rounded-lg p-2"
            {...attributes}
            {...listeners}
        >
            <GripVertical className="text-muted-foreground size-4 shrink-0" />
            <div className="flex flex-1 flex-col">
                <Label className="text-xs">{meta?.title ?? widget.slug}</Label>
            </div>
            <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onRemove(widget.slug)}
            >
                <X className="size-3.5" />
            </button>
        </div>
    );
};

const DroppableColumn: FC<{
    side: UIFeedWidgetSide;
    widgets: UIFeedWidget[];
    onRemove: (slug: UIFeedWidgetSlug) => void;
}> = ({ side, widgets, onRemove }) => {
    const { setNodeRef, isOver } = useDroppable({ id: side });

    return (
        <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs font-medium">
                {COLUMN_LABELS[side]}
            </Label>
            <SortableContext
                items={widgets.map((w) => w.slug)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={cn(
                        'flex min-h-24 flex-col gap-1.5 rounded-lg border border-dashed p-2 transition-colors',
                        isOver
                            ? 'border-primary/50 bg-primary/5'
                            : 'bg-muted/30',
                    )}
                >
                    {widgets.map((widget) => (
                        <SortableWidgetItem
                            key={widget.slug}
                            widget={widget}
                            onRemove={onRemove}
                        />
                    ))}
                    {widgets.length === 0 && (
                        <p className="text-muted-foreground flex flex-1 items-center justify-center text-xs">
                            Перетягніть сюди
                        </p>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

const LayoutSettingsContent = () => {
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const [widgets, setWidgets] = useState<UIFeedWidget[]>(
        () => preferences.feed.widgets,
    );
    const widgetsRef = useRef(widgets);
    widgetsRef.current = widgets;
    const preDragRef = useRef<UIFeedWidget[] | null>(null);

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

    const persist = (next: UIFeedWidget[]) => {
        const reindexed = reindex(next);
        setWidgets(reindexed);
        update({ preferences: { feed: { widgets: reindexed } } });
    };

    const handleRemove = (slug: UIFeedWidgetSlug) => {
        persist(widgetsRef.current.filter((w) => w.slug !== slug));
    };

    const handleAdd = (slug: UIFeedWidgetSlug, side: UIFeedWidgetSide) => {
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
            const moved: UIFeedWidget = { ...activeWidget, side: overSide };

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
        <DndContext
            sensors={sensors}
            collisionDetection={itemPreferringCollision}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {COLUMNS.map((side) => (
                        <DroppableColumn
                            key={side}
                            side={side}
                            widgets={columns[side]}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>

                {hiddenSlugs.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-xs font-medium">
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
                                        onClick={() =>
                                            handleAdd(
                                                slug,
                                                meta?.defaultSide ?? 'right',
                                            )
                                        }
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
    );
};

export default LayoutSettingsContent;
