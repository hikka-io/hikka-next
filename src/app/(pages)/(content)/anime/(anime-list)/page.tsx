import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import AnimeList from '@/features/anime/anime-list/anime-list.component';

import getQueryClient from '@/utils/get-query-client';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const AnimeListPage: FC<Props> = async ({ searchParams }) => {
    const page = searchParams.page;

    if (!page) {
        return permanentRedirect(
            `/anime?page=1&iPage=1&${new URLSearchParams(searchParams as Record<string, string>).toString()}`,
        );
    }

    const queryClient = getQueryClient();

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <AnimeList />
        </HydrationBoundary>
    );
};

export default AnimeListPage;
