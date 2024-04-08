'use client';

import { createElement, memo } from 'react';



import Link from 'next/link';
import { usePathname } from 'next/navigation';



import P from '@/components/typography/p';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import useIsMobile from '@/services/hooks/useIsMobile';


interface Props {
    routes: Hikka.NavRoute[];
    urlPrefix: string;
    showOnMobile?: boolean;
    isEqualPath?: boolean;
}

const Component = ({ routes, urlPrefix, showOnMobile, isEqualPath = true }: Props) => {
    const isMobile = useIsMobile();
    const pathname = usePathname();

    const current =
        routes.find((r) =>
            isEqualPath
                ? pathname == urlPrefix + r.url
                : pathname.startsWith(urlPrefix + r.url),
        ) || routes[0];

    if (isMobile && !showOnMobile) {
        return current && <P className="text-sm">{current.title_ua}</P>;
    }

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="max-w-32 sm:max-w-none">
                        {current && (
                            <P className="truncate text-sm">{current.title_ua}</P>
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
