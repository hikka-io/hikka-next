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
import { GripVertical, Plus, Smartphone, X } from 'lucide-react';
import { FC, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';
import { cn } from '@/utils/cn';

import { ALL_WIDGET_SLUGS, WIDGET_REGISTRY } from './constants';
import { COLUMNS, groupBySide } from './utils';

// --- Preset types & helpers ---

type LayoutPreset =
    | 'left-center-right'
    | 'left-center'
    | 'center-right'
    | 'left-right'
    | 'center-only';

const PRESET_COLUMNS: Record<LayoutPreset, UIFeedWidgetSide[]> = {
    'left-center-right': ['left', 'center', 'right'],
    'left-center': ['left', 'center'],
    'center-right': ['center', 'right'],
    'left-right': ['left', 'right'],
    'center-only': ['center'],
};

const PRESET_META: {
    id: LayoutPreset;
    label: string;
    bars: { flex: number; type: 'sidebar' | 'center' }[];
}[] = [
    {
        id: 'left-center-right',
        label: 'Повний макет',
        bars: [
            { flex: 1, type: 'sidebar' },
            { flex: 2, type: 'center' },
            { flex: 1, type: 'sidebar' },
        ],
    },
    {
        id: 'left-center',
        label: 'Ліва + центр',
        bars: [
            { flex: 1.4, type: 'sidebar' },
            { flex: 2, type: 'center' },
        ],
    },
    {
        id: 'center-right',
        label: 'Центр + права',
        bars: [
            { flex: 2, type: 'center' },
            { flex: 1.4, type: 'sidebar' },
        ],
    },
    {
        id: 'left-right',
        label: 'Дві колонки',
        bars: [
            { flex: 1, type: 'sidebar' },
            { flex: 1, type: 'sidebar' },
        ],
    },
    {
        id: 'center-only',
        label: 'Одна колонка',
        bars: [{ flex: 1, type: 'center' }],
    },
];

const COLUMN_LABELS: Record<UIFeedWidgetSide, string> = {
    left: 'Ліва панель',
    center: 'Центр',
    right: 'Права панель',
};

function derivePreset(widgets: UIFeedWidget[]): LayoutPreset {
    const sides = new Set(widgets.map((w) => w.side));
    const hasLeft = sides.has('left');
    const hasCenter = sides.has('center');
    const hasRight = sides.has('right');

    if (hasLeft && hasCenter && hasRight) return 'left-center-right';
    if (hasLeft && hasCenter) return 'left-center';
    if (hasCenter && hasRight) return 'center-right';
    if (hasLeft && hasRight) return 'left-right';
    return 'center-only';
}

const SIDE_FALLBACK: Record<UIFeedWidgetSide, UIFeedWidgetSide[]> = {
    left: ['right', 'center'],
    center: ['right', 'left'],
    right: ['center', 'left'],
};

function resolveSide(
    defaultSide: UIFeedWidgetSide,
    activeSides: UIFeedWidgetSide[],
): UIFeedWidgetSide {
    if (activeSides.includes(defaultSide)) return defaultSide;
    return (
        SIDE_FALLBACK[defaultSide].find((s) => activeSides.includes(s)) ??
        activeSides[0]
    );
}

function buildPresetWidgets(preset: LayoutPreset): UIFeedWidget[] {
    const activeSides = PRESET_COLUMNS[preset];
    return ALL_WIDGET_SLUGS.map((slug) => ({
        slug,
        side: resolveSide(WIDGET_REGISTRY[slug].defaultSide, activeSides),
        order: 0,
    }));
}

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
    return COLUMNS.flatMap((side) =>
        grouped[side].map((w, i) => ({ ...w, order: i + 1 })),
    );
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

// --- Layout Preset Selector ---

const PresetThumbnail: FC<{
    bars: (typeof PRESET_META)[number]['bars'];
    checked: boolean;
}> = ({ bars, checked }) => (
    <div className="flex h-8 w-full items-stretch gap-1">
        {bars.map((bar, i) => (
            <div
                key={i}
                style={{ flex: bar.flex }}
                className={cn(
                    'rounded-sm transition-colors',
                    bar.type === 'center'
                        ? checked
                            ? 'bg-primary-foreground/60'
                            : 'bg-primary-foreground/20'
                        : checked
                          ? 'bg-muted-foreground/60'
                          : 'bg-muted-foreground/20',
                )}
            />
        ))}
    </div>
);

const LayoutPresetSelector: FC<{
    value: LayoutPreset;
    onChange: (preset: LayoutPreset) => void;
}> = ({ value, onChange }) => {
    return (
        <RadioGroup
            value={value}
            onValueChange={(v) => onChange(v as LayoutPreset)}
            className="grid grid-cols-3 gap-2 sm:grid-cols-5 p-4"
        >
            {PRESET_META.map((preset) => (
                <FieldLabel
                    key={preset.id}
                    className="transition-colors hover:bg-secondary/60"
                >
                    <Field>
                        <RadioGroupItem
                            value={preset.id}
                            id={`preset-${preset.id}`}
                            className="sr-only"
                        />
                        <div className="flex cursor-pointer flex-col items-center gap-2">
                            <PresetThumbnail
                                bars={preset.bars}
                                checked={value === preset.id}
                            />
                            <span
                                className={cn(
                                    'text-xs leading-tight font-medium',
                                    value === preset.id
                                        ? 'text-primary-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {preset.label}
                            </span>
                        </div>
                    </Field>
                </FieldLabel>
            ))}
        </RadioGroup>
    );
};

// --- DnD Components ---

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
            className={cn(
                'border bg-secondary/20 flex touch-none items-center gap-2 rounded-lg p-2',
                isDragging ? 'cursor-grabbing' : 'cursor-grab',
            )}
            {...attributes}
            {...listeners}
        >
            <GripVertical className="text-muted-foreground size-4 shrink-0" />
            <span className="flex-1 text-xs font-medium">
                {meta?.title ?? widget.slug}
            </span>
            <button
                className="text-muted-foreground hover:text-foreground flex size-6 shrink-0 items-center justify-center rounded-sm"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onRemove(widget.slug)}
                aria-label={`Видалити ${meta?.title ?? widget.slug}`}
            >
                <X className="size-3.5" />
            </button>
        </div>
    );
};

