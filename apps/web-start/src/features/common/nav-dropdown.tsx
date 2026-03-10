'use client';

import { Link } from '@tanstack/react-router';
import { usePathname } from '@/utils/navigation';
import { FC, createElement, memo } from 'react';

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
        return current && <p className="text-sm">{current.title_ua}</p>;
    }

    return (
        <NavigationMenu delayDuration={0} skipDelayDuration={0}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        onClick={(e) => isDesktop && e.preventDefault()}
                        className="max-w-32 sm:max-w-none"
                    >
                        {current && (
                            <p className="truncate text-sm">
                                {current.title_ua}
                            </p>
                        )}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-56">
                        <div className="p-1 pr-1.5">
                            {routes.map((r) => {
                                return (
                                    (r.visible === undefined || r.visible) && (
                                        <NavigationMenuLink
                                            asChild
                                            key={r.slug}
                                        >
                                            <Link to={urlPrefix + r.url}>
                                                {r.icon &&
                                                    createElement(r.icon, {
                                                        className:
                                                            'mr-2 size-4',
                                                    })}
                                                {r.title_ua}
                                            </Link>
                                        </NavigationMenuLink>
                                    )
                                );
                            })}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default memo(NavDropdown);
