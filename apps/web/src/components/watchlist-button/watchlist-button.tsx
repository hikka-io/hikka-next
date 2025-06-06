'use client';

import {
    AnimeResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/client';
import { useAnimeBySlug, useCreateWatch, useWatchBySlug } from '@hikka/react';
import { createElement, useCallback, useMemo } from 'react';

import WatchEditModal from '@/features/modals/watch-edit-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants/common';

import MaterialSymbolsSettingsOutlineRounded from '../icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '../ui/select';
import NewStatusTrigger from './new-status-trigger';
import WatchStatusTrigger from './watch-status-trigger';

interface Props {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
    watch?: WatchResponseBase;
    anime?: AnimeResponse;
    size?: 'sm' | 'md';
}

const SETTINGS_BUTTON = {
    label: (
        <div className="flex items-center gap-2">
            <MaterialSymbolsSettingsOutlineRounded />
            Налаштування
        </div>
    ),
    value: 'settings',
    disableCheckbox: true,
    title: 'Налаштування',
};

const STATUS_OPTIONS = Object.keys(WATCH_STATUS).map((status) => ({
    value: status,
    title: WATCH_STATUS[status as WatchStatusEnum].title_ua,
    label: (
        <div className="flex items-center gap-2">
            {createElement(WATCH_STATUS[status as WatchStatusEnum].icon!)}
            {WATCH_STATUS[status as WatchStatusEnum].title_ua}
        </div>
    ),
}));

const WatchlistButton = ({
    slug,
    disabled,
    watch: watchProp,
    anime: animeProp,
    size,
}: Props) => {
    const { openModal } = useModalContext();

    const { data: watchQuery, isError: watchError } = useWatchBySlug({
        slug,
        options: {
            enabled: !disabled && !watchProp,
        },
    });

    const { data: animeQuery } = useAnimeBySlug({
        slug,
        options: {
            enabled: !disabled && !animeProp,
        },
    });

    const { mutate: addWatch, isPending: isChangingStatus } = useCreateWatch();

    const watch = useMemo(
        () => watchProp || (watchQuery && !watchError ? watchQuery : undefined),
        [watchProp, watchQuery, watchError],
    );

    const anime = useMemo(
        () => animeProp || animeQuery,
        [animeProp, animeQuery],
    );

    const openWatchEditModal = useCallback(() => {
        if (anime) {
            openModal({
                content: <WatchEditModal slug={anime.slug} watch={watch} />,
                className: '!max-w-xl',
                title: anime.title,
                forceModal: true,
            });
        }
    }, [anime, watch, openModal]);

    const handleChangeStatus = useCallback(
        (options: string[]) => {
            const selectedOption = options[0];

            if (selectedOption === 'settings') {
                openWatchEditModal();
                return;
            }

            // Extract current watch parameters
            const currentWatchParams = watch
                ? {
                      episodes: watch.episodes || undefined,
                      score: watch.score || undefined,
                      note: watch.note || undefined,
                      rewatches: watch.rewatches || undefined,
                  }
                : {};

            // Handle completed status specially to set episodes to total
            const watchArgs =
                selectedOption === 'completed'
                    ? {
                          status: WatchStatusEnum.COMPLETED,
                          ...currentWatchParams,
                          episodes: anime?.episodes_total || undefined,
                      }
                    : {
                          status: selectedOption as WatchStatusEnum,
                          ...currentWatchParams,
                      };

            addWatch({
                slug,
                args: watchArgs,
            });
        },
        [watch, anime, slug, addWatch, openWatchEditModal],
    );

    const currentStatus = watch ? [watch.status] : [];

    return (
        <Select
            disabled={disabled || isChangingStatus}
            value={currentStatus}
            onValueChange={handleChangeStatus}
        >
            {watch ? (
                <WatchStatusTrigger
                    watch={watch}
                    disabled={disabled}
                    slug={slug}
                    size={size}
                    isLoading={isChangingStatus}
                />
            ) : (
                <NewStatusTrigger
                    size={size}
                    slug={slug}
                    disabled={disabled}
                    isLoading={isChangingStatus}
                />
            )}

            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    {watch && (
                        <>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectItem disableCheckbox value="settings">
                                    {SETTINGS_BUTTON.label}
                                </SelectItem>
                            </SelectGroup>
                        </>
                    )}
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default WatchlistButton;
