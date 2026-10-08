import type { FC } from 'react';

import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { GripVertical, Smartphone, X } from 'lucide-react';

import type { UiFeedWidget } from '@hikka/api';

import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

import type { LayoutPreset } from '../layout';
import type {
    SupportedWidgetSlug,
    UIFeedWidgetSide,
    UIFeedWidgetSlug,
} from '../types';
import { WIDGET_REGISTRY } from '../widgets/registry';

const COLUMN_LABELS: Record<UIFeedWidgetSide, string> = {
    left: 'Ліва панель',
    center: 'Центр',
    right: 'Права панель',
};

const SortableWidgetItem: FC<{
    widget: UiFeedWidget;
    index: number;
    onRemove: (slug: UIFeedWidgetSlug) => void;
}> = ({ widget, index, onRemove }) => {
    const { ref, isDragging } = useSortable({
        id: widget.slug,
        index,
        group: widget.side,
    });

    const meta = WIDGET_REGISTRY[widget.slug as SupportedWidgetSlug];

    return (
        <div
            ref={ref}
            className={cn(
                'surface flex cursor-grab touch-none items-center gap-2 rounded-lg border p-2',
                isDragging && 'opacity-50',
            )}
        >
            <GripVertical className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 font-medium text-xs">
                {meta?.title ?? widget.slug}
            </span>
            <button
                type="button"
                className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
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

type Props = {
    side: UIFeedWidgetSide;
    widgets: UiFeedWidget[];
    preset: LayoutPreset;
    onRemove: (slug: UIFeedWidgetSlug) => void;
};

const WidgetColumn: FC<Props> = ({ side, widgets, preset, onRemove }) => {
    const { ref } = useDroppable({
        id: side,
        collisionPriority: CollisionPriority.Low,
    });
    const showTabHint = isSidebarTabbed(side, preset);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
                <Label className="text-muted-foreground text-sm">
                    {COLUMN_LABELS[side]}
                </Label>
                {showTabHint && (
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Smartphone className="size-4 text-muted-foreground" />
                            }
                        />
                        <TooltipContent>
                            На мобільних пристроях – вкладки
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            <div
                ref={ref}
                className="surface-inset flex min-h-24 flex-col gap-1.5 rounded-lg border border-dashed p-2 transition-colors"
            >
                {widgets.map((widget, index) => (
                    <SortableWidgetItem
                        key={widget.slug}
                        widget={widget}
                        index={index}
                        onRemove={onRemove}
                    />
                ))}
                {widgets.length === 0 && (
                    <p className="flex flex-1 items-center justify-center text-muted-foreground text-xs">
                        Перетягніть сюди
                    </p>
                )}
            </div>
        </div>
    );
};

export default WidgetColumn;
