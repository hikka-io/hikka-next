'use client';

import { buttonVariants } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils/cn';
import {
    APP_NAV_CONTENT,
    APP_NAV_MORE,
    APP_NAV_USER_CONTENT,
} from '@/utils/constants/navigation';
import { Link, usePathname } from '@/utils/navigation';

const navItemSize = 'h-9 gap-1.5 rounded-md px-2.5';

function navItemClassName(active: boolean) {
    return cn(
        'border border-transparent',
        buttonVariants({ variant: active ? 'default' : 'ghost' }),
        navItemSize,
        !active && 'text-muted-foreground',
    );
}

const triggerClassName = cn(
    navItemSize,
    'bg-transparent! text-muted-foreground!',
    'hover:bg-secondary/60! hover:text-foreground!',
    'focus:bg-transparent!',
    'data-[state=open]:bg-secondary/60! data-[state=open]:text-foreground!',
);

const dropdownItemClassName = cn(
    buttonVariants({ variant: 'ghost' }),
    'h-auto justify-start gap-2 rounded-sm px-2 py-1.5 text-sm w-full',
    'text-muted-foreground',
);

function isNavActive(pathname: string, url: string) {
    if (url === '/') return pathname === '/';
    return pathname === url || pathname.startsWith(url + '/');
}

function NavMenu() {
    const pathname = usePathname();

    return (
        <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">
                {APP_NAV_CONTENT.filter((item) => item.visible).map((item) => (
                    <NavigationMenuItem key={item.slug}>
                        <Link
                            to={item.url}
                            search={item.search}
                            className={navItemClassName(
                                isNavActive(pathname, item.url),
                            )}
                        >
                            {item.icon && <item.icon />}
                            {item.title_ua}
                        </Link>
                    </NavigationMenuItem>
                ))}
                <Separator orientation="vertical" className="h-4" />

                {APP_NAV_USER_CONTENT.filter((item) => item.visible).map(
                    (item) => (
                        <NavigationMenuItem key={item.slug}>
                            <Link
                                to={item.url}
                                search={item.search}
                                className={navItemClassName(
                                    isNavActive(pathname, item.url),
                                )}
                            >
                                {item.icon && <item.icon />}
                                {item.title_ua}
                            </Link>
                        </NavigationMenuItem>
                    ),
                )}
                <Separator orientation="vertical" className="h-4" />

                {APP_NAV_MORE.length > 0 && (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={triggerClassName}>
                            Ще
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="p-1!">
                            <div className="flex w-52 flex-col">
                                {APP_NAV_MORE.map((group, index) => (
                                    <div key={group.title_ua}>
                                        {index > 0 && (
                                            <Separator className="my-1" />
                                        )}
                                        <span className="px-2 py-1.5 text-xs font-medium text-muted-foreground/70">
                                            {group.title_ua}
                                        </span>
                                        <ul className="grid">
                                            {group.items
                                                .filter((item) => item.visible)
                                                .map((item) => (
                                                    <li key={item.slug}>
                                                        <Link
                                                            to={item.url}
                                                            search={item.search}
                                                            className={
                                                                dropdownItemClassName
                                                            }
                                                            data-active={isNavActive(
                                                                pathname,
                                                                item.url,
                                                            )}
                                                        >
                                                            {item.icon && (
                                                                <item.icon />
                                                            )}
                                                            {item.title_ua}
                                                        </Link>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default NavMenu;
