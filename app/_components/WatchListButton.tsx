'use client';

import Planned from '@/app/_components/icons/watchStatus/Planned';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CustomSelect from '@/app/_components/Select';
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded';
import clsx from 'clsx';
import { WATCH_STATUS } from '@/utils/constants';
import * as React from 'react';
import { createElement } from 'react';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import addWatch from '@/utils/api/watch/addWatch';
import getWatch from '@/utils/api/watch/getWatch';
import deleteWatch from '@/utils/api/watch/deleteWatch';
import IcBaselineRemoveCircle from '~icons/ic/baseline-remove-circle';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';

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

    const { mutate: addToList, isLoading: addToListLoading } = useMutation({
        mutationKey: ['addToList', secret, slug],
        mutationFn: ({
            status,
            episodes,
        }: {
            status: Hikka.WatchStatus;
            episodes?: number;
        }) =>
            addWatch({
                secret: String(secret),
                slug: String(slug),
                status: status,
                score: !watchError ? watch?.score : 0,
                episodes: episodes
                    ? episodes
                    : !watchError
                    ? watch?.episodes
                    : 0,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['watch']);
        },
    });

    const { mutate: deleteFromList, isLoading: deleteFromListLoading } =
        useMutation({
            mutationKey: ['deleteFromList', secret, slug],
            mutationFn: () =>
                deleteWatch({
                    secret: String(secret),
                    slug: String(slug),
                }),
            onSuccess: async () => {
                await queryClient.invalidateQueries(['watch']);
            },
        });

    return (
        <CustomSelect
            className="w-full"
            onChange={(e, option) => {
                if (option && typeof option === 'string') {
                    if (option === 'completed') {
                        addToList({
                            status: 'completed',
                            episodes: anime?.episodes_total,
                        });
                    } else {
                        addToList({ status: option as Hikka.WatchStatus });
                    }
                }
            }}
            value={watch && !watchError ? watch.status : null}
            renderToggle={(getButtonProps, listboxVisible, value) => {
                const buttonProps = getButtonProps();
                return (
                    <div className={clsx('join w-full')}>
                        <button
                            onClick={() =>
                                !value && addToList({ status: 'planned' })
                            }
                            {...(value && buttonProps)}
                            disabled={disabled}
                            className={clsx(
                                'btn btn-secondary border-b-none flex-1 join-item btn-md flex-nowrap overflow-hidden',
                            )}
                        >
                            {value ? (
                                createElement(
                                    WATCH_STATUS[value as Hikka.WatchStatus]
                                        .icon,
                                )
                            ) : (
                                <Planned />
                            )}
                            <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                                {value
                                    ? WATCH_STATUS[value as Hikka.WatchStatus]
                                          .title_ua ||
                                      WATCH_STATUS[value as Hikka.WatchStatus]
                                          .title_en
                                    : 'Додати У Список'}
                            </span>
                            {!watchError && watch?.score && watch.score > 0 ? (
                                <>
                                    <span className="opacity-60">-</span>
                                    <span className="opacity-60">
                                        {watch.score}
                                    </span>
                                </>
                            ) : null}
                            {!additional && (
                                <div
                                    className={clsx(
                                        'absolute right-2 text-2xl',
                                        listboxVisible &&
                                            'transform -scale-y-100',
                                    )}
                                >
                                    <MaterialSymbolsArrowDropDownRounded />
                                </div>
                            )}
                        </button>
                        {additional && (
                            <button
                                onClick={() => value && deleteFromList()}
                                {...(!value && buttonProps)}
                                disabled={disabled}
                                className={clsx(
                                    'btn btn-square join-item btn-md text-xl !text-white',
                                    value
                                        ? 'btn-error bg-secondary border-secondary'
                                        : 'btn-secondary',
                                )}
                            >
                                {value ? (
                                    <IcBaselineRemoveCircle />
                                ) : (
                                    <MaterialSymbolsArrowDropDownRounded />
                                )}
                            </button>
                        )}
                    </div>
                );
            }}
        >
            {Object.keys(WATCH_STATUS).map((status) => (
                <CustomSelect.Option key={status} value={status}>
                    {createElement(
                        WATCH_STATUS[status as Hikka.WatchStatus].icon,
                    )}
                    {WATCH_STATUS[status as Hikka.WatchStatus].title_ua ||
                        WATCH_STATUS[status as Hikka.WatchStatus].title_en}
                </CustomSelect.Option>
            ))}
        </CustomSelect>
    );
};

export default Component;
