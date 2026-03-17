'use client';

import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            'grid place-content-center peer size-4 shrink-0 rounded-sm border border-primary-border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn('grid place-content-center text-current')}
        >
            <Check className="size-4!" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
