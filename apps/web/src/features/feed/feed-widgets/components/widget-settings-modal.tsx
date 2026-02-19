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
import { GripVertical } from 'lucide-react';
import { FC, useMemo } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useSettingsStore } from '@/services/stores/settings-store';

import { AVAILABLE_WIDGETS, WidgetConfig } from '../../types';

interface SortableWidgetRowProps {
    widget: WidgetConfig;
    onToggle: (id: string, visible: boolean) => void;
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
            className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
        >
            <button
                className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="size-4" />
            </button>
            <Label className="flex-1">{widgetMeta?.title ?? widget.id}</Label>
            <Switch
                checked={widget.visible}
                onCheckedChange={(checked) => onToggle(widget.id, checked)}
            />
        </div>
    );
};

const WidgetSettingsContent = () => {
    const { preferences, setWidgets } = useSettingsStore();

    const widgets = useMemo<WidgetConfig[]>(() => {
        const existing = preferences.widgets;
        const knownIds = new Set(existing.map((w) => w.id));
        const newWidgets = AVAILABLE_WIDGETS.filter(
            (aw) => !knownIds.has(aw.id),
        ).map((aw) => ({ id: aw.id, visible: true }));
        return [...existing, ...newWidgets];
    }, [preferences.widgets]);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeIndex = widgets.findIndex((w) => w.id === active.id);
        const overIndex = widgets.findIndex((w) => w.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
            setWidgets(arrayMove(widgets, activeIndex, overIndex));
        }
    };

    const handleToggle = (id: string, visible: boolean) => {
        setWidgets(
            widgets.map((w) => (w.id === id ? { ...w, visible } : w)),
        );
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={widgets.map((w) => w.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-2">
                    {widgets.map((widget) => (
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
