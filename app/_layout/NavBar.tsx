'use client';

import Link from 'next/link';
import Image from '@/app/_components/Image';
import clsx from 'clsx';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import AuthModal from '@/app/_layout/AuthModal';
import {useEffect, useRef, useState} from 'react';
import ProfileMenu from '@/app/_layout/ProfileMenu';
import { useModalContext } from '@/utils/providers/ModalProvider';
import SearchModal from '@/app/_layout/SearchModal';
import MaterialSymbolsSearch from '~icons/material-symbols/search';
import MaterialSymbolsMenu from '~icons/material-symbols/menu';
import { usePathname } from 'next/navigation';
import { useSnackbar } from 'notistack';

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const pathname = usePathname();
    const { switchModal } = useModalContext();
    const profileRef = useRef<HTMLButtonElement>(null);
    const [openProfileMenu, setOpenProfileMenu] = useState<boolean>(false);
    const { secret } = useAuthContext();
    const { data: user } = useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
        enabled: false,
    });

    const trigger = useScrollTrigger({
        threshold: 40,
        disableHysteresis: true,
    });

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
            <div className="navbar container max-w-screen-xl px-4 mx-auto">
                <div className="navbar-start gap-16">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Hikka"
                            width={115}
                            height={34}
                            className="w-full h-6"
                        />
                    </Link>
                    <div className="hidden lg:flex gap-4">
                        <Link
                            href="/anime"
                            className={clsx(
                                'btn-ghost btn-secondary btn btn-sm',
                                pathname === '/anime' && 'btn-outline',
                            )}
                        >
                            Каталог
                        </Link>
                        <Link
                            href="/edit"
                            className={clsx(
                                'btn-ghost btn-secondary btn btn-sm',
                                pathname === '/edit' && 'btn-outline',
                            )}
                        >
                            Правки
                        </Link>
                    </div>
                </div>
                <div className="navbar-center gap-4 ">

                </div>
                <div className="navbar-end gap-4">
                    <button
                        onClick={() => switchModal('search')}
                        className={clsx(
                            'btn btn-outline btn-secondary btn-sm',
                            'bg-secondary/30 hover:!bg-secondary/60',
                            'md:w-44 md:justify-between md:!text-white/60 md:font-normal',
                            'transition-all duration-200',
                            'md:hover:w-60',
                            'items-center'
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <MaterialSymbolsSearch />{' '}
                            <span className="hidden md:block">Пошук...</span>
                        </div>
                        <div className="hidden md:flex items-center">
                            <kbd className="kbd kbd-sm">⌘</kbd>
                            <kbd className="kbd kbd-sm">K</kbd>
                        </div>
                    </button>
                    {user ? (
                        <button
                            ref={profileRef}
                            onClick={() => setOpenProfileMenu(true)}
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
                    <label
                        htmlFor="mobileNavDrawer"
                        className="btn btn-ghost btn-square btn-sm drawer-button lg:hidden flex"
                    >
                        <MaterialSymbolsMenu />
                    </label>
                </div>
            </div>
            <ProfileMenu
                open={openProfileMenu}
                setOpen={setOpenProfileMenu}
                anchorEl={profileRef.current}
            />
            {!user && <AuthModal />}
            <SearchModal />
        </nav>
    );
};

export default Component;
