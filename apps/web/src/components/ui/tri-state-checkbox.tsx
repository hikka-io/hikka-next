'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/utils';

export type TriState = 'include' | 'exclude' | 'neutral';

interface TriStateCheckboxProps
    extends Omit<
        React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
        'checked' | 'onCheckedChange'
    > {
    value?: TriState;
    onValueChange?: (value: TriState) => void;
}

const TriStateCheckbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    TriStateCheckboxProps
>(({ className, value = 'neutral', onValueChange, ...props }, ref) => {
    const handleInteraction = () => {
        if (!onValueChange) return;

        if (value === 'neutral') {
            onValueChange('include');
        } else if (value === 'include') {
            onValueChange('exclude');
        } else {
            onValueChange('neutral');
        }
    };

    return (
        <CheckboxPrimitive.Root
            ref={ref}
            checked={
                value === 'include'
                    ? true
                    : value === 'exclude'
                        ? 'indeterminate'
                        : false
            }
            onClick={handleInteraction}
            className={cn(
                'peer size-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                className={cn('flex items-center justify-center text-current')}
            >
                {value === 'include' && <Check className="!size-4" />}
                {value === 'exclude' && <Minus className="!size-4" />}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
});
TriStateCheckbox.displayName = 'TriStateCheckbox';

export { TriStateCheckbox };
