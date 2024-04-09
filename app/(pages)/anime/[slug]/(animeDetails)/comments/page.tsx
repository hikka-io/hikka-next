import { Metadata, ResolvingMetadata } from 'next';

import Comments from '@/components/comments/comments';
import { getCookie } from '@/utils/actions';
import _generateMetadata from '@/utils/generateMetadata';

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
    const auth = await getCookie('auth');

    return <Comments auth={auth} slug={slug} content_type="anime" />;
};

export default AnimeCommentsPage;
