'use client';

import { Fragment, createElement, useEffect, useState } from 'react';
import FeRandom from '~icons/fe/random';
import IcRoundGridView from '~icons/ic/round-grid-view';
import MaterialSymbolsEventList from '~icons/material-symbols/event-list';
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import { useWatchList } from '@/app/(pages)/u/[username]/page.hooks';
import { Button } from '@/app/_components/ui/button';
import { Combobox } from '@/app/_components/ui/combobox';
import { Label } from '@/app/_components/ui/label';
import NotFound from '@/app/_components/ui/not-found';
import { PopoverTrigger } from '@/app/_components/ui/popover';
import getRandomWatch from '@/app/_utils/api/watch/getRandomWatch';
import { WATCH_STATUS } from '@/app/_utils/constants';
import createQueryString from '@/app/_utils/createQueryString';

import GridView from './_components/grid-view';
import TableView from './_components/table-view';

interface Props {}

const Component = ({}: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams()!;
    const [view, setView] = useState<'table' | 'grid'>('table');
    const params = useParams();

    const watchStatus = searchParams.get('status');
    const order = searchParams.get('order');
    const sort = searchParams.get('sort');

    const { list, data, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useWatchList(
            String(params.username),
            String(watchStatus) as Hikka.WatchStatus,
            String(order),
            String(sort),
        );

    const handleToolsChange = async (option: string) => {
        if (option === 'random') {
            try {
                const randomAnime = await getRandomWatch({
                    username: String(params.username),
                    status: watchStatus as Hikka.WatchStatus,
                });

                router.push('/anime/' + randomAnime.slug);
            } catch (e) {
                return;
            }
        }
    };

    useEffect(() => {
        if (!watchStatus) {
            router.replace(
                pathname + '/?status=completed&order=score&sort=desc',
            );
        } else if (!order || !sort) {
            router.replace(
                pathname + '/?status=' + watchStatus + '&order=score&sort=desc',
            );
        }
    }, [watchStatus]);

    if (!list || !watchStatus) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Combobox
                        options={Object.keys(WATCH_STATUS).map(
                            (watchStatus) => ({
                                label: WATCH_STATUS[
                                    watchStatus as Hikka.WatchStatus
                                ].title_ua,
                                value: watchStatus,
                            }),
                        )}
                        value={watchStatus}
                        toggleProps={{ variant: 'ghost' }}
                        onChange={(value) => {
                            const query = createQueryString(
                                'status',
                                value as string,
                                searchParams,
                            );
                            router.replace(`${pathname}?${query}`);
                        }}
                        renderValue={(option) =>
                            !Array.isArray(option) &&
                            option && (
                                <div className="flex items-center gap-4">
                                    <div className="stat-figure rounded-md border border-secondary bg-secondary/60 p-1 text-xl text-base-content">
                                        {createElement(
                                            WATCH_STATUS[
                                                option.value as Hikka.WatchStatus
                                            ].icon,
                                        )}
                                    </div>
                                    {data && (
                                        <div className="flex items-center gap-2">
                                            <h3>{option.label}</h3>
                                            {data?.pages.length > 0 && (
                                                <Label className="text-muted-foreground">
                                                    (
                                                    {
                                                        data?.pages[0]
                                                            .pagination.total
                                                    }
                                                    )
                                                </Label>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    />
                </div>
                <div className="flex gap-2">
                    <Combobox
                        side="bottom"
                        align="end"
                        options={[
                            {
                                label: (
                                    <Fragment>
                                        <MaterialSymbolsEventList /> Таблиця
                                    </Fragment>
                                ),
                                value: 'table',
                            },
                            {
                                label: (
                                    <Fragment>
                                        <IcRoundGridView /> Сітка
                                    </Fragment>
                                ),
                                value: 'grid',
                            },
                        ]}
                        onChange={(value) => setView(value as 'table' | 'grid')}
                        value={view}
                        renderToggle={(_open, _setOpen, value) => {
                            return (
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon-sm">
                                        {value === 'table' ? (
                                            <MaterialSymbolsEventList />
                                        ) : (
                                            <IcRoundGridView />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                            );
                        }}
                    />
                    <Combobox
                        side="bottom"
                        align="end"
                        disableCheckbox
                        options={[
                            {
                                label: (
                                    <Fragment>
                                        <FeRandom /> Випадкове аніме
                                    </Fragment>
                                ),
                                value: 'random',
                            },
                        ]}
                        onChange={(value) => handleToolsChange(value as string)}
                        renderToggle={() => (
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon-sm">
                                    <MaterialSymbolsMoreVert />
                                </Button>
                            </PopoverTrigger>
                        )}
                    />
                </div>
            </div>
            {list.length > 0 ? (
                view === 'table' ? (
                    <TableView data={list} />
                ) : (
                    <GridView data={list} />
                )
            ) : (
                <NotFound
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">
                                {
                                    WATCH_STATUS[
                                        watchStatus as Hikka.WatchStatus
                                    ].title_ua
                                }
                            </span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після як сюди буде додано аніме з цим статусом"
                />
            )}
            {hasNextPage && (
                <Button
                    variant="secondary"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </Button>
            )}
        </div>
    );
};

export default Component;