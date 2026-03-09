import { CharacterResponse } from '@hikka/client';
import { getHikkaClient } from '@hikka/react/core';
import { Metadata } from 'next';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

export interface MetadataProps {
    params: {
        slug: string;
    };
}

export default async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const slug = params.slug;
    const client = getHikkaClient();

    const character: CharacterResponse =
        await client.characters.getCharacterBySlug(slug);

    const title =
        character.name_ua || character.name_en || character.name_ja || '';

    return _generateMetadata({
        title: {
            default: title,
            template: `%s / ${title} / Hikka`,
        },
        description: character.description_ua || undefined,
        images: character.image ?? undefined,
    });
}
