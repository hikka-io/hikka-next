import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { FC } from 'react';

import { MangaList } from '@/features/manga';

interface Props {
    searchParams: Record<string, string>;
}

const MangaListPage: FC<Props> = async (props) => {
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
