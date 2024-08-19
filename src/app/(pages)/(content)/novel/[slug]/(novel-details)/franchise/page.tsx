import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';

import Franchise from '@/features/franchise/franchise.component';

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

const NovelFranchisePage = async ({
    searchParams: { content_types },
}: {
    searchParams: Record<string, any>;
}) => {
    if (!content_types) {
        return redirect(
            '?content_types=anime&content_types=manga&content_types=novel',
        );
    }

    return (
        <div className="flex flex-col gap-12">
            <Franchise content_type="novel" extended />
        </div>
    );
};

export default NovelFranchisePage;
