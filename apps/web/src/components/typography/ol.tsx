import { ReactNode } from 'react';

import { cn } from '../../utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function Ol({ children, className }: Props) {
    return (
        <ol className={cn('ml-6 list-decimal [&>li]:mt-2', className)}>
            {children}
        </ol>
    );
}
