'use client';

import Link from 'next/link';
import Image from '@/app/_components/Image';
import clsx from 'clsx';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import React, { PropsWithChildren, useRef } from 'react';
import ProfileMenu from './_layout/ProfileMenu';
import { useModalContext } from '@/utils/providers/ModalProvider';
import MaterialSymbolsSearch from '~icons/material-symbols/search';
import { usePopperContext } from '@/utils/providers/PopperProvider';
import NavMenu from '@/app/_layout/navbar/_layout/NavMenu';
import useIsMobile from '@/utils/hooks/useIsMobile';

interface Props extends PropsWithChildren {}

const Component = ({}: Props) => {
    const isMobile = useIsMobile();
    const { switchPopper } = usePopperContext();
    const { switchModal } = useModalContext();
    const profileRef = useRef<HTMLButtonElement>(null);
    const { secret } = useAuthContext();
    const { data: user } = useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
        enabled: false,
    });

    const trigger = useScrollTrigger({
        threshold: isMobile ? 0 : 40,
        disableHysteresis: true,
    });
    const isMac =
        typeof window !== 'undefined'
            ? /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)
            : undefined;

    return (
        <nav
            className={clsx(
                'z-10 bg-transparent',
                'w-full',
                'border-b border-b-secondary/30',
                'transition',
                trigger && '!bg-black !border-b-secondary',
            )}
        >
            <div className="navbar md:gap-8 gap-4 container max-w-[88rem] px-4 mx-auto">
                <div className="flex flex-1 md:gap-8 gap-4 overflow-hidden">
                    <Link href="/" className="w-20 h-full">
                        <Image
                            src="/logo.svg"
                            alt="Hikka"
                            width={80}
                            height={24}
                            className="w-full h-full"
                        />
                    </Link>

                    <div
                        className="flex flex-1 gap-4 items-center overflow-hidden"
                        id="breadcrumbs"
                    >
                        <NavMenu />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => switchModal('search')}
                        className={clsx(
                            'btn btn-outline btn-secondary btn-sm',
                            'bg-secondary/30 hover:!bg-secondary/60',
                            'lg:w-48 lg:justify-between lg:!text-white/60 lg:font-normal',
                            'transition-all duration-200',
                            'lg:hover:w-60',
                            'items-center',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <MaterialSymbolsSearch />{' '}
                            <span className="hidden lg:block">Пошук...</span>
                        </div>
                        {isMac !== undefined ? (
                            <div className="hidden lg:flex items-center">
                                <kbd className="kbd kbd-sm">
                                    {isMac ? '⌘' : 'ctrl'}
                                </kbd>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </div>
                        ) : (
                            <div />
                        )}
                    </button>
                    {user ? (
                        <button
                            ref={profileRef}
                            onClick={() => switchPopper('profile')}
                            className="btn-ghost btn-square btn btn-sm join-item overflow-hidden"
                        >
                            <Image
                                src={user.avatar}
                                alt="pfp"
                                width={44}
                                height={44}
                                className="w-full h-full"
                            />
                        </button>
                    ) : (
                        <>
                            <button
                                className="btn-ghost btn-sm btn"
                                onClick={() => switchModal('login')}
                            >
                                Увійти
                            </button>
                            <button
                                className="hidden lg:flex btn-accent btn-sm btn"
                                onClick={() => switchModal('signup')}
                            >
                                Реєстрація
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div
                className="w-full"
                id="breadcrumbs-mobile"
            />
            {/*<div className="w-full container mx-auto max-w-[88rem] px-4" id="subbar" />*/}
            <ProfileMenu anchorEl={profileRef.current} />
        </nav>
    );
};

export default Component;
