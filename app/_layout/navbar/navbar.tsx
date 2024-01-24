'use client';

import clsx from 'clsx';
import React, { PropsWithChildren, useEffect, useState } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import AuthModal from '@/app/_layout/modals/auth-modal';
import SearchModal from '@/app/_layout/modals/search-modal';
import NavMenu from '@/app/_layout/navbar/_layout/nav-menu';
import useIsMobile from '@/utils/hooks/useIsMobile';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';

import ProfileMenu from './_layout/profile-menu';


interface Props extends PropsWithChildren {}

const Component = ({}: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();
    const { openModal } = useModalContext();
    const { secret } = useAuthContext();

    queryClient.setQueryDefaults(['loggedUser'], { gcTime: Infinity });

    let loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const trigger = useScrollTrigger({
        threshold: isMobile ? 0 : 40,
        disableHysteresis: true,
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <nav
            className={clsx(
                'bg-transparent z-10 border-b w-full border-b-secondary/30 transition sticky top-0',
                trigger
                    ? '!border-b-secondary !bg-background'
                    : 'backdrop-blur',
            )}
        >
            <div className="container min-h-16 flex items-center mx-auto max-w-[88rem] gap-4 px-4 md:gap-8">
                <div className="flex items-center flex-1 gap-4 overflow-hidden md:gap-8">
                    <Link href="/" className="h-full w-20">
                        <div className="logo h-[24px] w-[80px] bg-foreground" />
                    </Link>
                    <div
                        className="flex flex-1 items-center gap-4 overflow-hidden"
                        id="breadcrumbs"
                    >
                        <NavMenu />
                    </div>
                </div>
                <div className="flex gap-4">
                    <SearchModal />
                    {loggedUser ? (
                        <ProfileMenu />
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