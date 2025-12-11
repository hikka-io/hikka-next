'use client';

import { ComponentPropsWithoutRef, FC, useRef } from 'react';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

// Define more explicit and comprehensive types
export type StackSize = 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ExtendedStackSize = 2 | 3 | 4 | 5 | 6;

interface StackProps extends ComponentPropsWithoutRef<'div'> {
    /**
     * Determines if the stack should use extended layout
     */
    extended?: boolean;

    /**
     * Number of columns for standard layout
     */
    size?: StackSize;

    /**
     * Number of columns for extended layout
     */
    extendedSize?: ExtendedStackSize;

    /**
     * Custom gap size (defaults to 4 with lg:8)
     */
    gap?: 'sm' | 'md' | 'lg';
}

// Improved type-safe configuration objects
const SIZES: Record<StackSize, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-4 md:grid-cols-6',
    7: 'grid-cols-5 md:grid-cols-7',
    8: 'grid-cols-6 md:grid-cols-8',
};

const EXTENDED_SIZES: Record<ExtendedStackSize, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
};

const GAP_CLASSES = {
    sm: 'gap-2 lg:gap-4',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-4 lg:gap-8',
};

const Stack: FC<StackProps> = ({
    children,
    extended = false,
    size,
    extendedSize,
    gap = 'lg',
    className,
    ...props
}) => {
    const ref = useRef(null);
    const { gradientClassName } = useScrollGradientMask(ref, 'horizontal');

    return (
        <div
            ref={ref}
            className={cn(
                'relative grid',
                // Vertical margin and padding
                '-my-4 py-4',

                // Gap configuration
                GAP_CLASSES[gap],

                // Size configuration for standard layout
                size && SIZES[size],

                // Extended layout configuration
                extended
                    ? extendedSize
                        ? EXTENDED_SIZES[extendedSize]
                        : 'grid-cols-2 md:grid-cols-6'
                    : `no-scrollbar auto-cols-scroll grid-cols-scroll md:gradient-mask-none -mx-4 grid-flow-col overflow-x-scroll px-4 ${gradientClassName}`,

                // Allow additional className overrides
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Stack;
