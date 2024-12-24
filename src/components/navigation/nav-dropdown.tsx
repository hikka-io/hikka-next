'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, createElement, memo } from 'react';

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

import { Separator } from '../ui/separator';

interface Props {
    routes: Hikka.NavRoute[];
    urlPrefix: string;
    showOnMobile?: boolean;
    isEqualPath?: boolean;
}

const NavDropdown: FC<Props> = ({
    routes,
    urlPrefix,
    showOnMobile,
    isEqualPath = true,
}) => {
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

    const groupedRoutes = routes.reduce(
        (acc: Record<string, Hikka.NavRoute[]>, route) => {
            const key = route.group || 'default';
            acc[key] = acc[key] || [];
            acc[key].push(route);
            return acc;
        },
        {},
    );

    return (
        <NavigationMenu delayDuration={0} skipDelayDuration={0}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        onClick={(e) => isDesktop && e.preventDefault()}
                        className="max-w-32 sm:max-w-none"
                    >
                        {current && (
                            <P className="truncate text-sm">
                                {current.title_ua}
                            </P>
                        )}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-56">
                        {Object.keys(groupedRoutes).map((group) => (
                            <div key={group}>
                                {group !== 'default' && (
                                    <div className="px-2 pt-1.5 text-xs font-medium text-muted-foreground">
                                        {group}
                                    </div>
                                )}
                                <div className="p-1 pr-1.5">
                                    {groupedRoutes[group].map((r) => {
                                        return (
                                            (r.visible === undefined ||
                                                r.visible) && (
                                                <NavigationMenuLink
                                                    asChild
                                                    key={r.slug}
                                                >
                                                    <Link
                                                        href={urlPrefix + r.url}
                                                    >
                                                        {r.icon &&
                                                            createElement(
                                                                r.icon,
                                                                {
                                                                    className:
                                                                        'mr-2 size-4',
                                                                },
                                                            )}
                                                        {r.title_ua}
                                                    </Link>
                                                </NavigationMenuLink>
                                            )
                                        );
                                    })}
                                </div>
                                {group !== 'default' && <Separator />}
                            </div>
                        ))}
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default memo(NavDropdown);
