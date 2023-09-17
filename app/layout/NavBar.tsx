'use client';

import Link from 'next/link';
import Image from '@/app/components/Image';
import clsx from 'clsx';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';

const Component = () => {
    const trigger = useScrollTrigger({
        threshold: 40,
        disableHysteresis: true,
    });

    return (
        <nav
            className={clsx(
                'top-0 left-0 right-0 sticky z-10 bg-transparent',
                'w-full py-2 h-20',
                'border-b border-transparent',
                'transition',
                trigger && '!bg-black/90 !border-secondary/30',
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
                        <button
                            tabIndex={0}
                            className="btn-ghost btn-square avatar btn"
                            onClick={() => window.authModal.showModal()}
                        >
                            <div className="w-10">
                                <Image
                                    src="/pfp-temp.png"
                                    alt="pfp"
                                    width={44}
                                    height={43}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Component;
