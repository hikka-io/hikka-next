import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { Metadata } from 'next';

import { EditContentList as ContentList } from '@/features/edit';

import _generateMetadata from '@/utils/generate-metadata';

export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: `Контент`,
    });
}

const ContentPage = async () => {
    const queryClient = await getQueryClient();

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <ContentList />
        </HydrationBoundary>
    );
};

export default ContentPage;
