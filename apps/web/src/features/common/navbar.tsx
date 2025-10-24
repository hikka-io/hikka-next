'use client';

import { useSession } from '@hikka/react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

import { LoginButton } from '@/features/common';
import { SearchModal } from '@/features/modals';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import useScrollTrigger from '@/services/hooks/use-scroll-trigger';
import { cn } from '@/utils/utils';

import ProfileMenu from './components/profile-menu';
import NotificationsMenu from './notifications-menu';

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
                trigger && 'border-b-border !bg-background border-b',
            )}
        >
            <nav className="container relative mx-auto flex min-h-16 items-center gap-4 px-4 md:gap-8">
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
                                className="min-w-24 overflow-hidden"
                            >
                                {item.icon && <item.icon />}
                                <span className="flex-1 truncate">
                                    {item.title_ua}
                                </span>
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
                            <LoginButton />
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
