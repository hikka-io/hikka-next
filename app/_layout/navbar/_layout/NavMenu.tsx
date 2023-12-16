'use client';

import clsx from 'clsx';
import { useRef } from 'react';
import MaterialSymbolsLightGridViewRounded from '~icons/material-symbols-light/grid-view-rounded';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';
import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Popper from '@/app/_components/Popper';
import { usePopperContext } from '@/utils/providers/PopperProvider';

interface Props {
    className?: string;
}

const ROUTES = [
    {
        slug: 'anime',
        title_ua: 'Каталог',
        url: '/anime',
        icon: <MaterialSymbolsLightGridViewRounded />,
        visible: true,
    },
    {
        slug: 'edit',
        title_ua: 'Правки',
        url: '/edit',
        icon: <MaterialSymbolsEditRounded />,
        visible: true,
    },
    {
        slug: 'users',
        title_ua: 'Користувачі',
        url: '/u',
        icon: null,
        visible: false,
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
        icon: null,
        visible: false,
    },
];

const Component = ({ className }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const { mainNav, closePoppers, switchPopper } = usePopperContext();
    const pathname = usePathname();
    const parsedPathname = pathname.split('/');

    const current = ROUTES.find(
        (r) =>
            parsedPathname.length > 1 &&
            ("/" + parsedPathname[1]).includes(r.url),
    );

    return (
        <>
            <div
                className={clsx('flex items-center gap-2', className)}
                ref={ref}
            >
                {current?.visible ? (
                    <Link
                        href={current?.url || '/'}
                        className="text-sm hover:underline"
                    >
                        {current?.title_ua}
                    </Link>
                ) : (
                    <p className="text-sm">{current?.title_ua}</p>
                )}
                <button
                    onClick={() => switchPopper('mainNav')}
                    className="btn btn-ghost btn-sm px-1"
                >
                    <PhCaretUpDownThin />
                </button>
            </div>
            <Popper
                disablePortal
                placement="bottom-start"
                id="main-nav"
                open={Boolean(mainNav)}
                onDismiss={closePoppers}
                anchorEl={ref.current}
            >
                <ul className="menu w-full [&_li>*]:py-3">
                    {ROUTES.map(
                        (r) =>
                            r.visible && (
                                <li key={r.slug}>
                                    <Link
                                        className={clsx(
                                            pathname === r.url && 'active',
                                        )}
                                        href={r.url}
                                        onClick={closePoppers}
                                    >
                                        {r.icon}
                                        {r.title_ua}
                                    </Link>
                                </li>
                            ),
                    )}
                </ul>
            </Popper>
        </>
    );
};

export default Component;