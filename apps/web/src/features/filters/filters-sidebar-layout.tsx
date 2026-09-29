import type { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import { useFiltersSidebar } from './use-filters-sidebar';

type Props = {
    sidebar: ReactNode;
    children: ReactNode;
    storageKey?: string;
    collapsible?: boolean;
    className?: string;
    contentClassName?: string;
};

const FiltersSidebarLayout: FC<Props> = ({
    sidebar,
    children,
    storageKey,
    collapsible = true,
    className,
    contentClassName = 'flex flex-col gap-4',
}) => {
    const { visible } = useFiltersSidebar(storageKey);
    const sidebarVisible = !collapsible || visible;

    return (
        <div
            className={
                className ??
                cn(
                    'grid grid-cols-1 lg:items-start lg:gap-x-10',
                    sidebarVisible &&
                        'lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%]',
                )
            }
        >
            <div className={contentClassName}>{children}</div>

            {sidebarVisible && (
                <div className="sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border border-border surface lg:order-2 lg:flex">
                    {sidebar}
                </div>
            )}
        </div>
    );
};

export default FiltersSidebarLayout;
