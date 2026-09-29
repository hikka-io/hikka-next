import type * as React from 'react';
import { createElement, type FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { WatchStatusEnum, watchAddMutation } from '@hikka/api';

import { WATCH_STATUS_ICONS } from '@/components/icons/list-status-icons';
import MaterialSymbolsArrowDropDownRounded from '@/components/icons/material-symbols/MaterialSymbolsArrowDropDownRounded';
import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { applyWatchMutation } from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';

type NewWatchStatusTriggerProps = {
    disabled?: boolean;
    slug: string;
    size?: 'sm' | 'md';
    isLoading?: boolean;
};

const NewWatchStatusTrigger: FC<NewWatchStatusTriggerProps> = ({
    disabled,
    slug,
    size,
    isLoading,
}) => {
    const queryClient = useQueryClient();

    const { mutate: createWatch } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            applyWatchMutation(queryClient, data);
        },
    });

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createWatch({
            path: { slug },
            body: {
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
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border border-secondary-foreground/20 p-1',
                            )}
                        >
                            {createElement(WATCH_STATUS_ICONS.planned, {
                                className: 'size-3!',
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

export default NewWatchStatusTrigger;
