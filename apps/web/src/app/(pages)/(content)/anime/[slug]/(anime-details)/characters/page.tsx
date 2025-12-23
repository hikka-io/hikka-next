import { ContentTypeEnum } from '@hikka/client';
import { Metadata, ResolvingMetadata } from 'next';

import { ContentCharacters as Characters } from '@/features/content';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Персонажі',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const AnimeCharactersPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended content_type={ContentTypeEnum.ANIME} />
        </div>
    );
};

export default AnimeCharactersPage;
