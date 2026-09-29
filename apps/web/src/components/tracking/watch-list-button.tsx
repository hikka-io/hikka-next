import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type AnimeInfoResponse,
    type AnimeResponse,
    ContentTypeEnum,
    type WatchArgs,
    type WatchResponseBase,
    WatchStatusEnum,
    watchGetOptions,
} from '@hikka/api';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import type { ButtonProps } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '@/components/ui/select';
import { carryOverWatchArgs } from '@/utils/api/tracking-args';

import IconWatchStatusButton from './icon-watch-status-button';
import ListEntryEditDialog from './list-entry-edit-dialog';
import NewWatchStatusTrigger from './new-watch-status-trigger';
import { WATCH_STATUS_OPTIONS } from './status-options';
import { useAddWatch } from './use-tracking-mutations';
import WatchStatusTrigger from './watch-status-trigger';

type Props = {
    slug: string;
    disabled?: boolean;
    watch?: WatchResponseBase | null;
    anime: AnimeResponse | AnimeInfoResponse | undefined;
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

const WatchListButton = ({
    slug,
    disabled,
    watch: watchProp,
    anime,
    size,
    buttonProps,
}: Props) => {
    const [editOpen, setEditOpen] = useState(false);

    const { data: watchQuery, isError: watchError } = useQuery({
        ...watchGetOptions({ path: { slug } }),
        retry: false,
        enabled: !disabled && !watchProp && watchProp !== null,
    });

    const { mutate: addWatch, isPending: isChangingStatus } = useAddWatch();

    const watch = useMemo(
        () => watchProp || (watchQuery && !watchError ? watchQuery : undefined),
        [watchProp, watchQuery, watchError],
    );

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

            const currentWatchParams = carryOverWatchArgs(watch);

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
                        <NewWatchStatusTrigger
                            size={size as 'sm' | 'md'}
                            slug={slug}
                            disabled={disabled}
                            isLoading={isChangingStatus}
                        />
                    )}

                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {WATCH_STATUS_OPTIONS.map((option) => (
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
            <ListEntryEditDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                content={anime}
                slug={slug}
                contentType={ContentTypeEnum.ANIME}
                watch={watch}
            />
        </>
    );
};

export default WatchListButton;
