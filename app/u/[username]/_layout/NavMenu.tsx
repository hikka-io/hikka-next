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
    const { userNav, closePoppers, switchPopper } = usePopperContext();

    const isMobile = useIsMobile();
    const params = useParams();
    const pathname = usePathname();

    const current = ROUTES.find(
        (r) => pathname === '/u/' + params.username + r.url,
    );

    useEffect(() => {
        if (isMobile && ref.current && pathname !== `/u/${params.username}`) {
            ref.current.scrollIntoView();
        }
    }, [pathname]);

    return (
        <>
            <div className="flex gap-2 items-center" ref={ref}>
                <Link
                    href={'/u/' + params.username + current?.url}
                    className="text-sm hover:underline"
                >
                    {current?.title_ua}
                </Link>
                {!isMobile && (
                    <button
                        onClick={() => switchPopper('userNav')}
                        className="btn btn-sm btn-ghost px-1"
                    >
                        <PhCaretUpDownThin />
                    </button>
                )}
            </div>
            {!isMobile && (
                <Popper
                    disablePortal
                    placement="bottom-start"
                    id="anime-nav"
                    open={Boolean(userNav)}
                    onDismiss={closePoppers}
                    anchorEl={ref.current}
                >
                    <ul className="menu w-full  [&_li>*]:py-3">
                        {ROUTES.map((r) => (
                            <li key={r.slug}>
                                <Link
                                    className={clsx(
                                        pathname ===
                                            '/u/' + params.username + r.url &&
                                            'active',
                                    )}
                                    href={'/u/' + params.username + r.url}
                                    onClick={closePoppers}
                                >
                                    {r.title_ua}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Popper>
            )}
        </>
    );
};

export default Component;
