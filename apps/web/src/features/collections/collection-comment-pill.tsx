import { type FC, type MouseEvent, useRef } from 'react';

import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import CardOverlayPill from './card-overlay-pill';

type Props = {
    comment: string;
    /** Flags a comment the backend would reject. */
    warning?: boolean;
    /** Replaces the phone popover: the click opens the item instead. */
    onClick?: (event: MouseEvent) => void;
    className?: string;
};

const ScrollableComment: FC<{ comment: string }> = ({ comment }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(ref);

    return (
        <div
            ref={ref}
            className={cn(
                'max-h-48 max-w-64 overflow-y-auto whitespace-pre-line px-3 py-2 text-sm',
                gradientClassName,
            )}
        >
            {comment.trim()}
        </div>
    );
};

const CollectionCommentPill: FC<Props> = ({
    comment,
    warning,
    onClick,
    className,
}) => {
    const isDesktop = useIsDesktop();
    const pillRef = useRef<HTMLDivElement>(null);

    const trigger = (
        <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Коментар"
            onClick={onClick}
            className={cn(
                'pointer-coarse:size-8',
                warning &&
                    'text-destructive-foreground hover:text-destructive-foreground',
            )}
        />
    );

    return (
        <CardOverlayPill ref={pillRef} className={className}>
            {isDesktop || onClick ? (
                <Tooltip>
                    <TooltipTrigger render={trigger}>
                        <Info />
                    </TooltipTrigger>
                    <TooltipContent
                        anchor={pillRef}
                        align="end"
                        className="p-0"
                    >
                        <ScrollableComment comment={comment} />
                    </TooltipContent>
                </Tooltip>
            ) : (
                <Popover>
                    <PopoverTrigger render={trigger}>
                        <Info />
                    </PopoverTrigger>
                    <PopoverContent
                        anchor={pillRef}
                        side="top"
                        align="end"
                        className="p-0"
                    >
                        <ScrollableComment comment={comment} />
                    </PopoverContent>
                </Popover>
            )}
        </CardOverlayPill>
    );
};

export default CollectionCommentPill;
