import { Metadata, ResolvingMetadata } from 'next';

import Manga from '@/features/people/person-view/manga.component';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return {
        title: 'Манґа',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Манґа',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Манґа',
        },
    };
}

const PersonMangaPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Manga extended />
        </div>
    );
};

export default PersonMangaPage;
