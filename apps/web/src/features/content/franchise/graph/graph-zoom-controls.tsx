import type { FC } from 'react';

import { LocateFixed, Minus, Plus } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';

import GraphIconButton from './graph-icon-button';

type Props = {
    zoom: number;
    canZoomIn: boolean;
    canZoomOut: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFit: () => void;
    onLocate: () => void;
    size: 'sm' | 'md';
    className?: string;
};

const GraphZoomControls: FC<Props> = ({
    zoom,
    canZoomIn,
    canZoomOut,
    onZoomIn,
    onZoomOut,
    onFit,
    onLocate,
    size,
    className,
}) => {
    const button = {
        variant: 'ghost',
        size: size === 'md' ? 'icon-md' : 'icon-sm',
        className: 'text-muted-foreground',
    } as const;

    return (
        <fieldset
            aria-label="Масштаб"
            className={cn(
                'm-0 flex items-center gap-0.5 rounded-md border bg-popover p-0.5 shadow-md',
                className,
            )}
        >
            <GraphIconButton
                {...button}
                label="Віддалити"
                disabled={!canZoomOut}
                onClick={onZoomOut}
            >
                <Minus />
            </GraphIconButton>
            <GraphIconButton
                {...button}
                label="Показати всю франшизу"
                onClick={onFit}
                className="w-12 text-xs tabular-nums"
            >
                {Math.round(zoom * 100)}%
            </GraphIconButton>
            <GraphIconButton
                {...button}
                label="Наблизити"
                disabled={!canZoomIn}
                onClick={onZoomIn}
            >
                <Plus />
            </GraphIconButton>
            <Separator orientation="vertical" className="mx-0.5 h-4" />
            <GraphIconButton
                {...button}
                label="До цього тайтлу"
                onClick={onLocate}
            >
                <LocateFixed />
            </GraphIconButton>
        </fieldset>
    );
};

export default GraphZoomControls;
