'use client';

import clsx from 'clsx';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import MaterialSymbolsSearch from '~icons/material-symbols/search';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import NavMenu from '@/app/_layout/navbar/_layout/nav-menu';
import useIsMobile from '@/utils/hooks/useIsMobile';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';
import { useModalContext } from '@/utils/providers/modal-provider';
import { usePopperContext } from '@/utils/providers/popper-provider';

import ProfileMenu from './_layout/profile-menu';
import ThemeToggle from './_layout/theme-toggle';
import { useAuthContext } from '@/utils/providers/auth-provider';


interface Props extends PropsWithChildren {}

const Component = ({}: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();
    const { switchModal } = useModalContext();
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
    const isMac =
        typeof window !== 'undefined'
            ? /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)
            : undefined;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <nav
            className={clsx(
                'bg-transparent z-10 border-b w-full border-b-secondary/30 transition sticky top-0',
                trigger ? '!border-b-secondary !bg-background' : 'backdrop-blur',
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
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => switchModal('search')}
                        className={clsx(
                            'bg-secondary/30 hover:!bg-secondary/60',
                            'lg:w-48 lg:justify-between lg:font-normal lg:!text-foreground/60',
                            'transition-all duration-200',
                            'lg:hover:w-60',
                            'items-center',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <MaterialSymbolsSearch />{' '}
                            <span className="hidden lg:block">Пошук...</span>
                        </div>
                        <div className="hidden items-center lg:flex">
                            <kbd className="flex pointer-events-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                                    <span className="text-xs">
                                        /
                                    </span>
                            </kbd>
                        </div>
                    </Button>
                    {loggedUser ? (
                        <ProfileMenu />
                    ) : (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => switchModal('login')}
                            >
                                Увійти
                            </Button>
                            <Button
                                size="sm"
                                className="hidden lg:flex"
                                onClick={() => switchModal('signup')}
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