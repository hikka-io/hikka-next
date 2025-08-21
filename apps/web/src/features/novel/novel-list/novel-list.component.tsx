'use client';

import { ContentStatusEnum, NovelMediaEnum } from '@hikka/client';
import { useSearchNovels } from '@hikka/react';
import { queryKeys, useQueryClient } from '@hikka/react/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import NovelCard from '@/components/novel-card';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';

import NovelListSkeleton from './novel-list-skeleton';

interface Props {}

const NovelList: FC<Props> = () => {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const query = searchParams.get('search');
    const media_type = searchParams.getAll('types') as NovelMediaEnum[];
    const status = searchParams.getAll('statuses') as ContentStatusEnum[];

    const years = searchParams.getAll('years') as unknown as [
        number | null,
        number | null,
    ];
    const genres = searchParams.getAll('genres');

    const only_translated = searchParams.get('only_translated');

    const sort = searchParams.get('sort') || 'score';
    const order = searchParams.get('order') || 'desc';

    const page = Number(searchParams.get('page')) || 1;

    const args = {
        query: query || undefined,
        media_type: media_type,
        status: status,
        years: years,
        genres: genres,
        only_translated: Boolean(only_translated),
        sort: sort ? [`${sort}:${order}`] : undefined,
    };

    const paginationArgs = {
        page: page,
    };

    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
    } = useSearchNovels({
        args,
        paginationArgs,
        options: {
            initialPageParam: page,
        },
    });

    const handlePageChange = (newPage: number) => {
        if (data && data?.pages.length > 1) {
            queryClient.removeQueries({
                queryKey: queryKeys.novel.search({ args, paginationArgs }),
            });
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleLoadMore = async () => {
        const result = await fetchNextPage();

        const last = result?.data?.pages.at(-1)!.pagination.page;

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(last));

        const newUrl = `${pathname}?${params.toString()}`;

        window.history.replaceState(
            { ...window.history.state, as: newUrl, url: newUrl },
            '',
            newUrl,
        );
    };

    if (isLoading && !isFetchingNextPage) {
        return <NovelListSkeleton />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block>
            <Stack extended={true} size={5} extendedSize={5}>
                {list.map((novel) => {
                    return <NovelCard key={novel.slug} novel={novel} />;
                })}
            </Stack>
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={handleLoadMore}
                />
            )}
            {list && pagination && pagination.pages > 1 && (
                <div className="sticky bottom-2 z-10 flex items-center justify-center">
                    <Card className="bg-background/60 flex-row gap-2 p-2 backdrop-blur-xl">
                        <Pagination
                            page={pagination.page}
                            pages={pagination.pages}
                            setPage={handlePageChange}
                        />
                    </Card>
                </div>
            )}
        </Block>
    );
};

export default NovelList;
