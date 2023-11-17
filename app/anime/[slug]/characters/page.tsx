import Characters from '@/app/anime/[slug]/_layout/Characters';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Персонажі',
        description: parentMetadata.openGraph?.description,
        openGraph: {
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

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended />
        </div>
    );
};

export default Component;
