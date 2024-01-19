'use client';

import {
    Fragment,
    createElement,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
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

import { useInfiniteQuery } from '@tanstack/react-query';

import GridView from '@/app/(pages)/u/[username]/list/_components/grid-view';
import TableView from '@/app/(pages)/u/[username]/list/_components/table-view';
import NotFound from '@/app/_components/not-found';
import { Combobox } from '@/app/_components/ui/combobox';
import { Button } from '@/app/_components/ui/button';
import { PopoverTrigger } from '@/app/_components/ui/popover';
import getRandomWatch from '@/utils/api/watch/getRandomWatch';
import getWatchList, { Response } from '@/utils/api/watch/getWatchList';
import { WATCH_STATUS } from '@/utils/constants';
import { Label } from '@/app/_components/ui/label';

interface Props {}

const Component = ({}: Props) => {
    const { ref, inView } = useInView();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams()!;
    const [view, setView] = useState<'table' | 'grid'>('table');
    const params = useParams();

    const watchStatus = searchParams.get('status');
    const order = searchParams.get('order');
    const sort = searchParams.get('sort');

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ['list', params.username, watchStatus, order, sort],
            getNextPageParam: (lastPage: Response, allPages) => {
                const nextPage = lastPage.pagination.page + 1;
                return nextPage > lastPage.pagination.pages
                    ? undefined
                    : nextPage;
            },
            queryFn: ({ pageParam = 1 }) =>
                getWatchList({
                    username: String(params.username),
                    status: watchStatus as Hikka.WatchStatus,
                    page: pageParam,
                    order: order as
                        | 'score'
                        | 'episodes'
                        | 'media_type'
                        | undefined,
                    sort: sort as 'asc' | 'desc' | undefined,
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

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    if (!data || !data.pages || !watchStatus) {
        return null;
    }

    const list = data.pages.map((data) => data.list).flat(1);

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
                                    <div className="flex items-center gap-2">
                                        <h3>{option.label}</h3>
                                        {data?.pages.length > 0 && (
                                            <Label className="text-muted-foreground">
                                                (
                                                {
                                                    data?.pages[0].pagination
                                                        .total
                                                }
                                                )
                                            </Label>
                                        )}
                                    </div>
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
                        renderToggle={(open, setOpen, value) => (
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon-sm">
                                    {value === 'table' ? (
                                        <MaterialSymbolsEventList />
                                    ) : (
                                        <IcRoundGridView />
                                    )}
                                </Button>
                            </PopoverTrigger>
                        )}
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