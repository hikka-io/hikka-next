'use client';

import clsx from 'clsx';
import React from 'react';

import Link from 'next/link';

import NotificationsMenu from '@/app/(pages)/components/navbar/components/notifications-menu';
import ProfileMenu from '@/app/(pages)/components/navbar/components/profile-menu';
import AuthModal from '@/components/modals/auth-modal/auth-modal';
import SearchModal from '@/components/modals/search-modal/search-modal';
import NavMenu from '@/components/navigation/nav-dropdown';
import { Button } from '@/components/ui/button';
import useSession from '@/services/hooks/auth/useSession';
import { useMediaQuery } from '@/services/hooks/useMediaQuery';
import useScrollTrigger from '@/services/hooks/useScrollTrigger';
import { useModalContext } from '@/services/providers/modal-provider';
import { GENERAL_NAV_ROUTES } from '@/utils/constants';

const Navbar = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { openModal } = useModalContext();

    let { user: loggedUser } = useSession();

    const trigger = useScrollTrigger({
        threshold: !isDesktop ? 0 : 40,
        disableHysteresis: true,
    });

    return (
        <nav
            className={clsx(
                'bg-transparent z-10 border-b w-full border-b-secondary/30 transition sticky top-0',
                trigger
                    ? '!border-b-secondary !bg-background'
                    : 'backdrop-blur',
            )}
        >
            <div className="container mx-auto flex min-h-16 max-w-[88rem] items-center gap-4 px-4 md:gap-8">
                <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
                    <Link
                        href="/"
                        className="h-full rounded-md bg-secondary/30 p-2 md:bg-transparent md:p-0"
                    >
                        <div className="logo size-[24px] bg-foreground md:w-[80px]" />
                    </Link>
                    <div
                        className="flex min-w-0 flex-1 items-center gap-4"
                        id="breadcrumbs"
                    >
                        <NavMenu
                            key="main-nav"
                            isEqualPath={false}
                            showOnMobile
                            routes={GENERAL_NAV_ROUTES}
                            urlPrefix=""
                        />
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
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                    openModal({
                                        content: <AuthModal type="login" />,
                                        className: 'p-0 max-w-3xl',
                                        forceModal: true,
                                    })
                                }
                            >
                                Увійти
                            </Button>
                            <Button
                                size="sm"
                                className="hidden lg:flex"
                                onClick={() =>
                                    openModal({
                                        content: <AuthModal type="signup" />,
                                        className: 'p-0 max-w-3xl',
                                        forceModal: true,
                                    })
                                }
                            >
                                Реєстрація
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div
                className="flex h-auto w-full flex-1 items-center gap-4 overflow-hidden px-4 has-[a]:min-h-10 has-[div]:min-h-10 has-[p]:min-h-10 md:hidden"
                id="breadcrumbs-mobile"
            />
        </nav>
    );
};

export default Navbar;
