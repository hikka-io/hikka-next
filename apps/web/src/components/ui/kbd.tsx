import type * as React from 'react';

import { cn } from '@/utils/cn';

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
    return (
        <kbd
            data-slot="kbd"
            className={cn(
                'pointer-events-none flex select-none items-center gap-1 rounded bg-muted px-1.5 font-medium font-mono text-[10px]',
                className,
            )}
            {...props}
        />
    );
}

export { Kbd };
