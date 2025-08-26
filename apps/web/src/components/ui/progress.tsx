'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/utils/utils';

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            'bg-primary-foreground/10 relative h-4 w-full overflow-hidden rounded-full',
            className,
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="bg-primary-foreground size-full flex-1 transition-all"
            style={{
                transform: `translateX(-${100 - (100 * (value || 0)) / (max || 100)}%)`,
            }}
        />
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
