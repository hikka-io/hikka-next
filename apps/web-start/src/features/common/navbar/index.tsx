'use client';

import { useSession } from '@hikka/react';

import { Button } from '@/components/ui/button';

import { LoginButton, SearchModal } from '@/features/common';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import useScrollTrigger from '@/services/hooks/use-scroll-trigger';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import NotificationsMenu from '../notifications-menu';
import MobileNav from './components/mobile-nav';
import NavMenu from './components/nav-menu';
import ProfileMenu from './components/profile-menu';

const Navbar = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const { user: loggedUser } = useSession();

    const trigger = useScrollTrigger({
        threshold: !isDesktop ? 0 : 40,
        disableHysteresis: true,
    });

    return (
        <header
            className={cn(
                'sticky top-0 z-10 w-full bg-transparent backdrop-blur transition-[background-color,border-color]',
                trigger && 'border-b-border bg-background! border-b',
            )}
        >
            <nav className="relative mx-auto flex min-h-16 w-full max-w-350 items-center gap-4 px-4 md:gap-8">
                <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-6">
                    <Link className="w-auto shrink-0 p-0" to="/">
                        <div className="logo h-6 w-6 md:w-20" />
                    </Link>

                    <div className="hidden min-w-0 flex-1 md:flex">
                        <NavMenu />
                    </div>

                    <div className="flex min-w-0 flex-1 md:hidden">
                        <MobileNav />
                    </div>
                </div>
                <div className="flex gap-2">
                    <SearchModal />
                    {loggedUser ? (
                        <div className="flex items-center gap-2">
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
                                <Link to="/signup">Реєстрація</Link>
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
