'use client';

import clsx from 'clsx';
import React, { PropsWithChildren, useRef } from 'react';
import MaterialSymbolsDarkModeRounded from '~icons/material-symbols/dark-mode-rounded';
import MaterialSymbolsLightModeRounded from '~icons/material-symbols/light-mode-rounded';
import MaterialSymbolsSearch from '~icons/material-symbols/search';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';

import Image from '@/app/_components/Image';
import NavMenu from '@/app/_layout/navbar/_layout/NavMenu';
import useIsMobile from '@/utils/hooks/useIsMobile';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { usePopperContext } from '@/utils/providers/PopperProvider';
import { useThemeContext } from '@/utils/providers/ThemeProvider';

import ProfileMenu from './_layout/ProfileMenu';


interface Props extends PropsWithChildren {}

const Component = ({}: Props) => {
    const queryClient = useQueryClient();
    const { switchTheme, theme } = useThemeContext();
    const isMobile = useIsMobile();
    const { switchPopper } = usePopperContext();
    const { switchModal } = useModalContext();
    const profileRef = useRef<HTMLButtonElement>(null);

    queryClient.setQueryDefaults(['loggedUser'], { cacheTime: Infinity });

    let loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

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
                'bg-transparent z-10 border-b w-full border-b-secondary/30 transition sticky top-0',
                trigger && '!border-b-secondary !bg-base-100',
            )}
        >
            <div className="container navbar mx-auto max-w-[88rem] gap-4 px-4 md:gap-8">
                <div className="flex flex-1 gap-4 overflow-hidden md:gap-8">
                    <Link href="/" className="h-full w-20">
                        <div className="logo h-[24px] w-[80px] bg-base-content" />
                    </Link>

                    <div
                        className="flex flex-1 items-center gap-4 overflow-hidden"
                        id="breadcrumbs"
                    >
                        <NavMenu />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => switchModal('search')}
                        className={clsx(
                            'btn btn-secondary btn-outline btn-sm',
                            'bg-secondary/30 hover:!bg-secondary/60',
                            'lg:w-48 lg:justify-between lg:font-normal lg:!text-base-content/60',
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
                            <div className="hidden items-center lg:flex">
                                <kbd className="kbd kbd-sm">
                                    {isMac ? '⌘' : 'ctrl'}
                                </kbd>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </div>
                        ) : (
                            <div />
                        )}
                    </button>
                    <label className="btn btn-square btn-secondary btn-ghost swap swap-rotate btn-sm">
                        {/* this hidden checkbox controls the state */}
                        <input
                            type="checkbox"
                            onChange={() =>
                                switchTheme(theme === 'dark' ? 'light' : 'dark')
                            }
                            checked={theme === 'dark'}
                        />

                        {/* hamburger icon */}
                        <MaterialSymbolsLightModeRounded className="swap-off fill-current" />
                        {/* close icon */}
                        <MaterialSymbolsDarkModeRounded className="swap-on fill-current" />
                    </label>
                    {loggedUser ? (
                        <button
                            ref={profileRef}
                            onClick={() => switchPopper('profile')}
                            className="btn btn-square btn-ghost join-item btn-sm overflow-hidden"
                        >
                            <Image
                                src={loggedUser.avatar}
                                alt="pfp"
                                width={44}
                                height={44}
                                className="h-full w-full"
                            />
                        </button>
                    ) : (
                        <>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => switchModal('login')}
                            >
                                Увійти
                            </button>
                            <button
                                className="btn btn-accent btn-sm hidden lg:flex"
                                onClick={() => switchModal('signup')}
                            >
                                Реєстрація
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="w-full" id="breadcrumbs-mobile" />
            {/*<div className="w-full container mx-auto max-w-[88rem] px-4" id="subbar" />*/}
            <ProfileMenu anchorEl={profileRef.current} />
        </nav>
    );
};

export default Component;