'use client';

import clsx from 'clsx';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { USER_NAV_ROUTES } from '@/utils/constants';
import { Tabs, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';

const Component = () => {
    const params = useParams();
    const pathname = usePathname();

    return (
        <Tabs value={pathname} defaultValue="account" className="px-2 overflow-hidden w-full">
            <TabsList className="w-full overflow-x-scroll items-center justify-start no-scrollbar">
                {USER_NAV_ROUTES.map((r) => (
                    <TabsTrigger asChild key={r.slug} value={'/u/' + params.username + r.url}>
                        <Link
                            href={'/u/' + params.username + r.url}
                        >
                            {r.title_ua}
                        </Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default Component;
