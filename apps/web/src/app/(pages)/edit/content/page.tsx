import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { Metadata } from 'next';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';

import { EditContentList as ContentList } from "@/features/edit";

import { EDIT_NAV_ROUTES } from '@/utils/constants/navigation';
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
            <Breadcrumbs>
                <NavMenu routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
            </Breadcrumbs>
            <ContentList />
        </HydrationBoundary>
    );
};

export default ContentPage;
