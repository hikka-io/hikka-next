import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export const UL_CLASSNAME = 'ml-6 list-disc [&>li]:mt-2';

export default function Ul({ children, className }: Props) {
    return <ul className={cn(UL_CLASSNAME, className)}>{children}</ul>;
}
