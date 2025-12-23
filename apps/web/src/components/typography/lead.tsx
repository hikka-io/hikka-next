import { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function Lead({ children, className }: Props) {
    return (
        <p className={cn('text-xl text-muted-foreground', className)}>
            {children}
        </p>
    );
}
