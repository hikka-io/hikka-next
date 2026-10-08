import type { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { useClearFilters } from './use-clear-filters';

type Props = {
    className?: string;
    /** Dismisses the surrounding modal; the always-visible sidebar omits it. */
    onDone?: () => void;
    /** Search params that select the list itself (e.g. a tab) rather than filter it. */
    preserve?: string[];
};

/** Footer for the filter panels that have no presets — schedule, articles, edits. */
const ClearFiltersFooter: FC<Props> = ({
    className,
    onDone,
    preserve = [],
}) => {
    const clearFilters = useClearFilters({ preserve });

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
