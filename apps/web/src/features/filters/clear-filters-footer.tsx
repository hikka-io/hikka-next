import type { FC } from 'react';

import { useRouter, useRouterState } from '@tanstack/react-router';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type Props = {
    className?: string;
    /** Dismisses the surrounding modal; the always-visible sidebar omits it. */
    onDone?: () => void;
    /** Search params that select the list itself (e.g. a tab) rather than filter it. */
    preserve?: string[];
};

/** Footer for the filter panels that have no presets — schedule, articles, edits. */
const ClearFiltersFooter: FC<Props> = ({ className, onDone, preserve }) => {
    const router = useRouter();
    const search = useRouterState({
        select: (s) => (s.resolvedLocation ?? s.location).search,
    }) as Record<string, unknown>;

    const clearFilters = () => {
        const next: Record<string, unknown> = {};

        preserve?.forEach((key) => {
            if (search[key] != null) next[key] = search[key];
        });

        router.navigate({ search: next, replace: true } as any);
    };

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <Button variant="outline" size="md" onClick={clearFilters}>
                <AntDesignClearOutlined /> Очистити
            </Button>
            {onDone && (
                <Button size="md" onClick={onDone}>
                    Готово
                </Button>
            )}
        </div>
    );
};

export default ClearFiltersFooter;
