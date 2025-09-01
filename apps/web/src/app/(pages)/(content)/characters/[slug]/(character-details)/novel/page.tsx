import { Metadata, ResolvingMetadata } from 'next';

import Novel from '@/features/characters/character-view/novel';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return {
        title: 'Ранобе',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Ранобе',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Ранобе',
        },
    };
}

const CharacterNovelPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Novel extended />
        </div>
    );
};

export default CharacterNovelPage;
