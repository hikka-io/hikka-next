import { ReactNode } from 'react';

import { cn } from '@/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function H2({ children, className }: Props) {
    return (
        <h2
            className={cn(
                'scroll-m-20 text-2xl font-display font-bold tracking-normal first:mt-0',
                className,
            )}
        >
            {children}
        </h2>
    );
}
