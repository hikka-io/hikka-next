import { UserResponse } from '@hikka/client';
import { getHikkaClient } from '@hikka/react';
import { Metadata, ResolvingMetadata } from 'next';

import _generateMetadata from '@/utils/generate-metadata';

export interface MetadataProps {
    params: {
        username: string;
    };
}

export default async function generateMetadata(
    { params }: MetadataProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const username = params.username;

    const client = getHikkaClient();
    const user: UserResponse = await client.user.getByUsername(username);

    return _generateMetadata({
        title: {
            default: user.username,
            template: user.username + ' / %s / Hikka',
        },
        description: user.description,
        images: `https://preview.hikka.io/u/${username}/${user.updated}`,
    });
}
