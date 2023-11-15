'use client';

import IcRoundGridView from '~icons/ic/round-grid-view';
import MaterialSymbolsEventList from '~icons/material-symbols/event-list';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { createElement, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import getWatchList from '@/utils/api/watch/getWatchList';
import { WATCH_STATUS } from '@/utils/constants';
import Select from '@/app/_components/Select';
import NotFound from '@/app/_components/NotFound';
import TableView from '@/app/u/[username]/list/_components/TableView';
import GridView from '@/app/u/[username]/list/_components/GridView';

interface Props {}

const Component = ({}: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams()!;
    const [view, setView] = useState<'table' | 'grid'>('table');
    const watchStatus = searchParams.get('status');
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['list', params.username, watchStatus],
        queryFn: () =>
            getWatchList({
                username: String(params.username),
                status: watchStatus as Hikka.WatchStatus,
            }),
        staleTime: 0,
    });

    const createQueryString = useCallback(
        (name: string, value: string | string[] | boolean) => {
            const params = new URLSearchParams(searchParams);
            // params.set('page', '1');

            if (value) {
                if (Array.isArray(value)) {
                    params.delete(name);
                    value.forEach((v) => params.append(name, String(v)));
                } else {
                    params.set(name, String(value));
                }
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams],
    );

    useEffect(() => {
        if (!watchStatus) {
            router.push(pathname + '/?status=completed');
        }
    }, [watchStatus]);

    if (!data || !data.list || !watchStatus) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Select
                        toggleClassName="btn-ghost"
                        value={watchStatus}
                        onChange={(_e, value) => {
                            const query = createQueryString('status', value as string);
                            router.replace(`${pathname}?${query}`);
                        }}
                        renderValue={(option) =>
                            !Array.isArray(option) &&
                            option && (
                                <div className="flex items-center gap-4">
                                    <div className="stat-figure text-xl p-1 text-white rounded-md bg-secondary/60 border border-secondary">
                                        {createElement(
                                            WATCH_STATUS[
                                                option.value as Hikka.WatchStatus
                                            ].icon,
                                        )}
                                    </div>

                                    <h3>{option.label}</h3>
                                </div>
                            )
                        }
                    >
                        {Object.keys(WATCH_STATUS).map((watchStatus) => (
                            <Select.Option
                                key={watchStatus}
                                value={watchStatus}
                            >
                                {
                                    WATCH_STATUS[
                                        watchStatus as Hikka.WatchStatus
                                    ].title_ua
                                }
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('table')}
                        className={clsx(
                            'btn btn-ghost btn-circle btn-sm',
                            view === 'table' && 'btn-active',
                        )}
                    >
                        <MaterialSymbolsEventList />
                    </button>
                    <button
                        onClick={() => setView('grid')}
                        className={clsx(
                            'btn btn-ghost btn-circle btn-sm',
                            view === 'grid' && 'btn-active',
                        )}
                    >
                        <IcRoundGridView />
                    </button>
                </div>
            </div>
            {data.list.length > 0 ? (
                view === 'table' ? (
                    <TableView data={data} />
                ) : (
                    <GridView data={data} />
                )
            ) : (
                <NotFound
                    title={
                        <span>
                            No anime added to the{' '}
                            <span className="font-black">
                                {WATCH_STATUS[watchStatus as Hikka.WatchStatus].title_en}
                            </span>{' '}
                            list
                        </span>
                    }
                    description="The list will be updated after adding anime with this status"
                />
            )}
        </div>
    );
};

export default Component;
