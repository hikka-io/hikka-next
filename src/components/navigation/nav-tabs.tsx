'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createElement } from 'react';

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
            className="w-full overflow-hidden"
        >
            <TabsList className="no-scrollbar w-full items-center justify-start overflow-x-auto border border-secondary/60 bg-secondary/80 backdrop-blur">
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
