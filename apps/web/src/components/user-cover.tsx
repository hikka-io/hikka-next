'use client';

import { useSession, useUserByUsername } from '@hikka/react';
import { FC } from 'react';

import Image from './ui/image';

interface Props {
    username?: string;
}

const UserCover: FC<Props> = ({ username }) => {
    const { user: loggedUser } = useSession();
    const { data: user } = useUserByUsername({
        username: username || '',
        options: {
            enabled: !!username,
        },
    });

    const cover = username ? user?.cover : user?.cover || loggedUser?.cover;

    if (!cover) return null;

    return (
        <div className="gradient-mask-b-0 absolute left-0 top-0 -z-20 h-80 w-full overflow-hidden opacity-40">
            <Image
                src={cover}
                className="relative size-full object-cover"
                alt="cover"
                fill
                loading="lazy"
            />
        </div>
    );
};

export default UserCover;
