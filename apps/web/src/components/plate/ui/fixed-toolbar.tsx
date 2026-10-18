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
                // Above the tab bar, or above the keyboard while it is open (`useKeyboardInset`).
                docked: '-mx-4 sticky bottom-[max(var(--tab-bar-height),var(--keyboard-inset,0px))] w-auto self-stretch rounded-none border-t bg-background/80 px-2',
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
