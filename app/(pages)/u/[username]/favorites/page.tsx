import { Metadata, ResolvingMetadata } from 'next';

import Favorites from '../_components/favorites/favorites';

export async function generateMetadata(
    { params }: { params: { username: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Улюблене',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Улюблене',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Улюблене',
        },
    };
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Favorites extended />
        </div>
    );
};

export default Component;
