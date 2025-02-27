import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function Blockquote({ children, className }: Props) {
    return (
        <blockquote
            className={cn('text-base mt-6 border-l-2 pl-6 italic', className)}
        >
            {children}
        </blockquote>
    );
}
