import { type FC, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    parseUserLinks,
    type UserLinkResponse,
    userProfileOptions,
} from '@hikka/api';

import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import { useFitCount } from './use-fit-count';
import UserLinkPill from './user-link-pill';
import UserLinksMore from './user-links-more';
import UserLinksStack from './user-links-stack';

const MAX_VISIBLE_LINKS = 3;

type Props = {
    className?: string;
};

type RowProps = Props & {
    links: UserLinkResponse[];
};

const LinksRow: FC<RowProps> = ({ links, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const fit = useFitCount(
        containerRef,
        measureRef,
        links.length,
        MAX_VISIBLE_LINKS,
    );
    const hidden = links.slice(fit);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative -m-1 flex min-w-0 gap-2 overflow-hidden p-1',
                className,
            )}
        >
            {links.slice(0, fit).map((link) => (
                <UserLinkPill key={link.url} link={link} />
            ))}
            {hidden.length > 0 && <UserLinksMore links={hidden} />}
            <div
                ref={measureRef}
                aria-hidden
                inert
                className="invisible absolute top-0 left-0 flex w-max gap-2"
            >
                {links.map((link) => (
                    <UserLinkPill
                        key={link.url}
                        link={link}
                        render={<span />}
                    />
                ))}
                <UserLinksStack links={links} render={<span />} />
            </div>
        </div>
    );
};

const UserLinks: FC<Props> = ({ className }) => {
    const params = useParams();
    const username = String(params.username);
    const { data: user } = useQuery(
        userProfileOptions({
            path: { username },
        }),
    );
    const links = parseUserLinks(user?.links);

    if (links.length === 0) {
        return null;
    }

    return <LinksRow key={username} links={links} className={className} />;
};

export default UserLinks;