function isSidebarTabbed(
    side: UIFeedWidgetSide,
    preset: LayoutPreset,
): boolean {
    if (side === 'center') return false;
    if (preset === 'left-right') return false;
    return true;
}

const DroppableColumn: FC<{
    side: UIFeedWidgetSide;
    widgets: UIFeedWidget[];
    preset: LayoutPreset;
    onRemove: (slug: UIFeedWidgetSlug) => void;
}> = ({ side, widgets, preset, onRemove }) => {
    const { setNodeRef } = useDroppable({ id: side });
    const showTabHint = isSidebarTabbed(side, preset);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
                <Label className="text-muted-foreground text-sm">
                    {COLUMN_LABELS[side]}
                </Label>
                {showTabHint && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Smartphone className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent>
                                На мобільних пристроях – вкладки
                            </TooltipContent>
                        </TooltipPortal>
                    </Tooltip>
                )}
            </div>
            <SortableContext
                items={widgets.map((w) => w.slug)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className="flex min-h-24 flex-col gap-1.5 rounded-lg border border-dashed bg-secondary/20 p-2 transition-colors"
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

// --- Main Content ---

const LayoutSettingsContent = () => {
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const [widgets, setWidgets] = useState<UIFeedWidget[]>(
        () => preferences.feed.widgets,
    );
    const [preset, setPreset] = useState<LayoutPreset>(() =>
        derivePreset(preferences.feed.widgets),
    );

    const widgetsRef = useRef(widgets);
    widgetsRef.current = widgets;
    const preDragRef = useRef<UIFeedWidget[] | null>(null);

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

    const persist = (next: UIFeedWidget[]) => {
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
        const meta = WIDGET_REGISTRY[slug];
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
        <div className="flex flex-col -m-4 overflow-hidden">
            <LayoutPresetSelector
                value={preset}
                onChange={handlePresetChange}
            />

            <Separator />

            <DndContext
                sensors={sensors}
                collisionDetection={itemPreferringCollision}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col gap-4 p-4 overflow-y-scroll flex-1">
                    <div
                        className={cn(
                            'grid grid-cols-1 gap-3',
                            activeColumns.length === 3 && 'sm:grid-cols-3',
                            activeColumns.length === 2 && 'sm:grid-cols-2',
                        )}
                    >
                        {activeColumns.map((side) => (
                            <DroppableColumn
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

export default LayoutSettingsContent;
