import { ReactNode } from 'react';

import { cn } from '../../utils/utils';

interface Props {
    children?: ReactNode | string;
    className?: string;
}

export default function P({ children, className }: Props) {
    return <p className={cn(className)}>{children}</p>;
}
