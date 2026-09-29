import type { FC } from 'react';

import { ActiveFilters, useActiveFilters } from '@/features/filters';
import { cn } from '@/utils/cn';
import { APP_LOCALE_TAG } from '@/utils/i18n/locale';

type Props = {
    total?: number;
    isLoading: boolean;
    className?: string;
};

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
                {isLoading ? (
                    <span className="inline-block h-4 w-40 animate-pulse rounded bg-secondary/40" />
                ) : (
                    <>
                        Знайдено{' '}
                        <span className="font-semibold text-foreground">
                            {(total ?? 0).toLocaleString(APP_LOCALE_TAG)}
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
