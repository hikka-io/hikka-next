'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/utils/cn';

type ShowValueMode = 'always' | 'on-interaction' | 'never';

interface SliderProps
    extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    /**
     * Controls when to display value above thumb
     * - "always": Value is always visible above thumb
     * - "on-interaction": Value shows on hover and during drag
     * - "never": No value display (default)
     */
    showValue?: ShowValueMode;
    /**
     * Optional function to format the displayed value
     * @param value - The current value of the thumb
     * @returns Formatted string or ReactNode to display
     */
    formatValue?: (value: number) => React.ReactNode;
}

interface ThumbWithValueProps {
    value: number;
    showValue: ShowValueMode;
    formatValue?: (value: number) => React.ReactNode;
    isInteracting: boolean;
    onInteractionStart: () => void;
    onInteractionEnd: () => void;
}

const ThumbWithValue = React.forwardRef<HTMLSpanElement, ThumbWithValueProps>(
    (
        {
            value,
            showValue,
            formatValue,
            isInteracting,
            onInteractionStart,
            onInteractionEnd,
        },
        ref,
    ) => {
        const [isHovered, setIsHovered] = React.useState(false);

        const shouldShowValue =
            showValue === 'always' ||
            (showValue === 'on-interaction' && (isHovered || isInteracting));

        const displayValue = formatValue ? formatValue(value) : value;

        return (
            <SliderPrimitive.Thumb
                ref={ref}
                className="group relative block size-5 rounded-full border-2 border-primary-foreground bg-primary ring-offset-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onPointerDown={onInteractionStart}
                onPointerUp={onInteractionEnd}
            >
                {showValue !== 'never' && (
                    <span
                        className={cn(
                            'absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-sm bg-popover border text-popover-foreground shadow-md px-2 py-1 text-xs font-medium transition-opacity',
                            showValue === 'always' && 'opacity-100',
                            showValue === 'on-interaction' &&
                                (shouldShowValue
                                    ? 'opacity-100'
                                    : 'pointer-events-none opacity-0'),
                        )}
                    >
                        {displayValue}
                    </span>
                )}
            </SliderPrimitive.Thumb>
        );
    },
);

ThumbWithValue.displayName = 'ThumbWithValue';

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    SliderProps
>(({ className, value, showValue = 'never', formatValue, ...props }, ref) => {
    const [isInteracting, setIsInteracting] = React.useState(false);

    React.useEffect(() => {
        if (!isInteracting) return;

        const handlePointerUp = () => setIsInteracting(false);
        document.addEventListener('pointerup', handlePointerUp);
        return () => document.removeEventListener('pointerup', handlePointerUp);
    }, [isInteracting]);

    const thumbCount = value?.length ?? 1;

    return (
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                'relative flex w-full touch-none select-none items-center',
                showValue === 'always' && 'pt-8',
                className,
            )}
            value={value}
            {...props}
        >
            <SliderPrimitive.Track className="relative my-2 h-2 w-full grow overflow-hidden rounded-full bg-primary-foreground/20">
                <SliderPrimitive.Range className="absolute h-full bg-primary-foreground" />
            </SliderPrimitive.Track>
            {Array.from({ length: thumbCount }).map((_, index) => (
                <ThumbWithValue
                    key={index}
                    value={value?.[index] ?? 0}
                    showValue={showValue}
                    formatValue={formatValue}
                    isInteracting={isInteracting}
                    onInteractionStart={() => setIsInteracting(true)}
                    onInteractionEnd={() => setIsInteracting(false)}
                />
            ))}
        </SliderPrimitive.Root>
    );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
export type { ShowValueMode, SliderProps };
