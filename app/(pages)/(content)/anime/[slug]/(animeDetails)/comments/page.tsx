import { Metadata, ResolvingMetadata } from 'next';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import Comments from '@/components/comments/comments';
import getComments from '@/services/api/comments/getComments';
import { getCookie } from '@/utils/actions';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Коментарі',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

interface Props {
    params: { slug: string };
}

const AnimeCommentsPage = async ({ params: { slug } }: Props) => {
    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['comments', slug, 'anime', { auth }],
        queryFn: ({ pageParam }) =>
            getComments({
                slug,
                content_type: 'anime',
                page: pageParam,
                auth,
            }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Comments auth={auth} slug={slug} content_type="anime" />
        </HydrationBoundary>
    );
};

export default AnimeCommentsPage;
