'use client';

import clsx from 'clsx';
import Link from 'next/link';

import NavMenu from '@/components/navigation/nav-dropdown';
import { Button } from '@/components/ui/button';

import ProfileMenu from '@/features/common/navbar/profile-menu';
import AuthModal from '@/features/modals/auth-modal/auth-modal.component';
import SearchModal from '@/features/modals/search-modal/search-modal.component';

import useSession from '@/services/hooks/auth/use-session';
import { useMediaQuery } from '@/services/hooks/use-media-query';
import useScrollTrigger from '@/services/hooks/use-scroll-trigger';
import { useModalContext } from '@/services/providers/modal-provider';
import { GENERAL_NAV_ROUTES } from '@/utils/constants/navigation';

import NotificationsMenu from './notifications-menu/notifications-menu.component';

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
                        <div className="logo size-[24px] md:w-[80px]" />
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
                                size="md"
                                variant="ghost"
                                onClick={() =>
                                    openModal({
                                        content: <AuthModal type="login" />,
                                        className: 'max-w-3xl p-0',
                                        forceModal: true,
                                    })
                                }
                            >
                                Увійти
                            </Button>
                            <Button
                                size="md"
                                className="hidden lg:flex"
                                onClick={() =>
                                    openModal({
                                        content: <AuthModal type="signup" />,
                                        className: 'max-w-3xl p-0',
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
