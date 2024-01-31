'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';
import { createElement } from 'react';

interface Props {
    routes: Hikka.NavRoute[];
    urlPrefix: string;
}

const Component = ({ routes, urlPrefix }: Props) => {
    const pathname = usePathname();

    return (
        <Tabs value={pathname} className="overflow-hidden w-full">
            <TabsList className="w-full overflow-x-scroll items-center justify-start no-scrollbar bg-secondary/30 border border-secondary/60 backdrop-blur">
                {routes.map((r) => (
                    <TabsTrigger asChild key={r.slug} value={urlPrefix + r.url} className="data-[state=active]:bg-secondary">
                        <Link href={urlPrefix + r.url} className="flex items-center gap-2">{r.icon}{r.title_ua}</Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default Component;