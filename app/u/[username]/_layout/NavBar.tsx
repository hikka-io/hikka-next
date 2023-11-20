'use client';

import { useParams, usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import useIsMobile from '@/utils/hooks/useIsMobile';
import {useAuthContext} from "@/utils/providers/AuthProvider";
import {useQueryClient} from "@tanstack/react-query";

const ITEMS: {
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
    {
        slug: 'edit',
        title_ua: 'Правки',
        url: '/edit',
        role: ['admin', 'moderator']
    },
];

const Component = () => {
    const isMobile = useIsMobile();
    const queryClient = useQueryClient();
    const navRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const pathname = usePathname();
    const user: Hikka.User | undefined = queryClient.getQueryData([
        'user',
        params.username,
    ]);

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
            className="flex gap-8 overflow-y-scroll -mx-4 lg:mx-0 p-4 lg:p-0"
        >
            {ITEMS.map((item) => {
                if (item.role && item.role.length > 0) {
                    if (!item.role.some((role) => user?.role === role)) {
                        return null;
                    }
                }

                return (
                    <Link
                        href={'/u/' + params.username + item.url}
                        key={item.slug}
                        className={clsx(
                            'btn btn-ghost rounded-full btn-badge',
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
