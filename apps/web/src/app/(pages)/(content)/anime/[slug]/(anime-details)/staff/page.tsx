import { Metadata, ResolvingMetadata } from 'next';

import Staff from '@/features/anime/anime-view/staff.component';
import _generateMetadata from '@/utils/generate-metadata';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
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
