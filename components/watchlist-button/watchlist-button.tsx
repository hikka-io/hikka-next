'use client';

import * as React from 'react';
import { createElement } from 'react';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

import WatchEditModal from '@/components/modals/watch-edit-modal';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
} from '@/components/ui/select';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import useAddToList from '@/services/hooks/watch/useAddToList';
import useDeleteFromList from '@/services/hooks/watch/useDeleteFromList';
import useWatch from '@/services/hooks/watch/useWatch';
import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants';

import NewStatusTrigger from './components/new-status-trigger';
import WatchStatusTrigger from './components/watch-status-trigger';

interface Props {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
}

const SETTINGS_BUTTON = {
    label: (
        <div className="flex items-center gap-2">
            <MaterialSymbolsSettingsOutline />
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
        title: WATCH_STATUS[status as API.WatchStatus].title_ua,
        label: (
            <div className="flex items-center gap-2">
                {createElement(WATCH_STATUS[status as API.WatchStatus].icon!)}
                {WATCH_STATUS[status as API.WatchStatus].title_ua}
            </div>
        ),
    })),
];

const Component = ({ slug, additional, disabled }: Props) => {
    const { openModal } = useModalContext();

    const { data: watch, isError: watchError } = useWatch({
        slug,
        enabled: !disabled,
    });
    const { data: anime } = useAnimeInfo({
        slug,
        enabled: !disabled,
    });
    const { mutate: addToList } = useAddToList({ slug });
    const { mutate: deleteFromList } = useDeleteFromList({ slug });

    const openWatchEditModal = () => {
        if (anime) {
            openModal({
                content: <WatchEditModal slug={anime.slug} />,
                className: '!max-w-xl',
                title: anime.title,
                forceModal: true,
            });
        }
    };

    const handleChangeStatus = (options: string[]) => {
        const params =
            watch && !watchError
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
            addToList({
                status: 'completed',
                ...params,
                episodes: anime?.episodes_total,
            });
        } else {
            addToList({
                status: options[0] as API.WatchStatus,
                ...params,
            });
        }
    };

    return (
        <Select
            value={watch && !watchError ? [watch.status] : []}
            onValueChange={handleChangeStatus}
        >
            {watch && !watchError ? (
                <WatchStatusTrigger
                    watch={watch!}
                    disabled={disabled}
                    deleteFromList={deleteFromList}
                />
            ) : (
                <NewStatusTrigger disabled={disabled} addToList={addToList} />
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
                    {watch && !watchError && <SelectSeparator />}
                    {watch && !watchError && (
                        <SelectGroup>
                            {watch && !watchError && (
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
