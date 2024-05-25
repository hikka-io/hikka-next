import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Metadata, ResolvingMetadata } from 'next';

import Comments from '@/features/comments/comment-list/comment-list.component';

import getComments from '@/services/api/comments/getComments';
import _generateMetadata from '@/utils/generate-metadata';
import getQueryClient from '@/utils/get-query-client';

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
    const queryClient = await getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['comments', slug, 'anime'],
        queryFn: ({ pageParam, meta }) =>
            getComments({
                params: {
                    slug,
                    content_type: 'anime',
                },
                page: pageParam,
            }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Comments slug={slug} content_type="anime" />
        </HydrationBoundary>
    );
};

export default AnimeCommentsPage;
