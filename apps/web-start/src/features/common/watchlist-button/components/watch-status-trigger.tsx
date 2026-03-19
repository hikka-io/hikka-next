'use client';

import { WatchResponse, WatchResponseBase } from '@hikka/client';
import { FC, createElement } from 'react';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';

import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';

interface WatchStatusTriggerProps {
    watch: WatchResponse | WatchResponseBase;
    disabled?: boolean;
    size?: 'sm' | 'md';
    isLoading?: boolean;
    onOpenModal?: () => void;
}

const WatchStatusTrigger: FC<WatchStatusTriggerProps> = ({
    watch,
    disabled,
    size,
    isLoading,
    onOpenModal,
}) => {
    const watchStatus = WATCH_STATUS[watch.status];

    return (
        <SelectTrigger asChild>
            <div className={cn('flex w-full')}>
                <Button
                    size={size}
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none border border-r-0',
                        `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`,
                    )}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border p-1',
                                `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`,
                            )}
                        >
                            {createElement(watchStatus.icon!, {
                                className: 'size-3!',
                            })}
                        </div>
                    )}
                    <span className="truncate rounded-none">
                        {watchStatus.title_ua || watchStatus.title_en}
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
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    onClick={onOpenModal}
                    disabled={disabled}
                    className={cn(
                        'rounded-l-none border border-l-0',
                        `bg-${watch.status} text-${watch.status}-foreground  border-${watch.status}-border`,
                    )}
                >
                    <MaterialSymbolsSettingsOutlineRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default WatchStatusTrigger;
