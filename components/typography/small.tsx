import { ReactNode } from 'react';

import { cn } from '@/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function Small({ children, className }: Props) {
    return (
        <small className={cn('text-xs leading-normal', className)}>
            {children}
        </small>
    );
}
