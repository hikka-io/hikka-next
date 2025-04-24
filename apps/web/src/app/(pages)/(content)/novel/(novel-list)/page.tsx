import { HydrationBoundary, dehydrate, getQueryClient } from '@hikka/react';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import NovelList from '@/features/novel/novel-list/novel-list.component';

interface Props {
    searchParams: Record<string, string>;
}

const NovelListPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;
    const page = searchParams.page;

    if (!page) {
        return permanentRedirect(
            `/novel?page=1&iPage=1&${new URLSearchParams(searchParams as Record<string, string>).toString()}`,
        );
    }

    const queryClient = getQueryClient();

    // await prefetchNovelCatalog(dataKeys);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <NovelList searchParams={searchParams} />
        </HydrationBoundary>
    );
};

export default NovelListPage;
