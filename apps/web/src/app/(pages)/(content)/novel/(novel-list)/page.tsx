import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { FC } from 'react';

import NovelList from '@/features/novel/novel-list/novel-list.component';

interface Props {
    searchParams: Record<string, string>;
}

const NovelListPage: FC<Props> = async (props) => {
    const queryClient = getQueryClient();

    // await prefetchNovelCatalog(dataKeys);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <NovelList />
        </HydrationBoundary>
    );
};

export default NovelListPage;
