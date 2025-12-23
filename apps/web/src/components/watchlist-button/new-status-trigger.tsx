'use client';

import { WatchStatusEnum } from '@hikka/client';
import { useCreateWatch } from '@hikka/react';
import * as React from 'react';
import { FC, createElement } from 'react';

import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';

import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';

import MaterialSymbolsArrowDropDownRounded from '../icons/material-symbols/MaterialSymbolsArrowDropDownRounded';

interface NewStatusTriggerProps {
    disabled?: boolean;
    slug: string;
    size?: 'sm' | 'md';
    isLoading?: boolean;
}

const NewStatusTrigger: FC<NewStatusTriggerProps> = ({
    disabled,
    slug,
    size,
    isLoading,
}) => {
    const { mutate: createWatch } = useCreateWatch();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createWatch({
            slug,
            args: {
                status: WatchStatusEnum.PLANNED,
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
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border border-secondary-foreground/20 p-1',
                            )}
                        >
                            {createElement(WATCH_STATUS.planned.icon!, {
                                className: '!size-3',
                            })}
                        </div>
                    )}
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
