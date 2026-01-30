import { ContentTypeEnum } from '@hikka/client';
import { Metadata, ResolvingMetadata } from 'next';

import { Franchise } from '@/features/content';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

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
    return (
        <div className="flex flex-col gap-12">
            <Franchise content_type={ContentTypeEnum.NOVEL} extended />
        </div>
    );
};

export default NovelFranchisePage;
