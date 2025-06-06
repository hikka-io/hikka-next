'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createElement } from 'react';

import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

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
            className="w-full overflow-hidden rounded-md"
        >
            <ScrollArea>
                <TabsList className="no-scrollbar w-full items-center justify-start border-none bg-background/60 backdrop-blur-xl">
                    {routes.map((r) => (
                        <TabsTrigger
                            asChild
                            key={r.slug}
                            value={urlPrefix + r.url}
                            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:hover:bg-secondary/80"
                        >
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
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </Tabs>
    );
};

export default Component;
