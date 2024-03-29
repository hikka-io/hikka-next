import { Metadata, ResolvingMetadata } from 'next';

import Media from '../../_components/media';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Медіа',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Медіа',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Медіа',
        },
    };
}

const AnimeMediaPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Media extended />
        </div>
    );
};

export default AnimeMediaPage;
