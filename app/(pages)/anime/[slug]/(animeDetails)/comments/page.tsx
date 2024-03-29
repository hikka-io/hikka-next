import { Metadata, ResolvingMetadata } from 'next';

import { getCookie } from '@/app/actions';
import Comments from '@/components/comments/comments';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Коментарі',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Коментарі',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Коментарі',
        },
    };
}

interface Props {
    params: { slug: string };
}

const AnimeCommentsPage = async ({ params: { slug } }: Props) => {
    const auth = await getCookie('auth');

    return <Comments auth={auth} slug={slug} content_type="anime" />;
};

export default AnimeCommentsPage;
