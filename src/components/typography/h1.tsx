import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const H1_CLASSNAME =
    'scroll-m-20 font-display text-4xl font-bold tracking-normal lg:text-5xl';

export default function H1({ children, className }: Props) {
    return <h1 className={cn(H1_CLASSNAME, className)}>{children}</h1>;
}
