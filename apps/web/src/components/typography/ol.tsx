import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const OL_CLASSNAME = 'ml-6 list-decimal [&>li]:mt-2';

export default function Ol({ children, className }: Props) {
    return <ol className={cn(OL_CLASSNAME, className)}>{children}</ol>;
}
