import { Metadata, ResolvingMetadata } from 'next';

import Staff from '@/features/anime/anime-view/staff.component';

import _generateMetadata from '@/utils/generateMetadata';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Автори',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const AnimeStaffPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Staff extended />
        </div>
    );
};

export default AnimeStaffPage;
