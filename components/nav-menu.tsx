'use client';

import { createElement } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
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
                : pathname.includes(urlPrefix + r.url),
        ) || routes[0];

    if (isMobile && !showOnMobile) {
        return current && <p className="text-sm">{current.title_ua}</p>;
    }

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        {current && (
                            <p className="text-sm">{current.title_ua}</p>
                        )}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="w-56 pt-1 pl-1 pb-1.5 pr-1.5">
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

export default Component;
