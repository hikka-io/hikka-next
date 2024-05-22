import { Metadata, ResolvingMetadata } from 'next';

import _generateMetadata from '@/utils/generateMetadata';

import Characters from '../../../../../../../features/anime/anime-view/characters/characters';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
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
