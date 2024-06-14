'use client';

import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import MangaCard from '@/components/manga-card';
import Block from '@/components/ui/block';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';

import useMangaCatalog from '@/services/hooks/manga/use-manga-catalog';

import MangaListSkeleton from './manga-list-skeleton';
import { useNextPage, useUpdatePage } from './manga-list.hooks';

interface Props {
    searchParams: Record<string, string>;
}

const MangaList: FC<Props> = ({ searchParams }) => {
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
    } = useMangaCatalog(dataKeys);

    const updatePage = useUpdatePage(dataKeys);
    const nextPage = useNextPage({ fetchNextPage, pagination });

    if (isLoading && !isFetchingNextPage) {
        return <MangaListSkeleton />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block>
            <Stack extended={true} size={5} extendedSize={5}>
                {list.map((manga: API.Manga) => {
                    return <MangaCard key={manga.slug} manga={manga} />;
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

export default MangaList;
