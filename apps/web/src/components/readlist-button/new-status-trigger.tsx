'use client';

import * as React from 'react';
import { FC, createElement } from 'react';

import useAddRead from '@/services/hooks/read/use-add-read';
import { WATCH_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';
import MaterialSymbolsArrowDropDownRounded from '../icons/material-symbols/MaterialSymbolsArrowDropDownRounded';
import { Button } from '../ui/button';
import { SelectTrigger } from '../ui/select';

interface NewStatusTriggerProps {
    disabled?: boolean;
    slug: string;
    content_type: 'novel' | 'manga';
    size?: 'sm' | 'md';
}

const NewStatusTrigger: FC<NewStatusTriggerProps> = ({
    disabled,
    slug,
    content_type,
    size,
}) => {
    const { mutate: addRead } = useAddRead();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addRead({
            params: {
                content_type,
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
                    size={size}
                    variant="secondary"
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
