'use client';

import { useSession } from '@hikka/react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

import { AppSidebar } from '@/features/common';
import { SearchModal } from '@/features/modals';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import useScrollTrigger from '@/services/hooks/use-scroll-trigger';
import { cn } from '@/utils/utils';

import NotificationsMenu from './notifications-menu/notifications-menu';
import ProfileMenu from './profile-menu';

const Navbar = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { toggleSidebar, item } = useSidebar();

    let { user: loggedUser } = useSession();

    const trigger = useScrollTrigger({
        threshold: !isDesktop ? 0 : 40,
        disableHysteresis: true,
    });

    return (
        <header
            className={cn(
                'sticky top-0 z-10 w-full bg-transparent backdrop-blur transition',
                trigger && 'border-b border-b-border !bg-background',
            )}
        >
            <nav className="container relative mx-auto flex min-h-16 items-center gap-4 px-4 md:gap-8">
                <AppSidebar />
                <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
                    <Link className="w-auto p-0" href="/">
                        <div className="logo size-[24px] md:w-[80px]" />
                    </Link>
                    <div
                        className="flex min-w-0 flex-1 items-center gap-4"
                        id="breadcrumbs"
                    >
                        {item && (
                            <Button
                                size="md"
                                variant="outline"
                                onClick={toggleSidebar}
                            >
                                {item.icon && <item.icon />}
                                {item.title_ua}
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex gap-4">
                    <SearchModal />
                    {loggedUser ? (
                        <div className="flex items-center gap-4">
                            <NotificationsMenu />
                            <ProfileMenu />
                        </div>
                    ) : (
                        <>
                            <Button size="md" variant="ghost" asChild>
                                <Link href="/login">Увійти</Link>
                            </Button>
                            <Button
                                size="md"
                                className="hidden lg:flex"
                                asChild
                            >
                                <Link href="/signup">Реєстрація</Link>
                            </Button>
                        </>
                    )}
                </div>
            </nav>
            <div
                className="flex h-auto w-full flex-1 items-center gap-4 overflow-hidden px-4 has-[a]:min-h-10 has-[div]:min-h-10 has-[p]:min-h-10 md:hidden"
                id="breadcrumbs-mobile"
            />
        </header>
    );
};

export default Navbar;
