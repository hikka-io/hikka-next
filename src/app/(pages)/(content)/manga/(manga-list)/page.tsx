import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import MangaList from '@/features/manga/manga-list/manga-list.component';

import getQueryClient from '@/utils/get-query-client';

interface Props {
    searchParams: Record<string, string>;
}

const MangaListPage: FC<Props> = async ({ searchParams }) => {
    const page = searchParams.page;

    if (!page) {
        return permanentRedirect(
            `/manga?page=1&iPage=1&${new URLSearchParams(searchParams as Record<string, string>).toString()}`,
        );
    }

    const queryClient = getQueryClient();

    // await prefetchMangaCatalog(dataKeys);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <MangaList />
        </HydrationBoundary>
    );
};

export default MangaListPage;
