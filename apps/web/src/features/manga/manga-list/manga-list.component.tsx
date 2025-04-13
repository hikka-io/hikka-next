'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FiltersNotFound from '../../../components/filters-not-found';
import LoadMoreButton from '../../../components/load-more-button';
import MangaCard from '../../../components/manga-card';
import Block from '../../../components/ui/block';
import Card from '../../../components/ui/card';
import Pagination from '../../../components/ui/pagination';
import Stack from '../../../components/ui/stack';
import useMangaCatalog from '../../../services/hooks/manga/use-manga-catalog';
import MangaListSkeleton from './manga-list-skeleton';
import { useNextPage, useUpdatePage } from './manga-list.hooks';

interface Props {}

const MangaList: FC<Props> = () => {
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
                    <Card className="flex-row gap-2 p-2 bg-background/60 backdrop-blur-xl border-none">
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
