import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function H3({ children, className }: Props) {
    return (
        <h3
            className={cn(
                'scroll-m-20 font-display text-xl font-bold tracking-normal',
                className,
            )}
        >
            {children}
        </h3>
    );
}
