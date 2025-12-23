import { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const BLOCKQUOTE_CLASSNAME = 'border-l-2 pl-6 italic';

export default function Blockquote({ children, className }: Props) {
    return (
        <blockquote className={cn(BLOCKQUOTE_CLASSNAME, className)}>
            {children}
        </blockquote>
    );
}
