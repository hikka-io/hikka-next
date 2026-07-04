import { createElement, useCallback, useMemo, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    type AnimeResponse,
    animeSlugOptions,
    type WatchArgs,
    type WatchResponseBase,
    WatchStatusEnum,
    watchAddMutation,
    watchGetOptions,
} from '@hikka/api';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import type { ButtonProps } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '@/components/ui/select';
import { useTitle } from '@/features/auth/hooks/use-title';
import { applyWatchMutation } from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';

import WatchEditModal from '../watch-edit-modal';
import IconWatchStatusButton from './components/icon-watch-status-button';
import NewStatusTrigger from './components/new-status-trigger';
import WatchStatusTrigger from './components/watch-status-trigger';

type Props = {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
    watch?: WatchResponseBase | null;
    anime?: AnimeResponse;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
    buttonProps?: ButtonProps;
};

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
                    className: 'size-3!',
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
    const [editOpen, setEditOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: watchQuery, isError: watchError } = useQuery({
        ...watchGetOptions({ path: { slug } }),
        retry: false,
        enabled: !disabled && !watchProp && watchProp !== null,
    });

    const { data: animeQuery } = useQuery({
        ...animeSlugOptions({ path: { slug } }),
        enabled: !disabled && !animeProp,
    });

    const { mutate: addWatch, isPending: isChangingStatus } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            applyWatchMutation(queryClient, data);
        },
    });

    const watch = useMemo(
        () => watchProp || (watchQuery && !watchError ? watchQuery : undefined),
        [watchProp, watchQuery, watchError],
    );

    const anime = useMemo(
        () => animeProp || animeQuery,
        [animeProp, animeQuery],
    );

    const title = useTitle(anime);

    const openWatchEditModal = useCallback(() => {
        if (anime) {
            setEditOpen(true);
        }
    }, [anime]);

    const handleChangeStatus = useCallback(
        (options: string[]) => {
            const selectedOption = options[0];

            if (selectedOption === 'settings') {
                openWatchEditModal();
                return;
            }

            const currentWatchParams = watch
                ? {
                      episodes: watch.episodes || undefined,
                      score: watch.score || undefined,
                      note: watch.note || undefined,
                      rewatches: watch.rewatches || undefined,
                  }
                : {};

            const watchArgs: WatchArgs =
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
                path: { slug },
                body: watchArgs,
            });
        },
        [watch, anime, slug, addWatch, openWatchEditModal],
    );

    const currentStatus = watch ? [watch.status] : [];

    return (
        <>
            {size?.includes('icon') ? (
                <IconWatchStatusButton
                    {...buttonProps}
                    watch={watch}
                    disabled={disabled}
                    size={size as 'icon-sm' | 'icon-md'}
                    slug={slug}
                    anime={anime}
                    isLoading={isChangingStatus}
                    onOpenModal={() => setEditOpen(true)}
                />
            ) : (
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
                            isLoading={isChangingStatus}
                            onOpenModal={() => setEditOpen(true)}
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
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                            {watch && (
                                <>
                                    <SelectSeparator />
                                    <SelectGroup>
                                        <SelectItem
                                            disableCheckbox
                                            value="settings"
                                        >
                                            {SETTINGS_BUTTON.label}
                                        </SelectItem>
                                    </SelectGroup>
                                </>
                            )}
                        </SelectList>
                    </SelectContent>
                </Select>
            )}
            <ResponsiveModal
                open={editOpen}
                onOpenChange={setEditOpen}
                forceDesktop
            >
                <ResponsiveModalContent className="md:max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    <WatchEditModal
                        slug={slug}
                        watch={watch}
                        onClose={() => setEditOpen(false)}
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default WatchlistButton;
