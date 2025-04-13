import { Metadata, ResolvingMetadata } from 'next';

import Anime from '../../../../../../../features/characters/character-view/anime.component';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
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

const CharacterAnimePage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Anime extended />
        </div>
    );
};

export default CharacterAnimePage;
