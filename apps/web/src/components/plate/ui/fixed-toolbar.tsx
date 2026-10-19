import { type ReactNode, useRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import { Toolbar } from './toolbar';

const fixedToolbarVariants = cva(
    'left-0 w-full justify-between self-start p-1 z-50 rounded-md backdrop-blur',
    {
        defaultVariants: {
            variant: 'default',
        },
        variants: {
            variant: {
                default: 'sticky bottom-0 border-t',
                top: 'sticky top-[var(--plate-sticky-top,calc(3.5rem+env(safe-area-inset-top)))] md:top-[var(--plate-sticky-top,4rem)] overflow-x-auto border-b',
                // Pinned to the visible bottom (`useKeyboardInset`). While the keyboard is open, iOS Safari floats its
                // address bar over the strip just above it and takes the taps there, so the buttons sit above that strip.
                docked: 'fixed inset-x-0 bottom-(--keyboard-inset,0px) w-auto rounded-none border-t bg-background/80 px-2 pb-[calc(0.25rem+max(var(--safe-area-bottom),min(var(--keyboard-height,0px),3rem)))]',
            },
        },
    },
);

export function FixedToolbar(
    props: React.ComponentProps<typeof Toolbar> &
        VariantProps<typeof fixedToolbarVariants>,
) {
    return (
        <Toolbar
            {...props}
            className={cn(
                fixedToolbarVariants({ variant: props.variant }),
                props.className,
            )}
        />
    );
}

/** Scrolls a row of toolbar buttons sideways on narrow screens, fading the clipped edge. */
export function FixedToolbarScroller({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    return (
        <div
            ref={scrollRef}
            className={cn(
                'no-scrollbar flex flex-1 overflow-x-scroll md:overflow-x-hidden',
                gradientClassName,
                className,
            )}
        >
            {children}
        </div>
    );
}
