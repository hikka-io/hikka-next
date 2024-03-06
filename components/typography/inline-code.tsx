import { ReactNode } from 'react';

import { cn } from '@/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function InlineCode({ children, className }: Props) {
    return (
        <code
            className={cn(
                'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
                className,
            )}
        >
            {children}
        </code>
    );
}
