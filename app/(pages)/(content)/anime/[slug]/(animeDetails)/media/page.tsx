import { Metadata, ResolvingMetadata } from 'next';

import _generateMetadata from '@/utils/generateMetadata';

import Media from '../../../../../../../features/anime/anime-view/media/media';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Медіа',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const AnimeMediaPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Media extended />
        </div>
    );
};

export default AnimeMediaPage;
