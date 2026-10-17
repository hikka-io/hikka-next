import { type FC, type ReactNode, useRef } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/utils/cn';

import { CloseSelectionButton } from './graph-details';
import GraphIconButton from './graph-icon-button';

const SWIPE_DISTANCE = 32;

type Props = {
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    onClose: () => void;
    children: ReactNode;
};

const GraphSheet: FC<Props> = ({
    expanded,
    onExpandedChange,
    onClose,
    children,
}) => {
    const startRef = useRef<number | null>(null);

    const onSwipeEnd = (y: number) => {
        const distance = y - (startRef.current ?? y);
        startRef.current = null;

        if (distance < -SWIPE_DISTANCE) onExpandedChange(true);
        else if (distance > SWIPE_DISTANCE) {
            if (expanded) onExpandedChange(false);
            else onClose();
        }
    };

    return (
        <section
            aria-label="Обраний тайтл"
            className={cn(
                'pointer-events-auto flex w-full flex-col gap-2 rounded-t-xl border-t bg-popover px-4 pb-[calc(--spacing(4)+var(--safe-area-bottom))] text-popover-foreground',
                expanded && 'max-h-[70dvh] gap-4 overflow-y-auto',
            )}
        >
            <div
                onPointerDown={(event) => {
                    startRef.current = event.clientY;
                }}
                onPointerUp={(event) => onSwipeEnd(event.clientY)}
                className="relative -mr-2 flex h-10 shrink-0 touch-none items-center justify-end"
            >
                <span className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-muted" />
                <GraphIconButton
                    label={expanded ? 'Згорнути' : 'Розгорнути'}
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onExpandedChange(!expanded)}
                    className="text-muted-foreground"
                >
                    {expanded ? <ChevronDown /> : <ChevronUp />}
                </GraphIconButton>
                <CloseSelectionButton onClose={onClose} />
            </div>
            {children}
        </section>
    );
};

export default GraphSheet;
