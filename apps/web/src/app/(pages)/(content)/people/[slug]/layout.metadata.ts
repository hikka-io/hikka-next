import { PersonResponse } from '@hikka/client';
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

    const person: PersonResponse = await client.people.getPersonBySlug(slug);

    const title = person.name_ua || person.name_en || person.name_native || '';

    return _generateMetadata({
        title: {
            default: title,
            template: `%s / ${title} / Hikka`,
        },
        description: person.description_ua || undefined,
        images: person.image ?? undefined,
    });
}
