import type { FC } from 'react';

import type { UserLink } from '@hikka/api';

import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import { getUserLinkDisplayUrl, getUserLinkLabel } from '@/utils/user-links';

type Props = {
    link: UserLink;
};

const UserLinkSummary: FC<Props> = ({ link }) => {
    const Icon = USER_LINK_ICONS[link.icon];

    return (
        <>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary [&_svg]:size-4">
                <Icon />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-sm">
                    {getUserLinkLabel(link)}
                </span>
                <span className="truncate font-normal text-muted-foreground text-xs">
                    {getUserLinkDisplayUrl(link.url)}
                </span>
            </span>
        </>
    );
};

export default UserLinkSummary;
