import type { FC } from 'react';

import type { UserLink } from '@hikka/api';

import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import { Button, type ButtonProps } from '@/components/ui/button';

const STACK_SIZE = 3;

type Props = Omit<ButtonProps, 'children'> & {
    links: UserLink[];
};

const UserLinksStack: FC<Props> = ({ links, ...props }) => (
    <Button
        variant="outline"
        size="sm"
        className="pl-1 backdrop-blur"
        {...props}
    >
        <span className="flex">
            {links.slice(0, STACK_SIZE).map((link) => {
                const Icon = USER_LINK_ICONS[link.icon];

                return (
                    <span
                        key={link.url}
                        className="-ml-1.5 flex size-6 items-center justify-center rounded-sm bg-secondary ring-1 ring-border first:ml-0 [&_svg]:size-3!"
                    >
                        <Icon />
                    </span>
                );
            })}
        </span>
        <span className="tabular-nums">+{links.length}</span>
    </Button>
);

export default UserLinksStack;
