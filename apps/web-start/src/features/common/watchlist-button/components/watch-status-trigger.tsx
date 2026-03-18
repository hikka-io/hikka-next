'use client';

import { AnimeResponse, WatchResponse, WatchResponseBase } from '@hikka/client';
import { FC, createElement, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import { SelectTrigger } from '@/components/ui/select';

import { WatchEditModal } from '@/features/watch';

import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';

interface WatchStatusTriggerProps {
    watch: WatchResponse | WatchResponseBase;
    disabled?: boolean;
    anime?: AnimeResponse;
    size?: 'sm' | 'md';
    isLoading?: boolean;
}

const WatchStatusTrigger: FC<WatchStatusTriggerProps> = ({
    watch,
    disabled,
    size,
    anime,
    isLoading,
}) => {
    const [editOpen, setEditOpen] = useState(false);

    const openWatchEditModal = () => {
        if (anime) {
            setEditOpen(true);
        }
    };

    const watchStatus = WATCH_STATUS[watch.status];

    return (
        <>
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
                                    className: '!size-3',
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
                        onClick={openWatchEditModal}
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
            <ResponsiveModal open={editOpen} onOpenChange={setEditOpen} forceDesktop>
                <ResponsiveModalContent className="!max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{anime?.title}</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    <WatchEditModal slug={anime?.slug || ''} watch={watch} onClose={() => setEditOpen(false)} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default WatchStatusTrigger;
