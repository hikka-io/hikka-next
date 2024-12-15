import { Metadata, ResolvingMetadata } from 'next';
import { permanentRedirect } from 'next/navigation';

import Franchise from '@/features/franchise/franchise.component';

import _generateMetadata from '@/utils/generate-metadata';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Пов’язане',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const NovelFranchisePage = async (props: {
    searchParams: Promise<Record<string, any>>;
}) => {
    const searchParams = await props.searchParams;

    const { content_types } = searchParams;

    if (!content_types) {
        return permanentRedirect(
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
