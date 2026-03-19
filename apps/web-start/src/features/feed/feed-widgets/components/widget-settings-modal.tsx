'use client';

import {
    DndContext,
    DragEndEvent,
    MouseSensor,
    TouchSensor,
    closestCenter,
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
import { HomeWidgetsEnum } from '@hikka/client';
import { GripVertical } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';
import { AVAILABLE_WIDGETS } from '@/utils/constants/feed';

interface WidgetItem {
    id: HomeWidgetsEnum;
    visible: boolean;
}

interface SortableWidgetRowProps {
    widget: WidgetItem;
    onToggle: (id: HomeWidgetsEnum, visible: boolean) => void;
}

const SortableWidgetRow: FC<SortableWidgetRowProps> = ({
    widget,
    onToggle,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: widget.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const widgetMeta = AVAILABLE_WIDGETS.find((w) => w.id === widget.id);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border-border bg-secondary/30 flex items-center gap-3 rounded-lg border p-3"
        >
            <button
                className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="size-4" />
            </button>
            <div className="flex flex-1 flex-col gap-1">
                <Label>{widgetMeta?.title ?? widget.id}</Label>
                {widgetMeta?.description && (
                    <p className="text-muted-foreground text-xs">
                        {widgetMeta?.description}
                    </p>
                )}
            </div>

            <Switch
                checked={widget.visible}
                onCheckedChange={(checked) => onToggle(widget.id, checked)}
            />
        </div>
    );
};

function deriveWidgetItems(
    homeWidgets: HomeWidgetsEnum[] | undefined,
): WidgetItem[] {
    const allIds = AVAILABLE_WIDGETS.map((w) => w.id);

    if (homeWidgets === undefined) {
        return allIds.map((id) => ({ id, visible: true }));
    }

    const visibleSet = new Set(homeWidgets);
    const ordered: WidgetItem[] = homeWidgets.map((id) => ({
        id,
        visible: true,
    }));
    const hidden = allIds
        .filter((id) => !visibleSet.has(id))
        .map((id) => ({ id, visible: false }));

    return [...ordered, ...hidden];
}

function toHomeWidgets(items: WidgetItem[]): HomeWidgetsEnum[] {
    return items.filter((w) => w.visible).map((w) => w.id);
}

const WidgetSettingsContent = () => {
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();
    const homeWidgets = preferences.home_widgets;
    const setHomeWidgets = (widgets: HomeWidgetsEnum[]) =>
        update({ preferences: { home_widgets: widgets } });

    const initialItems = useMemo(
        () => deriveWidgetItems(homeWidgets),
        [homeWidgets],
    );

    const [items, setItems] = useState<WidgetItem[]>(initialItems);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const updateItems = (next: WidgetItem[]) => {
        setItems(next);
        setHomeWidgets(toHomeWidgets(next));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeIndex = items.findIndex((w) => w.id === active.id);
        const overIndex = items.findIndex((w) => w.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
            updateItems(arrayMove(items, activeIndex, overIndex));
        }
    };

    const handleToggle = (id: HomeWidgetsEnum, visible: boolean) => {
        updateItems(items.map((w) => (w.id === id ? { ...w, visible } : w)));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((w) => w.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-2">
                    {items.map((widget) => (
                        <SortableWidgetRow
                            key={widget.id}
                            widget={widget}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default WidgetSettingsContent;
