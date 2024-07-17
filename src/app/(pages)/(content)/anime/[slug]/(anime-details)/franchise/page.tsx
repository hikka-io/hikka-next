import { Metadata, ResolvingMetadata } from 'next';

import Franchise from '@/features/anime/anime-view/franchise.component';

import _generateMetadata from '@/utils/generate-metadata';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Пов’язане',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const AnimeFranchisePage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Franchise extended />
        </div>
    );
};

export default AnimeFranchisePage;
