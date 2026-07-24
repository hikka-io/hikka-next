import type { FC, ReactNode } from 'react';

import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import MaterialSymbolsNotificationsRounded from '@/components/icons/material-symbols/MaterialSymbolsNotificationsRounded';
import MaterialSymbolsSearchRounded from '@/components/icons/material-symbols/MaterialSymbolsSearchRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from '@/features/auth/hooks/use-session';
import { NotificationsMenu } from '@/features/notifications';
import { SearchModal } from '@/features/search';
import { cn } from '@/utils/cn';
import { isNavActive } from '@/utils/constants/navigation';
import { Link, usePathname } from '@/utils/navigation';

import MoreSheet from './more-sheet';

const tabClassName =
    'group flex flex-1 flex-col items-center justify-center gap-1.5 outline-none';

const slotClassName = cn(
    'flex h-8 w-12 items-center justify-center rounded-md text-muted-foreground transition-colors',
    'group-data-[active=true]:bg-accent group-data-[active=true]:text-foreground',
    'group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50',
    '[&_svg]:size-6',
);

const labelClassName = cn(
    'text-[0.6875rem] text-muted-foreground leading-none transition-colors',
    'group-data-[active=true]:font-semibold group-data-[active=true]:text-foreground',
);

type TabProps = {
    label: string;
    children: ReactNode;
};

const Tab: FC<TabProps> = ({ label, children }) => (
    <>
        <span className={slotClassName}>{children}</span>
        <span className={labelClassName}>{label}</span>
    </>
);

const MobileTabBar = () => {
    const pathname = usePathname();
    const { user } = useSession();

    const isCatalog = ['/anime', '/manga', '/novel'].some((url) =>
        isNavActive(pathname, url),
    );

    return (
        <nav className="fixed inset-x-0 bottom-0 z-30 h-[var(--tab-bar-height)] border-t border-t-border bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 md:hidden">
            <div className="flex h-15 items-stretch px-1">
                <Link
                    to="/"
                    className={tabClassName}
                    data-active={pathname === '/'}
                    aria-current={pathname === '/' ? 'page' : undefined}
                >
                    <Tab label="Головна">
                        <span className="logo-icon size-[22px]" />
                    </Tab>
                </Link>

                <Link
                    to="/anime"
                    className={tabClassName}
                    data-active={isCatalog}
                    aria-current={isCatalog ? 'page' : undefined}
                >
                    <Tab label="Каталог">
                        <MaterialSymbolsGridViewRounded />
                    </Tab>
                </Link>

                <SearchModal>
                    <button type="button" className={tabClassName}>
                        <Tab label="Пошук">
                            <MaterialSymbolsSearchRounded />
                        </Tab>
                    </button>
                </SearchModal>

                {user && (
                    <NotificationsMenu
                        trigger={(unseenCount) => (
                            <button type="button" className={tabClassName}>
                                <Tab label="Сповіщення">
                                    <span className="relative">
                                        <MaterialSymbolsNotificationsRounded />
                                        {unseenCount > 0 && (
                                            <span className="absolute -top-1 -right-1.5 rounded-full border border-warning-border bg-warning px-1 py-0.5 font-bold text-[0.6rem] text-warning-foreground leading-none">
                                                {unseenCount < 100
                                                    ? unseenCount
                                                    : '99+'}
                                            </span>
                                        )}
                                    </span>
                                </Tab>
                            </button>
                        )}
                    />
                )}

                <MoreSheet>
                    <button type="button" className={tabClassName}>
                        <Tab label="Ще">
                            {user ? (
                                <Avatar className="size-[22px] rounded-sm">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt="avatar"
                                    />
                                    <AvatarFallback className="rounded-sm text-[0.625rem]">
                                        {user.username[0]}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <MaterialSymbolsMoreHoriz />
                            )}
                        </Tab>
                    </button>
                </MoreSheet>
            </div>
        </nav>
    );
};

export default MobileTabBar;
