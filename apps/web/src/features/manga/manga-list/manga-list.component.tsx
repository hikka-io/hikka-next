'use client';

import { ContentStatusEnum, MangaMediaEnum } from '@hikka/client';
import { useSearchMangas } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import MangaCard from '@/components/manga-card';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';

import MangaListSkeleton from './manga-list-skeleton';
import { useNextPage, useUpdatePage } from './manga-list.hooks';

interface Props {}

const MangaList: FC<Props> = () => {
    const searchParams = useSearchParams();

    const query = searchParams.get('search');
    const media_type = searchParams.getAll('types') as MangaMediaEnum[];
    const status = searchParams.getAll('statuses') as ContentStatusEnum[];

    const years = searchParams.getAll('years') as unknown as [
        number | null,
        number | null,
    ];
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
    } = useSearchMangas({
        args: {
            query: query || undefined,
            media_type: media_type,
            status: status,
            years: years,
            genres: genres,
            only_translated: Boolean(only_translated),
            sort: sort ? [`${sort}:${order}`] : undefined,
        },
        paginationArgs: {
            page: Number(page),
        },
    });

    const updatePage = useUpdatePage({
        page: Number(page),
        iPage: Number(iPage),
    });
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
                {list.map((manga) => {
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
                    <Card className="bg-background/60 flex-row gap-2 border-none p-2 backdrop-blur-xl">
                        <Pagination
                            page={Number(iPage)}
                            pages={pagination.pages}
                            setPage={updatePage}
                        />
                    </Card>
                </div>
            )}
        </Block>
    );
};

export default MangaList;
