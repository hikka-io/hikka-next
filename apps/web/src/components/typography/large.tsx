import { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function Large({ children, className }: Props) {
    return (
        <div className={cn('text-lg font-semibold', className)}>{children}</div>
    );
}
