import { Metadata, ResolvingMetadata } from 'next';

import Links from '@/features/anime/anime-view/links.component';

import _generateMetadata from '@/utils/generateMetadata';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Посилання',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const AnimeLinksPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Links extended />
        </div>
    );
};

export default AnimeLinksPage;
