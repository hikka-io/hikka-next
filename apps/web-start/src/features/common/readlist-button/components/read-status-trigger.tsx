'use client';

import { createElement, type FC } from 'react';

import type { ReadResponseBase } from '@hikka/client';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';

interface ReadStatusTriggerProps {
    read: ReadResponseBase;
    disabled?: boolean;
    size?: 'sm' | 'md';
    isLoading?: boolean;
    onOpenModal?: () => void;
}

const ReadStatusTrigger: FC<ReadStatusTriggerProps> = ({
    read,
    disabled,
    size,
    isLoading,
    onOpenModal,
}) => {
    const readStatus = READ_STATUS[read.status];

    return (
        <SelectTrigger asChild className="gap-0 border-none p-0">
            <div className="flex w-full">
                <Button
                    size={size}
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none border border-r-0',
                        `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                    )}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border p-1',
                                `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                            )}
                        >
                            {createElement(READ_STATUS[read.status].icon!, {
                                className: 'size-3!',
                            })}
                        </div>
                    )}
                    <span className="truncate rounded-none">
                        {readStatus.title_ua || readStatus.title_en}
                    </span>
                    {read.score > 0 && (
                        <>
                            <span className="opacity-60">-</span>
                            <span className="opacity-60">{read.score}</span>
                        </>
                    )}
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    onClick={onOpenModal}
                    disabled={disabled}
                    className={cn(
                        'rounded-l-none border border-l-0',
                        `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                    )}
                >
                    <MaterialSymbolsSettingsOutlineRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default ReadStatusTrigger;
