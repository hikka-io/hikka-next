import Links from '@/app/(pages)/anime/[slug]/_layout/Links';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Посилання',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Посилання',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Посилання',
        },
    };
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Links extended />
        </div>
    );
};

export default Component;
