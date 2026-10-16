import type { FC, ReactNode } from 'react';

import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

type Props = {
    zoom: number;
    canZoomIn: boolean;
    canZoomOut: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    className?: string;
};

const ZoomButton: FC<{
    label: string;
    disabled?: boolean;
    onClick: () => void;
    className?: string;
    children: ReactNode;
}> = ({ label, disabled, onClick, className, children }) => (
    <Tooltip>
        <TooltipTrigger
            render={
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={label}
                    disabled={disabled}
                    onClick={onClick}
                    className={cn('text-muted-foreground', className)}
                />
            }
        >
            {children}
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
    </Tooltip>
);

const GraphZoomControls: FC<Props> = ({
    zoom,
    canZoomIn,
    canZoomOut,
    onZoomIn,
    onZoomOut,
    onReset,
    className,
}) => (
    <fieldset
        aria-label="Масштаб"
        className={cn(
            'absolute z-7 m-0 flex items-center gap-0.5 rounded-md border bg-popover p-0.5 shadow-md',
            className,
        )}
    >
        <ZoomButton
            label="Віддалити"
            disabled={!canZoomOut}
            onClick={onZoomOut}
        >
            <Minus />
        </ZoomButton>
        <ZoomButton
            label="Скинути масштаб"
            disabled={zoom === 1}
            onClick={onReset}
            className="w-12 text-foreground text-xs tabular-nums disabled:opacity-100"
        >
            {Math.round(zoom * 100)}%
        </ZoomButton>
        <ZoomButton label="Наблизити" disabled={!canZoomIn} onClick={onZoomIn}>
            <Plus />
        </ZoomButton>
    </fieldset>
);

export default GraphZoomControls;
