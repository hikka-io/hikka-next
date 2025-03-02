import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const H2_CLASSNAME =
    'scroll-m-20 font-display text-2xl font-bold tracking-normal first:mt-0';

export default function H2({ children, className }: Props) {
    return <h2 className={cn(H2_CLASSNAME, className)}>{children}</h2>;
}
