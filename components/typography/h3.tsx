import { ReactNode } from 'react';

import { cn } from '@/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function H3({ children, className }: Props) {
    return (
        <h3
            className={cn(
                'scroll-m-20 text-xl font-display font-bold tracking-tight',
                className,
            )}
        >
            {children}
        </h3>
    );
}
