'use client';

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

const NovelList: FC<Props> = ({ searchParams }) => {
    const page = searchParams.page;
    const iPage = searchParams.iPage;

    const dataKeys = {
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
