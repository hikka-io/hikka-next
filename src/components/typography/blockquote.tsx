import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const BlockquoteClassName = 'mt-6 border-l-2 pl-6 italic';

export default function Blockquote({ children, className }: Props) {
    return (
        <blockquote className={cn(BlockquoteClassName, className)}>
            {children}
        </blockquote>
    );
}
