'use client';

import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
} from '@/components/ui/sheet';

import { cn } from '@/utils/cn';
import { APP_SIDEBAR } from '@/utils/constants/navigation';
import { Link, usePathname } from '@/utils/navigation';

function findActiveRoute(pathname: string): Hikka.NavRoute | undefined {
    for (const group of APP_SIDEBAR) {
        for (const item of group.items) {
            if (item.items) {
                for (const sub of item.items) {
                    if (sub.visible !== false && pathname === sub.url) {
                        return sub;
                    }
                }
            }
            if (
                item.visible !== false &&
                item.url !== '/' &&
                (pathname === item.url || pathname.startsWith(item.url + '/'))
            ) {
                return item;
            }
        }
    }
    return undefined;
}

const navItemClassName = cn(
    'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
    'text-muted-foreground',
    'hover:bg-secondary/60 hover:text-foreground',
    'data-[active=true]:bg-secondary/60 data-[active=true]:text-foreground data-[active=true]:font-medium',
    '[&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
);

function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const activeRoute = findActiveRoute(pathname);

    const isActive = (url: string) => {
        if (url === '/') return pathname === '/';
        return pathname === url || pathname.startsWith(url + '/');
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <Button size="md" variant="outline" onClick={() => setOpen(true)}>
                {activeRoute?.icon && <activeRoute.icon />}
                <span>{activeRoute?.title_ua ?? 'Навігація'}</span>
                <ChevronRight className="size-3 text-muted-foreground/50" />
            </Button>

            <SheetContent
                side="left"
                showCloseButton={false}
                className="w-72 p-0"
            >
                <SheetTitle className="sr-only">Навігація</SheetTitle>
                <div className="flex min-h-16 items-center px-4">
                    <Link to="/" onClick={() => setOpen(false)}>
                        <div className="logo-full size-[24px] w-[80px]" />
                    </Link>
                </div>
                <nav className="flex flex-col gap-1 overflow-y-auto px-3 pb-4">
                    {APP_SIDEBAR.map((group) => (
                        <div
                            key={group.title_ua}
                            className="flex flex-col gap-0.5"
                        >
                            <span className="px-2 py-1.5 text-xs font-medium text-muted-foreground/70">
                                {group.title_ua}
                            </span>
                            {group.items
                                .filter((item) => item.visible)
                                .map((item) => (
                                    <div key={item.slug}>
                                        <SheetClose asChild>
                                            <Link
                                                to={item.url}
                                                search={item.search}
                                                className={navItemClassName}
                                                data-active={isActive(item.url)}
                                            >
                                                {item.icon && <item.icon />}
                                                <span>{item.title_ua}</span>
                                            </Link>
                                        </SheetClose>
                                        {item.items && (
                                            <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-2">
                                                {item.items
                                                    .filter(
                                                        (sub) => sub.visible,
                                                    )
                                                    .map((sub) => (
                                                        <SheetClose
                                                            key={sub.slug}
                                                            asChild
                                                        >
                                                            <Link
                                                                to={sub.url}
                                                                search={
                                                                    sub.search
                                                                }
                                                                className={cn(
                                                                    navItemClassName,
                                                                    'py-1.5 text-xs',
                                                                )}
                                                                data-active={isActive(
                                                                    sub.url,
                                                                )}
                                                            >
                                                                {sub.icon && (
                                                                    <sub.icon />
                                                                )}
                                                                <span>
                                                                    {
                                                                        sub.title_ua
                                                                    }
                                                                </span>
                                                            </Link>
                                                        </SheetClose>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}

export default MobileNav;
