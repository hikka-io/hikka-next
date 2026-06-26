import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { userReferenceOptions } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link as TanstackLink } from '@/utils/navigation';

type Props = {
    node?: { properties?: { username?: string } };
};

const MENTION_CLASSNAME =
    'inline-flex items-baseline gap-1 text-primary-foreground hover:underline';

const Mention: FC<Props> = ({ node }) => {
    const username = node?.properties?.username ?? '';

    const { data: user } = useQuery({
        ...userReferenceOptions({ path: { reference: username } }),
        enabled: !!username,
    });

    if (!username) return null;

    return (
        <TanstackLink to={`/u/${username}`} className={MENTION_CLASSNAME}>
            <Avatar className="size-5 self-center">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            @{username}
        </TanstackLink>
    );
};

export default Mention;
