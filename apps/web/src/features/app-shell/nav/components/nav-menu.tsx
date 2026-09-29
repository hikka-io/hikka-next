import { buttonVariants } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
    SELECTED_TINT,
    SELECTED_TINT_HOVER,
} from '@/components/ui/selected-tint';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { Link, usePathname } from '@/utils/navigation';

import {
    APP_NAV_CONTENT,
    APP_NAV_MORE,
    APP_NAV_USER_CONTENT,
    isNavActive,
} from '../../nav-config';

const navItemSize = 'h-9 gap-1.5 rounded-md px-2.5';

function navItemClassName(active: boolean) {
    return cn(
        'border border-transparent',
        buttonVariants({ variant: 'ghost' }),
        navItemSize,
        active ? cn(SELECTED_TINT, SELECTED_TINT_HOVER) : 'text-foreground/70',
    );
}

const triggerClassName = cn(
    navItemSize,
    'border border-transparent',
    'bg-transparent! text-foreground/70!',
    'hover:bg-accent! hover:text-foreground!',
    'focus:bg-transparent!',
    'data-popup-open:bg-accent! data-popup-open:text-foreground!',
);

function dropdownItemClassName(active: boolean) {
    return cn(
        buttonVariants({ variant: 'ghost' }),
        'h-auto w-full justify-start gap-2 rounded-sm border border-transparent px-2 py-1.5 text-sm',
        active
            ? cn(SELECTED_TINT, SELECTED_TINT_HOVER)
            : 'text-muted-foreground',
    );
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
                            preload="intent"
                            className={navItemClassName(
                                isNavActive(pathname, item.url),
                            )}
                        >
                            {item.icon && <item.icon />}
                            {item.title_ua}
                        </Link>
                    </NavigationMenuItem>
                ))}
                <Separator
                    orientation="vertical"
                    className="lifted-edges h-4 bg-border"
                />

                {APP_NAV_USER_CONTENT.length > 0 && (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={triggerClassName}>
                            Спільнота
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="p-1!">
                            <ul className="flex w-52 list-none flex-col gap-1">
                                {APP_NAV_USER_CONTENT.filter(
                                    (item) => item.visible,
                                ).map((item) => (
                                    <li key={item.slug}>
                                        <Link
                                            to={item.url}
                                            search={item.search}
                                            preload="intent"
                                            className={dropdownItemClassName(
                                                isNavActive(pathname, item.url),
                                            )}
                                        >
                                            {item.icon && <item.icon />}
                                            {item.title_ua}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                )}

                <Separator
                    orientation="vertical"
                    className="lifted-edges h-4 bg-border"
                />

                {APP_NAV_MORE.length > 0 && (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={triggerClassName}>
                            Ще
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="p-1!">
                            <div className="flex w-52 flex-col gap-1">
                                {APP_NAV_MORE.map((group, index) => (
                                    <div key={group.title_ua}>
                                        {index > 0 && (
                                            <Separator className="my-1" />
                                        )}
                                        <span className="px-2 py-1.5 font-medium text-muted-foreground/70 text-xs">
                                            {group.title_ua}
                                        </span>
                                        <ul className="grid list-none gap-1">
                                            {group.items
                                                .filter((item) => item.visible)
                                                .map((item) => (
                                                    <li key={item.slug}>
                                                        <Link
                                                            to={item.url}
                                                            search={item.search}
                                                            preload="intent"
                                                            className={dropdownItemClassName(
                                                                isNavActive(
                                                                    pathname,
                                                                    item.url,
                                                                ),
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
