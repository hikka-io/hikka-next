import { Metadata, ResolvingMetadata } from 'next';

import Characters from '@/features/anime/anime-view/characters/characters';
import _generateMetadata from '@/utils/generate-metadata';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Персонажі',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const AnimeCharactersPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended />
        </div>
    );
};

export default AnimeCharactersPage;
