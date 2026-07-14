import { createElement, type FC } from 'react';

import type { ReadResponseBase, ReadStatusEnum } from '@hikka/api';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';

type ReadStatusTriggerProps = {
    read: ReadResponseBase;
    disabled?: boolean;
    size?: 'sm' | 'md';
    isLoading?: boolean;
    onOpenModal?: () => void;
    variant?: 'default' | 'header';
};

const ReadStatusTrigger: FC<ReadStatusTriggerProps> = ({
    read,
    disabled,
    size,
    isLoading,
    onOpenModal,
    variant = 'default',
}) => {
    const readStatus = READ_STATUS[read.status as ReadStatusEnum];

    if (variant === 'header') {
        return (
            <SelectTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        'relative flex w-full cursor-pointer items-center justify-center gap-2 p-3',
                        `bg-${read.status} text-${read.status}-foreground`,
                    )}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border p-1',
                                `border-${read.status}-border`,
                            )}
                        >
                            {createElement(readStatus.icon!, {
                                className: 'size-3!',
                            })}
                        </div>
                    )}
                    <span className="truncate font-medium">
                        {readStatus.title_ua || readStatus.title_en}
                    </span>
                    {/* biome-ignore lint/a11y/useSemanticElements: nested <button> inside the select trigger button is invalid HTML. */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOpenModal?.();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                onOpenModal?.();
                            }
                        }}
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-1 transition-opacity hover:opacity-70"
                    >
                        <MaterialSymbolsSettingsOutlineRounded />
                    </div>
                </button>
            </SelectTrigger>
        );
    }

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
                            {createElement(
                                READ_STATUS[read.status as ReadStatusEnum]
                                    .icon!,
                                {
                                    className: 'size-3!',
                                },
                            )}
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
