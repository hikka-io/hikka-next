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
import { LoginButton } from '@/features/auth';
import { Link, usePathname } from '@/utils/navigation';

import { isNavActive, MOBILE_SHEET_NAV } from '../../nav-config';
import {
    NAV_GROUP_LABEL_CLASS_NAME,
    NAV_ROW_CLASS_NAME,
} from '../../nav-styles';
import { useProfileMenu } from '../use-profile-menu';
import ProfileIdentity from './profile-identity';

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
            <DrawerTrigger render={children as React.ReactElement} />
            <DrawerContent className="gap-0 p-0 data-[swipe-direction=down]:pb-[var(--safe-area-bottom)]">
                <DrawerTitle className="sr-only">Навігація</DrawerTitle>

                <div className="shrink-0 border-border border-b p-3 pt-6">
                    {user ? (
                        <ProfileIdentity user={user} onNavigate={close} />
                    ) : (
                        <div className="flex gap-2">
                            <LoginButton
                                variant="outline"
                                className="flex-1"
                                onClick={close}
                            />
                            <Button
                                size="md"
                                className="flex-1"
                                render={<Link to="/signup" onClick={close} />}
                            >
                                Реєстрація
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex min-h-0 flex-col gap-0.5 overflow-y-auto p-3">
                    {user && (
                        <>
                            <span className={NAV_GROUP_LABEL_CLASS_NAME}>
                                Профіль
                            </span>
                            {items.map((item) => (
                                <Link
                                    key={item.slug}
                                    to={item.url}
                                    search={item.search}
                                    onClick={close}
                                    className={NAV_ROW_CLASS_NAME}
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
                            <span className={NAV_GROUP_LABEL_CLASS_NAME}>
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
                                        className={NAV_ROW_CLASS_NAME}
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
                                className={NAV_ROW_CLASS_NAME}
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
