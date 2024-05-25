import { Metadata, ResolvingMetadata } from 'next';

import getUserInfo, {
    Response as UserResponse,
} from '@/services/api/user/getUserInfo';
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

    const user: UserResponse = await getUserInfo({
        params: {
            username,
        },
    });

    return _generateMetadata({
        title: {
            default: user.username,
            template: user.username + ' / %s / Hikka',
        },
        description: user.description,
        images: `https://preview.hikka.io/u/${username}/${user.updated}`,
    });
}
