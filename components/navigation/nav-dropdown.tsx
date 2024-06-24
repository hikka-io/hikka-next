'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createElement, memo } from 'react';

import P from '@/components/typography/p';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { useMediaQuery } from '@/services/hooks/use-media-query';

interface Props {
    routes: Hikka.NavRoute[];
    urlPrefix: string;
    showOnMobile?: boolean;
    isEqualPath?: boolean;
}

const Component = ({
    routes,
    urlPrefix,
    showOnMobile,
    isEqualPath = true,
}: Props) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const pathname = usePathname();

    const current =
        routes.find((r) =>
            isEqualPath
                ? pathname == urlPrefix + r.url
                : pathname.startsWith(urlPrefix + r.url),
        ) || routes[0];

    if (!isDesktop && !showOnMobile) {
        return current && <P className="text-sm">{current.title_ua}</P>;
    }

    return (
        <NavigationMenu delayDuration={0} skipDelayDuration={0}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        onClick={(e) => e.preventDefault()}
                        className="max-w-32 sm:max-w-none"
                    >
                        {current && (
                            <P className="truncate text-sm">
                                {current.title_ua}
                            </P>
                        )}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="w-56 pb-1.5 pl-1 pr-1.5 pt-1">
                            {routes.map((r) => {
                                return (
                                    (r.visible === undefined || r.visible) && (
                                        <li key={r.slug}>
                                            <NavigationMenuLink asChild>
                                                <Link href={urlPrefix + r.url}>
                                                    {r.icon &&
                                                        createElement(r.icon, {
                                                            className:
                                                                'mr-2 h-4 w-4',
                                                        })}
                                                    {r.title_ua}
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    )
                                );
                            })}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default memo(Component);
