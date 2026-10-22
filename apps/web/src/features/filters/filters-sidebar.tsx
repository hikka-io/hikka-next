import type { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type Props = {
    children: ReactNode;
    className?: string;
};

const FiltersSidebar: FC<Props> = ({ children, className }) => (
    <div
        className={cn(
            'sticky top-20 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border border-border surface',
            className,
        )}
    >
        {children}
    </div>
);

export default FiltersSidebar;
