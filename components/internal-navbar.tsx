'use client';

import { createElement } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
    routes: Hikka.NavRoute[];
    urlPrefix: string;
}

const Component = ({ routes, urlPrefix }: Props) => {
    const pathname = usePathname();

    return (
        <Tabs
            value={
                routes.some((r) => pathname == urlPrefix + r.url)
                    ? pathname
                    : urlPrefix + routes[0].url
            }
            className="overflow-hidden w-full"
        >
            <TabsList className="w-full overflow-x-scroll items-center justify-start no-scrollbar bg-secondary/80 border border-secondary/60 backdrop-blur">
                {routes.map((r) => (
                    <TabsTrigger asChild key={r.slug} value={urlPrefix + r.url}>
                        <Link
                            href={urlPrefix + r.url}
                            className="flex items-center gap-2"
                        >
                            {r.icon &&
                                createElement(r.icon, {
                                    className: 'h-4 w-4',
                                })}
                            {r.title_ua}
                        </Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default Component;
