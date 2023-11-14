'use client';

import { useParams, usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import useIsMobile from '@/utils/hooks/useIsMobile';

const ITEMS: {
    slug: string;
    title_ua: string;
    url: string;
}[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'list',
        title_ua: 'Список',
        url: '/list',
    },
    {
        slug: 'favorites',
        title_ua: 'Улюблені',
        url: '/favorites',
    },
];

const Component = () => {
    const isMobile = useIsMobile();
    const navRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const pathname = usePathname();

    useEffect(() => {
        if (
            isMobile &&
            navRef.current &&
            pathname !== `/u/${params.username}`
        ) {
            navRef.current.scrollIntoView();
        }
    }, [pathname]);

    return (
        <div
            ref={navRef}
            className="flex gap-8 overflow-y-scroll -mx-4 md:mx-0 p-4 md:p-0"
        >
            {ITEMS.map((item) => {
                return (
                    <Link
                        replace
                        href={'/u/' + params.username + item.url}
                        key={item.slug}
                        className={clsx(
                            'btn btn-ghost rounded-full btn-sm',
                            pathname === '/u/' + params.username + item.url &&
                                'btn-active',
                        )}
                    >
                        {item.title_ua}
                    </Link>
                );
            })}
        </div>
    );
};

export default Component;
