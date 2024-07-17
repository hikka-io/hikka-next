import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import AnimeList from '@/features/anime/anime-list/anime-list.component';

import getQueryClient from '@/utils/get-query-client';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const AnimeListPage: FC<Props> = async ({ searchParams }) => {
    const page = searchParams.page;

    if (!page) {
        return redirect(
            `/anime?page=1&iPage=1&${new URLSearchParams(searchParams as Record<string, string>).toString()}`,
        );
    }

    /* const query = searchParams.search as string;
    const media_type = searchParams.types;
    const status = searchParams.statuses;
    const season = searchParams.seasons;
    const rating = searchParams.ratings;
    const years = searchParams.years;
    const genres = searchParams.genres;
    const studios = searchParams.studios;

    const only_translated = searchParams.only_translated;

    const sort = searchParams.sort || 'score';
    const order = searchParams.order || 'desc';

    const iPage = searchParams.iPage;

    const dataKeys = {
        query,
        media_type: typeof media_type === 'string' ? [media_type] : media_type,
        status: typeof status === 'string' ? [status] : status,
        season: typeof season === 'string' ? [season] : season,
        rating: typeof rating === 'string' ? [rating] : rating,
        years: typeof years === 'string' ? [years] : years,
        genres: typeof genres === 'string' ? [genres] : genres,
        studios: typeof studios === 'string' ? [studios] : studios,
        only_translated: Boolean(only_translated),
        sort: sort ? [`${sort}:${order}`] : undefined,
        page: Number(page),
        iPage: Number(iPage),
    };

    

    await prefetchAnimeCatalog(dataKeys); */

    const queryClient = getQueryClient();

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <AnimeList />
        </HydrationBoundary>
    );
};

export default AnimeListPage;
