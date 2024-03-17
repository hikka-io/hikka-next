import { ReactNode } from 'react';

import { cn } from '@/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function H4({ children, className }: Props) {
    return (
        <h4
            className={cn(
                'scroll-m-20 font-display text-lg font-bold tracking-normal',
                className,
            )}
        >
            {children}
        </h4>
    );
}
