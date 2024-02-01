import { Metadata, ResolvingMetadata } from 'next';

import Franchise from '../../_components/franchise';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Пов’язане',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Пов’язане',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Пов’язане',
        },
    };
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Franchise extended />
        </div>
    );
};

export default Component;
