'use client';

import { cn } from '@/utils/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
    return (
        <Toolbar
            {...props}
            className={cn(
                'sticky self-start top-16 left-0 z-50 scrollbar-hide w-full justify-between overflow-x-auto border-b border-b-border bg-secondary/20 rounded-t-lg p-1 backdrop-blur-xl supports-backdrop-blur:bg-secondary/20',
                props.className,
            )}
        />
    );
}
