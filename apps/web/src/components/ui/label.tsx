import type * as React from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const labelVariants = cva(
    'text-sm font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

function Label({ className, ...props }: React.ComponentProps<'label'>) {
    return (
        // biome-ignore lint/a11y/noLabelWithoutControl: primitive; htmlFor and children arrive through props
        <label
            data-slot="label"
            className={cn(labelVariants(), className)}
            {...props}
        />
    );
}

export { Label, labelVariants };
