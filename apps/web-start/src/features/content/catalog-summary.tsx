'use client';

import { FC } from 'react';

import { cn } from '@/utils/cn';

import ActiveFilters, { useActiveFilters } from './active-filters';

interface Props {
    total?: number;
    isLoading: boolean;
    className?: string;
}

/**
 * Generic catalog summary: "Знайдено N результатів" + optional active filter chips.
 * Reusable across /anime, /manga, /novel catalog pages.
 */
const CatalogSummary: FC<Props> = ({ total, isLoading, className }) => {
    const { count: activeCount } = useActiveFilters();

    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-x-4 gap-y-2',
                className,
            )}
        >
            <div className="text-muted-foreground shrink-0 text-sm">
                {isLoading || total == null ? (
                    <span className="bg-secondary/40 inline-block h-4 w-40 animate-pulse rounded" />
                ) : (
                    <>
                        Знайдено{' '}
                        <span className="text-foreground font-semibold">
                            {total.toLocaleString('uk-UA')}
                        </span>{' '}
                        результатів
                    </>
                )}
            </div>
            {activeCount > 0 && <ActiveFilters />}
        </div>
    );
};

export default CatalogSummary;
