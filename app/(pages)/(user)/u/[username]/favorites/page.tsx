import { Metadata, ResolvingMetadata } from 'next';

import Favorites from '@/app/(pages)/u/[username]/components/favorites/favorites';
import _generateMetadata from '@/utils/generateMetadata';

export async function generateMetadata(
    { params }: { params: { username: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Улюблене',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const FavoritesPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Favorites extended />
        </div>
    );
};

export default FavoritesPage;
