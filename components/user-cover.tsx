'use client';

import { FC } from 'react';

import Image from '@/components/ui/image';

import useSession from '@/services/hooks/auth/useSession';
import useUser from '@/services/hooks/user/useUser';

interface Props {
    username?: string;
}

const UserCover: FC<Props> = ({ username }) => {
    const { user: loggedUser } = useSession();
    const { data: user } = useUser({ username: String(username) });

    const cover = username ? user?.cover : user?.cover || loggedUser?.cover;

    if (!cover) return null;

    return (
        <div className="absolute left-0 top-0 -z-20 h-80 w-full overflow-hidden opacity-40 gradient-mask-b-0">
            <Image
                src={cover}
                className="relative size-full object-cover"
                alt="cover"
                fill
                priority
            />
        </div>
    );
};

export default UserCover;
