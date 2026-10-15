import type { FC } from 'react';

import type { UserLink } from '@hikka/api';

import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { getUserLinkLabel } from '@/utils/user-links';

type Props = {
    link: UserLink;
    asPlaceholder?: boolean;
};

const UserLinkPill: FC<Props> = ({ link, asPlaceholder }) => {
    const Icon = USER_LINK_ICONS[link.icon];
    const label = getUserLinkLabel(link);
    const className = cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'rounded-full px-3',
    );
    const content = (
        <>
            <Icon />
            <span className="max-w-40 truncate">{label}</span>
        </>
    );

    if (asPlaceholder) {
        return <span className={className}>{content}</span>;
    }

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            title={label}
            className={className}
        >
            {content}
        </a>
    );
};

export default UserLinkPill;
