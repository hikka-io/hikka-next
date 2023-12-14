'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import Popper from '@/app/_components/Popper';
import { USER_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';
import { usePopperContext } from '@/utils/providers/PopperProvider';

const Component = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { userNav, closePoppers, switchPopper } = usePopperContext();

    const isMobile = useIsMobile();
    const params = useParams();
    const pathname = usePathname();

    const current = USER_NAV_ROUTES.find(
        (r) => pathname === '/u/' + params.username + r.url,
    );

    return (
        <>
            <div className="flex items-center gap-2" ref={ref}>
                <Link
                    href={'/u/' + params.username + current?.url}
                    className="text-sm hover:underline"
                >
                    {current?.title_ua}
                </Link>
                {!isMobile && (
                    <button
                        onClick={() => switchPopper('userNav')}
                        className="btn btn-ghost btn-sm px-1"
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
                        {USER_NAV_ROUTES.map((r) => (
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
