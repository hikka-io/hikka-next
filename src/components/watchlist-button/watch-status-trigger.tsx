'use client';

import { FC, createElement } from 'react';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

import { Button } from '@/components/ui/button';
import { SelectTrigger } from '@/components/ui/select';

import WatchEditModal from '@/features/modals/watch-edit-modal';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';
import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface WatchStatusTriggerProps {
    watch: API.Watch;
    disabled?: boolean;
    slug: string;
}

const WatchStatusTrigger: FC<WatchStatusTriggerProps> = ({
    watch,
    disabled,
    slug,
}) => {
    const { openModal } = useModalContext();
    const { data: anime } = useAnimeInfo(
        {
            slug,
        },
        { enabled: !disabled },
    );

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

    return (
        <SelectTrigger asChild className="gap-0 border-none p-0">
            <div className="flex w-full">
                <Button
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    {createElement(WATCH_STATUS[watch.status].icon!)}
                    <span className="truncate rounded-none">
                        {WATCH_STATUS[watch.status].title_ua ||
                            WATCH_STATUS[watch.status].title_en}
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
                    size="icon"
                    type="button"
                    onClick={openWatchEditModal}
                    disabled={disabled}
                    className={cn('rounded-l-none')}
                >
                    <MaterialSymbolsSettingsOutline />
                </Button>
            </div>
        </SelectTrigger>
    );
};

export default WatchStatusTrigger;
