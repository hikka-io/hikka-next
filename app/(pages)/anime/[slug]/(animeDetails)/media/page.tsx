import Media from '@/app/(pages)/anime/[slug]/_layout/Media';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Медіа',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Медіа',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Медіа',
        },
    };
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Media extended />
        </div>
    );
};

export default Component;
