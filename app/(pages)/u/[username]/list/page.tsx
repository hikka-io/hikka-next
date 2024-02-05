import { Metadata, ResolvingMetadata } from 'next';

import Filters from '@/app/_components/filters';
import SubHeader from '@/app/_components/sub-header';

import List from './_components/list/list';

export async function generateMetadata(
    { params }: { params: { username: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: 'Список',
        description: parentMetadata.openGraph?.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.openGraph?.images,
            title: 'Список',
        },
        twitter: {
            description: parentMetadata.openGraph?.description,
            images: parentMetadata.twitter?.images,
            title: 'Список',
        },
    };
}

const Component = () => {
    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
            <List />
            <div className="bg-secondary/30 border border-secondary/60 p-4 rounded-md h-fit opacity-60 hover:opacity-100 sticky top-20">
                <Filters />
            </div>
        </div>
    );
};

export default Component;