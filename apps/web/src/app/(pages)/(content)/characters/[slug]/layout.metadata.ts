import { CharacterResponse } from '@hikka/client';
import { getHikkaClient } from '@hikka/react/core';
import { Metadata, ResolvingMetadata } from 'next';

export interface MetadataProps {
    params: {
        slug: string;
    };
}

export default async function generateMetadata(
    { params }: MetadataProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;
    const slug = params.slug;
    const client = getHikkaClient();

    const character: CharacterResponse =
        await client.characters.getCharacterBySlug(slug);

    const title =
        character.name_ua || character.name_en || character.name_ja || '';

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: undefined,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image ?? undefined,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image ?? undefined,
        },
    };
}
