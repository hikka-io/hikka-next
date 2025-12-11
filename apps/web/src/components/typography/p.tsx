import { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    children?: ReactNode | string;
    className?: string;
}

export const P_CLASSNAME = 'break-words';

export default function P({ children, className }: Props) {
    return <p className={cn(P_CLASSNAME, className)}>{children}</p>;
}
