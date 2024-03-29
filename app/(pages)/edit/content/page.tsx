import { Metadata } from 'next';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

import ContentList from './components/content-list';


export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: `Контент`,
    });
}

const ContentPage = async () => {
    const queryClient = getQueryClient();

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <ContentList />
        </HydrationBoundary>
    );
};

export default ContentPage;
