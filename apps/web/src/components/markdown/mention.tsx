import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { userProfileOptions, userReferenceOptions } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link as TanstackLink } from '@/utils/navigation';

type Props = {
    node?: { properties?: { username?: string; reference?: string } };
};

const MENTION_CLASSNAME =
    'inline-flex items-baseline text-primary-foreground hover:underline';

const useMentionUser = (username: string, reference?: string) => {
    const { data: referencedUser } = useQuery({
        ...userReferenceOptions({ path: { reference: reference ?? '' } }),
        enabled: !!reference,
    });

    const { data: profile } = useQuery({
        ...userProfileOptions({ path: { username } }),
        enabled: !reference && !!username,
    });

    return referencedUser ?? profile;
};

const Mention: FC<Props> = ({ node }) => {
    const storedUsername = node?.properties?.username ?? '';
    const reference = node?.properties?.reference;

    const user = useMentionUser(storedUsername, reference);
    const username = user?.username || storedUsername;

    if (!username) return null;

    return (
        <TanstackLink to={`/u/${username}`} className={MENTION_CLASSNAME}>
            <Avatar className="mr-1 size-5 self-center">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            @{username}
        </TanstackLink>
    );
};

export default Mention;
