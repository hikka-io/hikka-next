import * as React from 'react';
import { FC, createElement } from 'react';
import IcBaselineRemoveCircle from '~icons/ic/baseline-remove-circle';

import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';

import { WATCH_STATUS } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface WatchStatusTriggerProps {
    watch: API.Watch;
    disabled?: boolean;

    deleteFromList(): void;
}

const WatchStatusTrigger: FC<WatchStatusTriggerProps> = ({
    watch,
    disabled,
    deleteFromList,
}) => {
    const handleDeleteFromList = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deleteFromList();
    };

    return (
        <SelectTrigger asChild className="gap-0 border-none p-0">
            <div className="flex w-full">
                <Button
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    {createElement(WATCH_STATUS[watch.status].icon!)}
                    <span className="truncate rounded-none">
                        {WATCH_STATUS[watch.status].title_ua ||
                            WATCH_STATUS[watch.status].title_en}
                    </span>
                    {watch.score > 0 && (
                        <>
                            <span className="opacity-60">-</span>
                            <span className="opacity-60">{watch.score}</span>
                        </>
                    )}
                </Button>
                <Button
                    variant="secondary"
                    size="icon"
                    type="button"
                    onClick={handleDeleteFromList}
                    disabled={disabled}
                    className={cn('rounded-l-none text-xl hover:bg-red-500')}
                >
                    <IcBaselineRemoveCircle />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default WatchStatusTrigger;
