import { PersonResponse } from '@hikka/client';
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
    const person: PersonResponse = await client.people.getPersonBySlug(slug);

    const title = person.name_ua || person.name_en || person.name_native || '';

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: undefined,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: person.image ?? undefined,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: person.image ?? undefined,
        },
    };
}
