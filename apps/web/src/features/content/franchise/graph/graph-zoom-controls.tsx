import type { FC, ReactNode } from 'react';

import { LocateFixed, Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    onFit: () => void;
    onLocate: () => void;
    size: 'sm' | 'md';
    className?: string;
};

const ZoomButton: FC<{
    label: string;
    size: Props['size'];
    disabled?: boolean;
    onClick: () => void;
    className?: string;
    children: ReactNode;
}> = ({ label, size, disabled, onClick, className, children }) => (
    <Tooltip>
        <TooltipTrigger
            render={
                <Button
                    variant="ghost"
                    size={size === 'md' ? 'icon-md' : 'icon-sm'}
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
    onFit,
    onLocate,
    size,
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
            size={size}
            disabled={!canZoomOut}
            onClick={onZoomOut}
        >
            <Minus />
        </ZoomButton>
        <ZoomButton
            label="Показати всю франшизу"
            size={size}
            onClick={onFit}
            className="w-12 text-foreground text-xs tabular-nums"
        >
            {Math.round(zoom * 100)}%
        </ZoomButton>
        <ZoomButton
            label="Наблизити"
            size={size}
            disabled={!canZoomIn}
            onClick={onZoomIn}
        >
            <Plus />
        </ZoomButton>
        <Separator orientation="vertical" className="mx-0.5 h-4" />
        <ZoomButton label="До цього тайтлу" size={size} onClick={onLocate}>
            <LocateFixed />
        </ZoomButton>
    </fieldset>
);

export default GraphZoomControls;
