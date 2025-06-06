'use client';

import { WatchResponse, WatchResponseBase } from '@hikka/client';
import { useAnimeBySlug } from '@hikka/react';
import { FC, createElement } from 'react';

import WatchEditModal from '@/features/modals/watch-edit-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

import MaterialSymbolsSettingsOutlineRounded from '../icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '../ui/button';
import { SelectTrigger } from '../ui/select';

interface WatchStatusTriggerProps {
    watch: WatchResponse | WatchResponseBase;
    disabled?: boolean;
    slug: string;
    size?: 'sm' | 'md';
    isLoading?: boolean;
}

const WatchStatusTrigger: FC<WatchStatusTriggerProps> = ({
    watch,
    disabled,
    slug,
    size,
    isLoading,
}) => {
    const { openModal } = useModalContext();
    const { data: anime } = useAnimeBySlug({
        slug,
        options: {
            enabled: !disabled,
        },
    });

    const openWatchEditModal = () => {
        if (anime) {
            openModal({
                content: <WatchEditModal slug={anime.slug} watch={watch} />,
                className: '!max-w-xl',
                title: anime.title,
                forceModal: true,
            });
        }
    };

    const watchStatus = WATCH_STATUS[watch.status];

    return (
        <SelectTrigger asChild className="gap-0 border-none p-0">
            <div className="flex w-full">
                <Button
                    size={size}
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <div
                            className="rounded-sm p-0.5 text-white"
                            style={{ backgroundColor: watchStatus.color }}
                        >
                            {createElement(watchStatus.icon!)}
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
                    className={cn('rounded-l-none')}
                >
                    <MaterialSymbolsSettingsOutlineRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default WatchStatusTrigger;
