import { HydrationBoundary, dehydrate, getQueryClient } from '@hikka/react';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import AnimeList from '@/features/anime/anime-list/anime-list.component';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const AnimeListPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;
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
