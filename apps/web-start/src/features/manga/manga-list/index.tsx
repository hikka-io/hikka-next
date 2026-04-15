'use client';

import { queryKeys, useQueryClient } from '@hikka/react/core';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import MangaCard from '@/components/content-card/manga-card';
import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import Stack, { StackSize } from '@/components/ui/stack';

import MangaListSkeleton from './components/manga-list-skeleton';
import { useMangaSearchQuery } from './use-manga-search-query';

interface Props {
    extendedSize?: StackSize;
    pageSize?: number;
}

const MangaList: FC<Props> = ({ extendedSize = 5, pageSize }) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
        args,
        paginationArgs,
    } = useMangaSearchQuery(pageSize);

    const handlePageChange = (newPage: number) => {
        if (data && data?.pages.length > 1) {
            queryClient.removeQueries({
                queryKey: queryKeys.manga.search({ args, paginationArgs }),
            });
        }

        router.navigate({
            search: (prev: Record<string, unknown>) => ({
                ...prev,
                page: newPage,
            }),
            replace: true,
        } as any);
    };

    if (isLoading && !isFetchingNextPage) {
        return <MangaListSkeleton extendedSize={extendedSize} />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <div className="isolate flex flex-col gap-6">
            <Stack extended size={5} extendedSize={extendedSize}>
                {list.map((manga) => {
                    return <MangaCard key={manga.slug} manga={manga} />;
                })}
            </Stack>
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                />
            )}
            {list && pagination && pagination.pages > 1 && (
                <div className="sticky bottom-4 z-10 mx-auto flex w-fit items-center">
                    <Card className="bg-secondary/60 flex-row gap-2 border-none px-3 py-2 backdrop-blur-xl">
                        <Pagination
                            page={pagination.page}
                            pages={pagination.pages}
                            setPage={handlePageChange}
                        />
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MangaList;
