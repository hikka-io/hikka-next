import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const H5_CLASSNAME =
    'scroll-m-20 font-display text-base font-bold tracking-normal';

export default function H5({ children, className }: Props) {
    return <h5 className={cn(H5_CLASSNAME, className)}>{children}</h5>;
}
