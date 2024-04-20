import { Metadata, ResolvingMetadata } from 'next';

import _generateMetadata from '@/utils/generateMetadata';

import Staff from '../../components/staff';

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
