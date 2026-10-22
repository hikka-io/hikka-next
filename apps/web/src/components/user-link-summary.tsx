import type { FC } from 'react';

import type { UserLinkResponse } from '@hikka/api';
import { getUserLinkLabel } from '@hikka/core';

import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import LinkSummary from '@/components/link-summary';

type Props = {
    link: UserLinkResponse;
};

const UserLinkSummary: FC<Props> = ({ link }) => {
    const Icon = USER_LINK_ICONS[link.icon];

    return (
        <LinkSummary
            icon={<Icon />}
            label={getUserLinkLabel(link)}
            url={link.url}
        />
    );
};

export default UserLinkSummary;
