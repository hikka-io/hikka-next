'use client';

import { cn } from '@/utils/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
    return (
        <Toolbar
            {...props}
            className={cn(
                'scrollbar-hide supports-backdrop-blur:bg-secondary/20 sticky left-0 top-16 z-50 w-full justify-between self-start overflow-x-auto rounded-t-lg border-b border-b-border bg-secondary/20 p-1 backdrop-blur-xl',
                props.className,
            )}
        />
    );
}
