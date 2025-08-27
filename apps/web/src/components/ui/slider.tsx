'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/utils/utils';

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            'relative flex w-full touch-none select-none items-center ',
            className,
        )}
        value={value}
        {...props}
    >
        <SliderPrimitive.Track className="relative my-2 h-2 w-full grow overflow-hidden rounded-full bg-primary-foreground/20">
            <SliderPrimitive.Range className="absolute h-full bg-primary-foreground" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-5 rounded-full border-2 border-primary-foreground bg-primary ring-offset-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50" />
        {value && value.length === 2 && (
            <SliderPrimitive.Thumb className="block size-5 rounded-full border-2 border-primary-foreground bg-primary ring-offset-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50" />
        )}
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
