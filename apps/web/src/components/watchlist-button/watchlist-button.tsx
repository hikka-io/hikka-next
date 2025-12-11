'use client';

import {
    AnimeResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/client';
import { useAnimeBySlug, useCreateWatch, useWatchBySlug } from '@hikka/react';
import { createElement, useCallback, useMemo } from 'react';

import { ButtonProps } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '@/components/ui/select';

import { WatchEditModal } from '@/features/modals';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';

import MaterialSymbolsSettingsOutlineRounded from '../icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import IconWatchStatusButton from './icon-watch-status-button';
import NewStatusTrigger from './new-status-trigger';
import WatchStatusTrigger from './watch-status-trigger';

interface Props {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
    watch?: WatchResponseBase | null;
    anime?: AnimeResponse;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
    buttonProps?: ButtonProps;
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
            <div
                className={cn(
                    'w-fit rounded-sm border p-1',
                    `bg-${status} text-${status}-foreground border-${status}-border`,
                )}
            >
                {createElement(WATCH_STATUS[status as WatchStatusEnum].icon!, {
                    className: '!size-3',
                })}
            </div>
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
    buttonProps,
}: Props) => {
    const { openModal } = useModalContext();

    const { data: watchQuery, isError: watchError } = useWatchBySlug({
        slug,
        options: {
            enabled: !disabled && !watchProp && watchProp !== null,
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

    if (size?.includes('icon')) {
        return (
            <IconWatchStatusButton
                {...buttonProps}
                watch={watch}
                disabled={disabled}
                size={size as 'icon-sm' | 'icon-md'}
                slug={slug}
                anime={anime}
                isLoading={isChangingStatus}
            />
        );
    }

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
                    size={size as 'sm' | 'md'}
                    anime={anime}
                    isLoading={isChangingStatus}
                />
            ) : (
                <NewStatusTrigger
                    size={size as 'sm' | 'md'}
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
