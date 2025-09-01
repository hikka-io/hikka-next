import { Metadata, ResolvingMetadata } from 'next';

import Voices from '@/features/characters/character-view/voices';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return {
        title: 'Сейю',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Сейю',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Сейю',
        },
    };
}

const CharacterVoicesPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Voices extended />
        </div>
    );
};

export default CharacterVoicesPage;
