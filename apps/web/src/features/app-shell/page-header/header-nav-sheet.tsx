import { type FC, useState } from 'react';

import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Link, usePathname } from '@/utils/navigation';

import { navRowClassName } from '../nav-styles';

type Props = {
    routes: Hikka.NavRoute[];
    urlPrefix: string;
};

const HeaderNavSheet: FC<Props> = ({ routes, urlPrefix }) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isCurrent = (route: Hikka.NavRoute) =>
        pathname === `${urlPrefix}${route.url}`;

    const current = routes.find(isCurrent) ?? routes[0];

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger className="-my-1 flex min-w-0 items-center gap-0.5 py-1 text-muted-foreground text-xs">
                <span className="truncate">{current?.title_ua}</span>
                <MaterialSymbolsKeyboardArrowDownRounded className="size-3.5 shrink-0" />
            </DrawerTrigger>
            <DrawerContent className="gap-0 p-0 data-[vaul-drawer-direction=bottom]:pb-[var(--safe-area-bottom)]">
                <DrawerTitle className="sr-only">Розділи</DrawerTitle>
                <div className="flex flex-col gap-0.5 overflow-y-auto p-3 pt-6">
                    {routes.map((route) => (
                        <Link
                            key={route.slug}
                            to={`${urlPrefix}${route.url}`}
                            search={route.search}
                            onClick={() => setOpen(false)}
                            className={navRowClassName}
                            data-active={isCurrent(route)}
                        >
                            {route.icon && <route.icon />}
                            <span>{route.title_ua}</span>
                        </Link>
                    ))}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default HeaderNavSheet;
