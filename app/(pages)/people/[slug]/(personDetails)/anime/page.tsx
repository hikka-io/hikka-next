import { Metadata, ResolvingMetadata } from 'next';

import Anime from '../../_components/anime';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Аніме',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Аніме',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Аніме',
        },
    };
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Anime extended />
        </div>
    );
};

export default Component;
