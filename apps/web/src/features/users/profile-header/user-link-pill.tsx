import type { FC } from 'react';

import type { UserLinkResponse } from '@hikka/api';

import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import { Button, type ButtonProps } from '@/components/ui/button';
import { getUserLinkLabel, USER_LINK_REL } from '@/utils/user-links';

type Props = Omit<ButtonProps, 'children'> & {
    link: UserLinkResponse;
};

const UserLinkPill: FC<Props> = ({ link, ...props }) => {
    const Icon = USER_LINK_ICONS[link.icon];
    const label = getUserLinkLabel(link);

    return (
        <Button
            variant="outline"
            size="sm"
            className="backdrop-blur"
            render={
                <a
                    href={link.url}
                    target="_blank"
                    rel={USER_LINK_REL}
                    title={label}
                />
            }
            {...props}
        >
            <Icon />
            <span className="max-w-40 truncate">{label}</span>
        </Button>
    );
};

export default UserLinkPill;
