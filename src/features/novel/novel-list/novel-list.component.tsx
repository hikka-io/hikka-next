'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import NovelCard from '@/components/novel-card';
import Block from '@/components/ui/block';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';

import useNovelCatalog from '@/services/hooks/novel/use-novel-catalog';

import NovelListSkeleton from './novel-list-skeleton';
import { useNextPage, useUpdatePage } from './novel-list.hooks';

interface Props {
    searchParams: Record<string, string>;
}

const NovelList: FC<Props> = () => {
    const searchParams = useSearchParams();

    const query = searchParams.get('search');
    const media_type = searchParams.getAll('types');
    const status = searchParams.getAll('statuses');

    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');

    const only_translated = searchParams.get('only_translated');

    const sort = searchParams.get('sort') || 'score';
    const order = searchParams.get('order') || 'desc';

    const page = searchParams.get('page');
    const iPage = searchParams.get('iPage');

    const dataKeys = {
        query,
        media_type,
        status,
        years,
        genres,
        only_translated: Boolean(only_translated),
        sort: sort ? [`${sort}:${order}`] : undefined,
        page: Number(page),
        iPage: Number(iPage),
    };

    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        list,
        pagination,
    } = useNovelCatalog(dataKeys);

    const updatePage = useUpdatePage(dataKeys);
    const nextPage = useNextPage({ fetchNextPage, pagination });

    if (isLoading && !isFetchingNextPage) {
        return <NovelListSkeleton />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block>
            <Stack extended={true} size={5} extendedSize={5}>
                {list.map((novel: API.Novel) => {
                    return <NovelCard key={novel.slug} novel={novel} />;
                })}
            </Stack>
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={nextPage}
                />
            )}
            {list && pagination && pagination.pages > 1 && (
                <div className="sticky bottom-2 z-10 flex items-center justify-center">
                    <div className="w-fit rounded-lg border border-secondary/60 bg-background p-2 shadow">
                        <Pagination
                            page={Number(iPage)}
                            pages={pagination.pages}
                            setPage={updatePage}
                        />
                    </div>
                </div>
            )}
        </Block>
    );
};

export default NovelList;
