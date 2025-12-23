import { ContentTypeEnum } from '@hikka/client';
import { Metadata, ResolvingMetadata } from 'next';

import { ContentStaff as Staff } from '@/features/content';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

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

const NovelStaffPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Staff extended content_type={ContentTypeEnum.NOVEL} />
        </div>
    );
};

export default NovelStaffPage;
