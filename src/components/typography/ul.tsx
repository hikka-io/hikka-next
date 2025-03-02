import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function Ul({ children, className }: Props) {
    return (
        <ul className={cn('ml-6 list-disc [&>li]:mt-2', className)}>
            {children}
        </ul>
    );
}
