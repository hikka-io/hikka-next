import { type FC, type ReactNode, useState } from 'react';

import MaterialSymbolsLogoutRounded from '@/components/icons/material-symbols/MaterialSymbolsLogoutRounded';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { isNavActive, MOBILE_SHEET_NAV } from '@/utils/constants/navigation';
import { Link, usePathname } from '@/utils/navigation';

import LoginButton from '../../login-button';
import { useProfileMenu } from '../hooks/use-profile-menu';
import ProfileIdentity from './profile-identity';

const rowClassName = cn(
    'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
    'text-muted-foreground',
    'hover:bg-accent hover:text-foreground',
    'data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-foreground',
    '[&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
);

const groupLabelClassName =
    'px-2 py-1.5 font-medium text-muted-foreground/70 text-xs';

type Props = {
    children: ReactNode;
};

const MoreSheet: FC<Props> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const { user, items, logout } = useProfileMenu({ enabled: open });

    const close = () => setOpen(false);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="gap-0 p-0 pb-[env(safe-area-inset-bottom)]">
                <DrawerTitle className="sr-only">Навігація</DrawerTitle>

                <div className="shrink-0 border-border border-b p-3 pt-6">
                    {user ? (
                        <ProfileIdentity user={user} onNavigate={close} />
                    ) : (
                        <div className="flex gap-2">
                            <LoginButton
                                variant="default"
                                className="flex-1"
                                onClick={close}
                            />
                            <Button
                                size="md"
                                variant="outline"
                                className="flex-1"
                                asChild
                            >
                                <Link to="/signup" onClick={close}>
                                    Реєстрація
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex min-h-0 flex-col gap-0.5 overflow-y-auto p-3">
                    {user && (
                        <>
                            <span className={groupLabelClassName}>Профіль</span>
                            {items.map((item) => (
                                <Link
                                    key={item.slug}
                                    to={item.url}
                                    search={item.search}
                                    onClick={close}
                                    className={rowClassName}
                                    data-active={isNavActive(
                                        pathname,
                                        item.url,
                                    )}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title_ua}</span>
                                    {item.count !== undefined && (
                                        <span className="ml-auto text-muted-foreground text-xs tabular-nums">
                                            {item.count}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </>
                    )}

                    {MOBILE_SHEET_NAV.map((group) => (
                        <div
                            key={group.title_ua}
                            className="flex flex-col gap-0.5"
                        >
                            <span className={groupLabelClassName}>
                                {group.title_ua}
                            </span>
                            {group.items
                                .filter((item) => item.visible)
                                .map((item) => (
                                    <Link
                                        key={item.slug}
                                        to={item.url}
                                        search={item.search}
                                        onClick={close}
                                        className={rowClassName}
                                        data-active={isNavActive(
                                            pathname,
                                            item.url,
                                        )}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title_ua}</span>
                                    </Link>
                                ))}
                        </div>
                    ))}

                    {user && (
                        <>
                            <Separator className="my-1.5" />
                            <button
                                type="button"
                                onClick={logout}
                                className={rowClassName}
                            >
                                <MaterialSymbolsLogoutRounded className="text-destructive-foreground" />
                                <span>Вийти</span>
                            </button>
                        </>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default MoreSheet;
