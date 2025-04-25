'use client';

import {
    AnimeResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/client';
import { useAddOrUpdateWatch, useAnimeInfo, useWatchEntry } from '@hikka/react';
import { createElement } from 'react';

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

const OPTIONS = [
    ...Object.keys(WATCH_STATUS).map((status) => ({
        value: status,
        title: WATCH_STATUS[status as WatchStatusEnum].title_ua,
        label: (
            <div className="flex items-center gap-2">
                {createElement(WATCH_STATUS[status as WatchStatusEnum].icon!)}
                {WATCH_STATUS[status as WatchStatusEnum].title_ua}
            </div>
        ),
    })),
];

const Component = ({
    slug,
    disabled,
    watch: watchProp,
    anime: animeProp,
    size,
}: Props) => {
    const { openModal } = useModalContext();

    const { data: watchQuery, isError: watchError } = useWatchEntry({
        slug,
        options: {
            enabled: !disabled && !watchProp,
        },
    });
    const { data: animeQuery } = useAnimeInfo({
        slug,
        options: {
            enabled: !disabled && !animeProp,
        },
    });
    const { mutate: addWatch } = useAddOrUpdateWatch();

    const watch =
        watchProp || (watchQuery && !watchError ? watchQuery : undefined);

    const anime = animeProp || (animeQuery ? animeQuery : undefined);

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

    const handleChangeStatus = (options: string[]) => {
        const params = watch
            ? {
                  episodes: watch?.episodes || undefined,
                  score: watch?.score || undefined,
                  note: watch?.note || undefined,
                  rewatches: watch?.rewatches || undefined,
              }
            : {};

        if (options[0] === 'settings') {
            openWatchEditModal();
            return;
        }

        if (options[0] === 'completed') {
            addWatch({
                slug,
                args: {
                    status: WatchStatusEnum.COMPLETED,
                    ...params,
                    episodes: anime?.episodes_total || undefined,
                },
            });
        } else {
            addWatch({
                slug,
                args: {
                    status: options[0] as WatchStatusEnum,
                    ...params,
                },
            });
        }
    };

    return (
        <Select
            disabled={disabled}
            value={watch ? [watch.status] : []}
            onValueChange={handleChangeStatus}
        >
            {watch ? (
                <WatchStatusTrigger
                    watch={watch!}
                    disabled={disabled}
                    slug={slug}
                    size={size}
                />
            ) : (
                <NewStatusTrigger size={size} slug={slug} disabled={disabled} />
            )}

            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    {watch && <SelectSeparator />}
                    {watch && (
                        <SelectGroup>
                            {watch && (
                                <SelectItem disableCheckbox value="settings">
                                    {SETTINGS_BUTTON.label}
                                </SelectItem>
                            )}
                        </SelectGroup>
                    )}
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default Component;
