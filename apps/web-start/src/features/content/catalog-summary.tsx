import type { FC } from 'react';

import { cn } from '@/utils/cn';

import ActiveFilters, { useActiveFilters } from './active-filters';

type Props = {
    total?: number;
    isLoading: boolean;
    className?: string;
};

/**
 * Generic catalog summary: "Знайдено N результатів" + optional active filter chips.
 * Reusable across /anime, /manga, /novel catalog pages.
 */
const CatalogSummary: FC<Props> = ({ total, isLoading, className }) => {
    const { count: activeCount } = useActiveFilters();

    return (
        <div
            className={cn(
                'flex min-h-6 flex-wrap items-center gap-x-4 gap-y-2',
                className,
            )}
        >
            <div className="shrink-0 text-muted-foreground text-sm">
                {isLoading || total == null ? (
                    <span className="inline-block h-4 w-40 animate-pulse rounded bg-secondary/40" />
                ) : (
                    <>
                        Знайдено{' '}
                        <span className="font-semibold text-foreground">
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
