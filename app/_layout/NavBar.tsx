'use client';

import Link from 'next/link';
import Image from '@/app/_components/Image';
import clsx from 'clsx';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import AuthModal from '@/app/_layout/AuthModal';
import {useState} from "react";

const Component = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { secret, logout } = useAuthContext();
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
                'top-0 left-0 right-0 sticky z-10 bg-transparent',
                'w-full py-2 h-20',
                'border-b border-secondary/30',
                'transition',
                trigger && '!bg-black !border-secondary',
            )}
        >
            <div className="navbar container max-w-screen-xl px-4 mx-auto">
                <div className="navbar-start">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Hikka"
                            width={115}
                            height={34}
                            className="w-full h-6"
                        />
                    </Link>
                </div>
                <div className="navbar-center hidden md:flex">
                    <Link
                        href="/anime"
                        role="button"
                        className="btn-outline btn-md btn"
                    >
                        Аніме
                    </Link>
                </div>
                <div className="navbar-end">
                    {user ? (
                        <div className="join">
                            <Link
                                tabIndex={0}
                                href={`/u/${user.username}`}
                                className="btn-ghost btn-square btn join-item overflow-hidden"
                            >
                                <div className="avatar">
                                    <Image
                                        src={user.avatar}
                                        alt="pfp"
                                        width={44}
                                        height={44}
                                    />
                                </div>
                            </Link>
                            <button
                                className="btn btn-outline join-item"
                                onClick={logout}
                            >
                                Вийти
                            </button>
                        </div>
                    ) : (
                        <button
                            tabIndex={0}
                            className="btn-outline btn-md btn"
                            onClick={() => setOpen(true)}
                        >
                            Увійти
                        </button>
                    )}
                </div>
            </div>
            <AuthModal open={open} setOpen={setOpen} />
        </nav>
    );
};

export default Component;
