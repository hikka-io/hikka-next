'use client';

import clsx from 'clsx';
import * as React from 'react';
import { Fragment, createElement } from 'react';
import IcBaselineRemoveCircle from '~icons/ic/baseline-remove-circle';
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

import Planned from '@/components/icons/watch-status/planned';
import WatchEditModal from '@/components/modals/watch-edit-modal';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { PopoverAnchor, PopoverTrigger } from '@/components/ui/popover';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import useAddToList from '@/services/hooks/watch/useAddToList';
import useDeleteFromList from '@/services/hooks/watch/useDeleteFromList';
import useWatch from '@/services/hooks/watch/useWatch';
import { useModalContext } from '@/services/providers/modal-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { WATCH_STATUS } from '@/utils/constants';

interface Props {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
}

const SETTINGS_BUTTON = {
    label: (
        <div className="flex gap-2 items-center">
            <MaterialSymbolsSettingsOutline />
            Налаштування
        </div>
    ),
    value: 'settings',
    disableCheckbox: true,
    separator: true,
    title: 'Налаштування',
};

const OPTIONS = [
    ...Object.keys(WATCH_STATUS).map((status) => ({
        value: status,
        title: WATCH_STATUS[status as API.WatchStatus].title_ua,
        label: (
            <div className="flex gap-2 items-center">
                {createElement(WATCH_STATUS[status as API.WatchStatus].icon!)}
                {WATCH_STATUS[status as API.WatchStatus].title_ua}
            </div>
        ),
    })),
];

const Component = ({ slug, additional, disabled }: Props) => {
    const { titleLanguage } = useSettingsContext();
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
                title:
                    anime[titleLanguage!] ||
                    anime.title_ua ||
                    anime.title_en ||
                    anime.title_ja,
            });
        }
    };

    const handleChangeStatus = (option: string) => {
        const params =
            watch && !watchError
                ? {
                      episodes: watch?.episodes || undefined,
                      score: watch?.score || undefined,
                      note: watch?.note || undefined,
                      rewatches: watch?.rewatches || undefined,
                  }
                : {};

        if (option === 'settings') {
            openWatchEditModal();
            return;
        }

        if (option === 'completed') {
            addToList({
                status: 'completed',
                ...params,
                episodes: anime?.episodes_total,
            });
        } else {
            addToList({
                status: option as API.WatchStatus,
                ...params,
            });
        }
    };

    return (
        <Combobox
            options={[
                ...OPTIONS,
                ...(watch && !watchError ? [SETTINGS_BUTTON] : []),
            ]}
            onChange={handleChangeStatus}
            value={watch && !watchError ? watch.status : undefined}
            renderToggle={(open, setOpen, value) => {
                return (
                    <PopoverAnchor asChild>
                        <div className={clsx('flex w-full')}>
                            {createElement(
                                value ? PopoverTrigger : Fragment,
                                value ? { asChild: true } : {},
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        !value
                                            ? addToList({
                                                  status: 'planned',
                                              })
                                            : setOpen(!open)
                                    }
                                    disabled={disabled}
                                    className={clsx(
                                        'flex-1 rounded-r-none flex-nowrap overflow-hidden',
                                    )}
                                >
                                    {value ? (
                                        createElement(
                                            WATCH_STATUS[
                                                value as API.WatchStatus
                                            ].icon!,
                                        )
                                    ) : (
                                        <Planned />
                                    )}
                                    <span className="overflow-hidden overflow-ellipsis whitespace-nowrap rounded-none">
                                        {value
                                            ? WATCH_STATUS[
                                                  value as API.WatchStatus
                                              ].title_ua ||
                                              WATCH_STATUS[
                                                  value as API.WatchStatus
                                              ].title_en
                                            : 'Додати у список'}
                                    </span>
                                    {!watchError &&
                                    watch?.score &&
                                    watch.score > 0 ? (
                                        <>
                                            <span className="opacity-60">
                                                -
                                            </span>
                                            <span className="opacity-60">
                                                {watch.score}
                                            </span>
                                        </>
                                    ) : null}
                                    {!additional && (
                                        <div
                                            className={clsx(
                                                'absolute right-2 text-2xl',
                                                /*listboxVisible &&
                                                    '-scale-y-100 transform',*/
                                            )}
                                        >
                                            <MaterialSymbolsArrowDropDownRounded />
                                        </div>
                                    )}
                                </Button>,
                            )}
                            {additional &&
                                createElement(
                                    !value ? PopoverTrigger : Fragment,
                                    !value ? { asChild: true } : {},
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() =>
                                            value && deleteFromList()
                                        }
                                        disabled={disabled}
                                        className={clsx(
                                            'text-xl rounded-l-none',
                                            value && 'hover:bg-red-500',
                                        )}
                                    >
                                        {value ? (
                                            <IcBaselineRemoveCircle />
                                        ) : (
                                            <MaterialSymbolsArrowDropDownRounded />
                                        )}
                                    </Button>,
                                )}
                        </div>
                    </PopoverAnchor>
                );
            }}
        />
    );
};

export default Component;
