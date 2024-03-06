import { ReactNode } from 'react';

import { cn } from '@/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function Blockquote({ children, className }: Props) {
    return (
        <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)}>
            {children}
        </blockquote>
    );
}
