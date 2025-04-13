import { ReactNode } from 'react';

import { cn } from '../../utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const H3_CLASSNAME =
    'scroll-m-20 font-display text-xl font-bold tracking-normal';

export default function H3({ children, className }: Props) {
    return <h3 className={cn(H3_CLASSNAME, className)}>{children}</h3>;
}
