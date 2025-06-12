import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const H4_CLASSNAME =
    'scroll-m-20 font-display text-base font-bold tracking-normal';

export default function H4({ children, className }: Props) {
    return <h4 className={cn(H4_CLASSNAME, className)}>{children}</h4>;
}
