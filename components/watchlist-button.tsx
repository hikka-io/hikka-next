'use client';

import clsx from 'clsx';
import * as React from 'react';
import { Fragment, createElement } from 'react';
import IcBaselineRemoveCircle from '~icons/ic/baseline-remove-circle';
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Planned from '@/components/icons/watch-status/planned';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { PopoverAnchor, PopoverTrigger } from '@/components/ui/popover';
import WatchEditModal from '@/components/modals/watch-edit-modal';
import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import addWatch from '@/services/api/watch/addWatch';
import deleteWatch from '@/services/api/watch/deleteWatch';
import getWatch from '@/services/api/watch/getWatch';
import { WATCH_STATUS } from '@/utils/constants';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from './ui/context-menu';

interface Props {
    slug: string;
    additional?: boolean;
    disabled?: boolean;
}

const Component = ({ slug, additional, disabled }: Props) => {
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const { data: watch, isError: watchError } = useQuery({
        queryKey: ['watch', secret, slug],
        queryFn: () => getWatch({ slug: String(slug), secret: String(secret) }),
    });

    const { data: anime } = useQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug: String(slug) }),
        enabled: !disabled,
    });

    const { mutate: addToList, isPending: addToListLoading } = useMutation({
        mutationKey: ['addToList', secret, slug],
        mutationFn: ({
            status,
            episodes,
        }: {
            status: API.WatchStatus;
            episodes?: number;
        }) =>
            addWatch({
                secret: String(secret),
                slug: String(slug),
                status: status,
                rewatches: watch ? watch.rewatches : 0,
                note: watch && watch.note ? watch.note : undefined,
                score: !watchError ? watch?.score : 0,
                episodes: episodes
                    ? episodes
                    : !watchError
                      ? watch?.episodes
                      : 0,
            }),
        onSuccess: async () => {
            await invalidateData();
        },
    });

    const { mutate: deleteFromList, isPending: deleteFromListLoading } =
        useMutation({
            mutationKey: ['deleteFromList', secret, slug],
            mutationFn: () =>
                deleteWatch({
                    secret: String(secret),
                    slug: String(slug),
                }),
            onSuccess: async () => {
                await invalidateData();
            },
        });

    const invalidateData = async () => {
        await queryClient.invalidateQueries({
            queryKey: ['watch'],
        });
        await queryClient.invalidateQueries({
            queryKey: ['list'],
        });
        await queryClient.invalidateQueries({ queryKey: ['favorites'] });
        await queryClient.invalidateQueries({ queryKey: ['franchise'] });
        await queryClient.invalidateQueries({ queryKey: ['collection'] });
    };

    return (
        <Combobox
            options={Object.keys(WATCH_STATUS).map((status) => ({
                value: status,
                label: (
                    <div className="flex gap-1 items-center">
                        {createElement(
                            WATCH_STATUS[status as API.WatchStatus].icon!,
                        )}
                        {WATCH_STATUS[status as API.WatchStatus].title_ua ||
                            WATCH_STATUS[status as API.WatchStatus].title_en}
                    </div>
                ),
            }))}
            onChange={(option) => {
                if (option && typeof option === 'string') {
                    if (option === 'completed') {
                        addToList({
                            status: 'completed',
                            episodes: anime?.episodes_total,
                        });
                    } else {
                        addToList({
                            status: option as API.WatchStatus,
                        });
                    }
                }
            }}
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

const ContextMenuOverlay = (props: Props) => {
    const { secret } = useAuthContext();

    if (!secret || props.disabled) {
        return <Component {...props} />;
    }

    const { data: watch, isError: watchError } = useQuery({
        queryKey: ['watch', secret, props.slug],
        queryFn: () => getWatch({ slug: String(props.slug), secret: String(secret) }),
    });

    if (!watch || watchError) {
        return <Component {...props} />;
    }

    const { titleLanguage } = useSettingsContext();
    const { openModal } = useModalContext();

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Component {...props} />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    onClick={() =>
                        openModal({
                            content: <WatchEditModal slug={props.slug} />,
                            className: '!max-w-xl',
                            title:
                                watch.anime?.[titleLanguage!] ||
                                watch.anime?.title_ua ||
                                watch.anime?.title_en ||
                                watch.anime?.title_ja,
                        })
                    }
                >
                    <MaterialSymbolsEditRounded className="mr-2" />
                    Редагувати
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default ContextMenuOverlay;