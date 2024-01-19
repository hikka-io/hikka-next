'use client';

import clsx from 'clsx';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { USER_NAV_ROUTES } from '@/utils/constants';

const Component = () => {
    const params = useParams();
    const pathname = usePathname();

    return (
        <div className="tabs w-full flex-nowrap">
            {USER_NAV_ROUTES.map((r) => (
                <Link
                    key={r.slug}
                    className={clsx(
                        'tab h-16',
                        pathname === '/u/' + params.username + r.url &&
                            'tab-active tab-bordered',
                    )}
                    href={'/u/' + params.username + r.url}
                >
                    {r.title_ua}
                </Link>
            ))}
        </div>
    );
};

export default Component;
