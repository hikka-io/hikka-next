import { type ComponentPropsWithoutRef, type FC, useRef } from 'react';

import { ImagePresetContext } from '@/components/content-card/image-preset-context';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import type { ImagePreset } from '@/utils/constants/image-presets';

export type StackSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type StackProps = ComponentPropsWithoutRef<'div'> & {
    extended?: boolean;
    /** Number of columns for standard layout */
    size?: StackSize;
    /** Number of columns for extended layout */
    extendedSize?: StackSize;
    gap?: 'sm' | 'md' | 'lg';
    imagePreset?: ImagePreset;
    visibleScrollbar?: boolean;
};

const SIZES: Record<StackSize, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-4 md:grid-cols-6',
    7: 'grid-cols-5 md:grid-cols-7',
    8: 'grid-cols-6 md:grid-cols-8',
};

const EXTENDED_SIZES: Record<StackSize, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
    7: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-7',
    8: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-8',
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
    gap = 'md',
    visibleScrollbar = false,
    imagePreset,
    className,
    ...props
}) => {
    const ref = useRef(null);
    const { gradientClassName } = useScrollGradientMask(ref, 'horizontal');

    const content = (
        <div
            ref={ref}
            className={cn(
                'relative grid',
                '-my-4 py-4',
                GAP_CLASSES[gap],
                size && SIZES[size],
                !visibleScrollbar && 'no-scrollbar',
                extended
                    ? extendedSize
                        ? EXTENDED_SIZES[extendedSize]
                        : 'grid-cols-2 md:grid-cols-6'
                    : `md:gradient-mask-none -mx-4 auto-cols-scroll grid-flow-col grid-cols-scroll overflow-x-scroll px-4 ${gradientClassName}`,

                className,
            )}
            {...props}
        >
            {children}
        </div>
    );

    if (imagePreset) {
        return (
            <ImagePresetContext value={imagePreset}>
                {content}
            </ImagePresetContext>
        );
    }

    return content;
};

export default Stack;
