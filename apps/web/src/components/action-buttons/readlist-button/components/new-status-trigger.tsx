import type * as React from 'react';
import { createElement, type FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    type ReadContentTypeEnum,
    ReadStatusEnum,
    readAddMutation,
} from '@hikka/api';

import MaterialSymbolsArrowDropDownRounded from '@/components/icons/material-symbols/MaterialSymbolsArrowDropDownRounded';
import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { applyReadMutation } from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';

type NewStatusTriggerProps = {
    disabled?: boolean;
    slug: string;
    content_type: ReadContentTypeEnum;
    size?: 'sm' | 'md';
    isLoading?: boolean;
    variant?: 'default' | 'header';
};

const NewStatusTrigger: FC<NewStatusTriggerProps> = ({
    disabled,
    slug,
    content_type,
    size,
    isLoading,
    variant = 'default',
}) => {
    const queryClient = useQueryClient();

    const { mutate: createRead } = useMutation({
        ...readAddMutation(),
        onSuccess: (data) => {
            applyReadMutation(queryClient, data);
        },
    });

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createRead({
            path: { content_type, slug },
            body: {
                status: ReadStatusEnum.PLANNED,
            },
        });
    };

    if (variant === 'header') {
        return (
            <SelectTrigger
                asChild
                className="gap-0 border-none p-0"
                onSelect={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <button
                    type="button"
                    disabled={disabled}
                    onClick={handleAddToPlanned}
                    className="relative flex w-full cursor-pointer items-center justify-center gap-2 bg-secondary/30 p-3"
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div className="rounded-sm border border-secondary-foreground/20 p-1">
                            {createElement(READ_STATUS.planned.icon!, {
                                className: 'size-3!',
                            })}
                        </div>
                    )}
                    <span className="truncate font-medium">
                        Додати у список
                    </span>
                    <MaterialSymbolsArrowDropDownRounded className="absolute top-1/2 right-3 -translate-y-1/2 text-xl" />
                </button>
            </SelectTrigger>
        );
    }

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
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border border-secondary-foreground/20 p-1',
                            )}
                        >
                            {createElement(READ_STATUS.planned.icon!, {
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

export default NewStatusTrigger;
