'use client';

import { useParams, usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import useIsMobile from '@/utils/hooks/useIsMobile';
import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';
import Popper from '@/app/_components/Popper';
import { usePopperContext } from '@/utils/providers/PopperProvider';

const ROUTES: {
    slug: string;
    title_ua: string;
    url: string;
    role?: Hikka.UserRole[];
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
    const ref = useRef<HTMLDivElement>(null);

    const isMobile = useIsMobile();
    const params = useParams();
    const pathname = usePathname();

    useEffect(() => {
        if (isMobile && ref.current && pathname !== `/u/${params.username}`) {
            ref.current.scrollIntoView();
        }
    }, [pathname]);

    return (
        <div className="tabs flex-nowrap w-full pb-6" ref={ref}>
            {ROUTES.map((r) => (
                <Link
                    key={r.slug}
                    className={clsx(
                        "tab h-12",
                        pathname ===
                        '/u/' + params.username + r.url &&
                        'tab-bordered tab-active',
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
