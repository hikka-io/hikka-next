import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { FC } from 'react';

import { AnimeList } from '@/features/anime';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const AnimeListPage: FC<Props> = async (props) => {
    const queryClient = getQueryClient();

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <AnimeList />
        </HydrationBoundary>
    );
};

export default AnimeListPage;
