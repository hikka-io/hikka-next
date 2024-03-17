'use client';

import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';

import AuthModal from '@/components/modals/auth-modal/auth-modal';
import SearchModal from '@/components/modals/search-modal/search-modal';
import NavMenu from '@/components/nav-menu';
import { Button } from '@/components/ui/button';
import useIsMobile from '@/services/hooks/useIsMobile';
import useScrollTrigger from '@/services/hooks/useScrollTrigger';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';
import { useModalContext } from '@/services/providers/modal-provider';
import { GENERAL_NAV_ROUTES } from '@/utils/constants';

import ProfileNavbar from './_components/profile-navbar';

interface Props extends PropsWithChildren {}

const Component = ({}: Props) => {
    const isMobile = useIsMobile();
    const { openModal } = useModalContext();

    let { data: loggedUser } = useLoggedUser();

    const trigger = useScrollTrigger({
        threshold: isMobile ? 0 : 40,
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
                    <Link href="/" className="h-full rounded-md bg-secondary/30 p-2 md:bg-transparent md:p-0">
                        <div className="logo size-[24px] bg-foreground md:w-[80px]" />
                    </Link>
                    <div
                        className="flex min-w-0 flex-1 items-center gap-4"
                        id="breadcrumbs"
                    >
                        <NavMenu isEqualPath={false} showOnMobile routes={GENERAL_NAV_ROUTES} urlPrefix="" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <SearchModal />
                    {loggedUser ? (
                        <ProfileNavbar />
                    ) : (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                    openModal({
                                        content: <AuthModal type="login" />,
                                        className: 'p-0 max-w-3xl',
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
                                    })
                                }
                            >
                                Реєстрація
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="w-full" id="breadcrumbs-mobile" />
            {/*<div className="w-full container mx-auto max-w-[88rem] px-4" id="subbar" />*/}
        </nav>
    );
};

export default Component;
