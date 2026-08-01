import type { FC } from 'react';

import { useRouter } from '@tanstack/react-router';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type Props = {
    className?: string;
    /** Dismisses the surrounding modal; the always-visible sidebar omits it. */
    onDone?: () => void;
};

/** Footer for the filter panels that have no presets — schedule, articles, edits. */
const ClearFiltersFooter: FC<Props> = ({ className, onDone }) => {
    const router = useRouter();

    const clearFilters = () => {
        router.navigate({ search: {}, replace: true } as any);
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
