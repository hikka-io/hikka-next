import { Metadata, ResolvingMetadata } from 'next';

import Characters from '@/features/people/components/characters';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return {
        title: 'Персонажі',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Персонажі',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Персонажі',
        },
    };
}

const PersonCharactersPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended />
        </div>
    );
};

export default PersonCharactersPage;
