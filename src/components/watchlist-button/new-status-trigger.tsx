'use client';

import * as React from 'react';
import { FC, createElement } from 'react';
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded';

import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';

import useAddWatch from '@/services/hooks/watch/use-add-watch';
import { WATCH_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

interface NewStatusTriggerProps {
    disabled?: boolean;
    slug: string;
    size?: 'sm' | 'md';
}

const NewStatusTrigger: FC<NewStatusTriggerProps> = ({
    disabled,
    slug,
    size,
}) => {
    const { mutate: addWatch } = useAddWatch();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addWatch({
            params: {
                slug,
                status: 'planned',
            },
        });
    };

    return (
        <SelectTrigger
            asChild
            className="gap-0 border-none p-0"
            onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="flex w-full">
                <Button
                    variant="secondary"
                    size={size}
                    disabled={disabled}
                    onClick={handleAddToPlanned}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    <div className="rounded-sm bg-muted-foreground p-0.5">
                        {createElement(WATCH_STATUS.planned.icon!)}
                    </div>
                    <span className="truncate rounded-none">
                        Додати у список
                    </span>
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    disabled={disabled}
                    className={cn('rounded-l-none text-xl')}
                >
                    <MaterialSymbolsArrowDropDownRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default NewStatusTrigger;
