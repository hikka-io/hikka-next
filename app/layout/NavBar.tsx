'use client';

import Link from 'next/link';
import Image from '@/app/components/Image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const Component = () => {
    const [positionReached, setPositionReached] = useState(
        typeof window !== 'undefined' ? window.scrollY > 40 : false,
    );

    const listenScrollEvent = () => {
        if (window.scrollY > 40) {
            setPositionReached(true);
        } else {
            setPositionReached(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', listenScrollEvent, { passive: true });

        return () => {
            window.removeEventListener('scroll', listenScrollEvent);
        };
    }, []);

    return (
        <nav
            className={clsx(
                'top-0 left-0 right-0 sticky z-10 bg-transparent',
                'w-full py-2 h-20',
                'border-b border-transparent',
                'transition',
                positionReached && '!bg-black/90 !border-secondary/30',
            )}
        >
            <div className="navbar container max-w-screen-xl px-4 mx-auto">
                <div className="navbar-start">
                    <Link href="#">
                        <Image
                            src="/logo.svg"
                            alt="Hikka"
                            width={115}
                            height={34}
                        />
                    </Link>
                </div>
                <div className="navbar-center hidden md:flex">
                    <a
                        href="#"
                        role="button"
                        className="btn-ghost btn-md btn mx-4 px-5"
                    >
                        Манга
                    </a>
                    <a
                        href="#"
                        role="button"
                        className=" btn-outline btn-md btn mx-4 px-5 "
                    >
                        Аніме
                    </a>
                    <a
                        href="#"
                        role="button"
                        className="btn-ghost btn-md btn  mx-4 px-5 "
                    >
                        Ранобе
                    </a>
                </div>
                <div className="navbar-end">
                    <div className="dropdown-end dropdown">
                        <label
                            tabIndex={0}
                            className="btn-ghost btn-circle avatar btn"
                        >
                            <div className="w-10">
                                <Image
                                    src="/pfp-temp.png"
                                    alt="pfp"
                                    width={44}
                                    height={43}
                                />
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu rounded-box menu-sm mt-3 w-52 bg-base-100 p-2 shadow"
                        >
                            <li>
                                <a className="justify-between">Profile</a>
                            </li>
                            <li>
                                <a>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Component;
