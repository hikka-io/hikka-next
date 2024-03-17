import { ReactNode } from 'react';

import { cn } from '@/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function H5({ children, className }: Props) {
    return (
        <h5
            className={cn(
                'scroll-m-20 font-display text-base font-bold tracking-normal',
                className,
            )}
        >
            {children}
        </h5>
    );
}
