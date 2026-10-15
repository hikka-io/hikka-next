import { type FC, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';

import { parseUserLinks, userProfileOptions } from '@hikka/api';

import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import { useFitCount } from './use-fit-count';
import UserLinkPill from './user-link-pill';
import UserLinksMore from './user-links-more';

type Props = {
    className?: string;
};

const UserLinks: FC<Props> = ({ className }) => {
    const params = useParams();
    const { data: user } = useQuery(
        userProfileOptions({
            path: { username: String(params.username) },
        }),
    );
    const links = parseUserLinks(user?.links);
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const fit = useFitCount(containerRef, measureRef, links.length);

    if (links.length === 0) {
        return null;
    }

    const hidden = links.slice(fit);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative -m-1 flex min-w-0 gap-2 overflow-hidden p-1',
                className,
            )}
        >
            {links.slice(0, fit).map((link, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: links have no id and keep their order
                <UserLinkPill key={index} link={link} />
            ))}
            {hidden.length > 0 && <UserLinksMore links={hidden} />}
            <div
                ref={measureRef}
                aria-hidden
                inert
                className="invisible absolute top-0 left-0 flex w-max gap-2"
            >
                {links.map((link, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: links have no id and keep their order
                    <UserLinkPill key={index} link={link} asPlaceholder />
                ))}
                <UserLinksMore links={links} asPlaceholder />
            </div>
        </div>
    );
};

export default UserLinks;
